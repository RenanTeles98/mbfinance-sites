import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'mb_meta_oauth_state';
type JsonRecord = Record<string, unknown>;

type SocialAccount = {
    id: string;
    platform: 'facebook' | 'instagram';
    name: string;
    handle: string;
    url: string;
    externalId: string;
    pageId?: string;
    connectedAt: string;
    connection: 'meta-oauth';
};

function asRecord(value: unknown): JsonRecord {
    return value && typeof value === 'object' ? value as JsonRecord : {};
}

function asArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

function getString(value: unknown) {
    return typeof value === 'string' ? value : '';
}

function htmlEscape(value: unknown) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getBaseUrl(req: NextRequest) {
    return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

function getGraphVersion() {
    return process.env.META_GRAPH_VERSION || 'v23.0';
}

function popupHtml(payload: JsonRecord) {
    const json = JSON.stringify({ type: 'mb-meta-connect', ...payload }).replace(/</g, '\\u003c');
    const ok = payload.ok === true;
    const title = htmlEscape(ok ? 'Conexão Meta finalizada' : 'Não foi possível concluir a conexão');
    const message = htmlEscape(ok
        ? 'Volte para o admin. Se o perfil não aparecer automaticamente, clique no botão abaixo.'
        : getString(payload.error) || 'Tente conectar novamente pelo admin.');
    const warning = htmlEscape(getString(payload.warning));
    return new NextResponse(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meta</title></head><body style="font-family:Arial,sans-serif;background:#f1f5f9;color:#0f172a;margin:0;min-height:100vh;display:grid;place-items:center;padding:24px"><main style="width:min(460px,100%);background:#fff;border:1px solid #dbe5ee;border-radius:14px;padding:24px;box-shadow:0 18px 50px rgba(15,23,42,.14)"><strong style="display:block;font-size:18px;margin-bottom:8px">${title}</strong><p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 14px">${message}</p>${warning ? `<p style="font-size:13px;line-height:1.6;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:10px 12px;margin:0 0 14px">${warning}</p>` : ''}<p id="meta-status" style="font-size:12px;color:#64748b;margin:0 0 16px">Enviando resultado para o admin...</p><button id="apply" type="button" style="width:100%;border:0;border-radius:10px;background:#003956;color:#fff;font-weight:800;padding:12px 16px;cursor:pointer">Voltar para o admin</button><a href="/admin#videos" style="display:block;text-align:center;margin-top:12px;color:#0099dd;font-size:13px;font-weight:700;text-decoration:none">Abrir admin</a></main><script>var payload=${json};function send(){try{localStorage.setItem('mb_meta_oauth_result_v1',JSON.stringify(payload));}catch(e){}try{window.opener&&window.opener.postMessage(payload,window.location.origin);}catch(e){}var s=document.getElementById('meta-status');if(s)s.textContent='Resultado enviado. Voltando para o admin...'}function finish(){send();if(window.opener&&!window.opener.closed){window.close();setTimeout(function(){window.location.replace('/admin#videos');},900);}else{window.location.replace('/admin#videos');}}send();document.getElementById('apply').addEventListener('click',finish);setTimeout(finish,1200);</script></body></html>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

function popupError(message: string) {
    return popupHtml({ ok: false, error: message });
}

async function graphGet(path: string, token: string, params: Record<string, string> = {}) {
    const version = getGraphVersion();
    const url = new URL('https://graph.facebook.com/' + version + path);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    url.searchParams.set('access_token', token);
    const res = await fetch(url, { cache: 'no-store' });
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
        const error = asRecord(asRecord(data).error);
        throw new Error(getString(error.message) || 'Erro ao consultar Graph API.');
    }
    return asRecord(data);
}

async function exchangeCode(req: NextRequest, code: string) {
    const appId = process.env.META_APP_ID || '';
    const appSecret = process.env.META_APP_SECRET || '';
    if (!appId || !appSecret) throw new Error('META_APP_ID ou META_APP_SECRET não configurados no servidor.');

    const version = getGraphVersion();
    const redirectUri = new URL('/api/meta/callback', getBaseUrl(req)).toString();
    const tokenUrl = new URL('https://graph.facebook.com/' + version + '/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl, { cache: 'no-store' });
    const tokenData: unknown = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok) {
        const error = asRecord(asRecord(tokenData).error);
        throw new Error(getString(error.message) || 'Erro ao trocar autorização da Meta.');
    }
    const shortToken = getString(asRecord(tokenData).access_token);
    if (!shortToken) throw new Error('A Meta não retornou access_token.');

    const longUrl = new URL('https://graph.facebook.com/' + version + '/oauth/access_token');
    longUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longUrl.searchParams.set('client_id', appId);
    longUrl.searchParams.set('client_secret', appSecret);
    longUrl.searchParams.set('fb_exchange_token', shortToken);

    const longRes = await fetch(longUrl, { cache: 'no-store' });
    const longData: unknown = await longRes.json().catch(() => ({}));
    if (!longRes.ok) return shortToken;
    return getString(asRecord(longData).access_token) || shortToken;
}

function buildAccounts(data: JsonRecord): SocialAccount[] {
    const now = new Date().toISOString();
    const accounts: SocialAccount[] = [];
    asArray(data.data).forEach((raw) => {
        const page = asRecord(raw);
        const pageId = getString(page.id);
        const pageName = getString(page.name) || 'Página sem nome';
        const pageUsername = getString(page.username);
        const pageLink = getString(page.link);
        if (pageId) {
            accounts.push({
                id: 'facebook-' + pageId,
                platform: 'facebook',
                name: pageName,
                handle: pageUsername ? '@' + pageUsername : pageLink,
                url: pageLink,
                externalId: pageId,
                connectedAt: now,
                connection: 'meta-oauth',
            });
        }
        const instagram = asRecord(page.instagram_business_account);
        const igId = getString(instagram.id);
        if (igId) {
            const igUsername = getString(instagram.username);
            accounts.push({
                id: 'instagram-' + igId,
                platform: 'instagram',
                name: getString(instagram.name) || igUsername || pageName,
                handle: igUsername ? '@' + igUsername : '',
                url: igUsername ? 'https://www.instagram.com/' + igUsername + '/' : '',
                externalId: igId,
                pageId,
                connectedAt: now,
                connection: 'meta-oauth',
            });
        }
    });
    return accounts;
}

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code') || '';
    const rawState = req.nextUrl.searchParams.get('state') || '';
    const [state] = rawState.split(':');
    const expectedState = req.cookies.get(STATE_COOKIE)?.value || '';

    if (!code) return popupError('Autorização cancelada ou code ausente.');
    if (!state || !expectedState || state !== expectedState) return popupError('Estado OAuth inválido. Tente conectar novamente.');

    try {
        const userToken = await exchangeCode(req, code);
        const pageData = await graphGet('/me/accounts', userToken, {
            fields: 'id,name,username,link,access_token,instagram_business_account{id,username,name,profile_picture_url}',
            limit: '100',
        }).catch(async () => graphGet('/me/accounts', userToken, {
            fields: 'id,name,username,link,access_token',
            limit: '100',
        }));
        const accounts = buildAccounts(pageData);
        if (!accounts.length) {
            return popupError('Nenhuma pagina do Facebook foi encontrada para este login. Entre com a conta que administra a pagina e, na tela da Meta, use Editar configuracoes para marcar todas as paginas que quer liberar para este app.');
        }
        const hasInstagram = accounts.some((account) => account.platform === 'instagram');
        const warning = !hasInstagram
            ? 'As paginas foram conectadas, mas a Meta ainda nao retornou Instagram profissional. Para aparecer aqui, o Instagram precisa ser profissional, estar vinculado a uma pagina retornada e o app precisa ter permissao/produto de Instagram liberado.'
            : '';
        const res = popupHtml({ ok: true, accounts, warning });
        res.cookies.set(STATE_COOKIE, '', { maxAge: 0, path: '/' });
        return res;
    } catch (error) {
        return popupError(error instanceof Error ? error.message : 'Erro ao conectar com a Meta.');
    }
}














import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';
import fs from 'fs';

const TMP_FILE = '/tmp/mb_shortlinks.json';
const ALLOWED_SHORT_LINK_BASES = new Set([
    'https://mbfinance.com.br',
    'https://www.mbfinance.com.br',
    'https://mbnegocios.com.br',
    'https://www.mbnegocios.com.br',
    'https://blog.mbfinance.com.br',
]);
const ALLOWED_DESTINATION_HOSTS = [
    'mbfinance.com.br',
    'mbnegocios.com.br',
    'blog.mbfinance.com.br',
    'wa.me',
    'api.whatsapp.com',
    'whatsapp.com',
];

function generateCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function normalizeRequestedBase(raw: unknown): string | null {
    if (!raw) return null;
    try {
        const parsed = new URL(String(raw));
        const normalized = `${parsed.protocol}//${parsed.host}`.replace(/\/$/, '');
        return ALLOWED_SHORT_LINK_BASES.has(normalized) ? normalized : null;
    } catch {
        return null;
    }
}

function normalizeRequestedCode(raw: unknown): string | null {
    if (!raw) return null;
    const code = String(raw).trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(code)) return null;
    if (code.includes('--')) return null;
    return code;
}

function getOrigin(req: NextRequest, requestedBase: unknown): string {
    const normalizedRequestedBase = normalizeRequestedBase(requestedBase);
    if (normalizedRequestedBase) return normalizedRequestedBase;
    if (process.env.SHORT_LINK_BASE) return process.env.SHORT_LINK_BASE.replace(/\/$/, '');
    const host = req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
}

function isSafeDestination(raw: unknown): boolean {
    try {
        const { hostname, protocol } = new URL(String(raw));
        if (protocol !== 'https:' && protocol !== 'http:') return false;
        return ALLOWED_DESTINATION_HOSTS.some((allowedHost) => (
            hostname === allowedHost || hostname.endsWith(`.${allowedHost}`)
        ));
    } catch {
        return false;
    }
}

// --- storage: Redis se disponível, /tmp/ como fallback ---

async function storeLink(code: string, url: string) {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        await redis.set(`short:${code}`, url, { ex: 60 * 60 * 24 * 365 });
        return;
    }
    // fallback: arquivo em /tmp/ (persiste enquanto o container estiver quente)
    let data: Record<string, string> = {};
    try { data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8')); } catch { /* first use */ }
    data[code] = url;
    fs.writeFileSync(TMP_FILE, JSON.stringify(data));
}

async function getStoredLink(code: string): Promise<string | null> {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        return await redis.get<string>(`short:${code}`);
    }
    try {
        const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        return typeof data[code] === 'string' ? data[code] : null;
    } catch { return null; }
}

async function removeStoredLink(code: string): Promise<boolean> {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        await Promise.all([
            redis.del(`short:${code}`),
            redis.del(`short:${code}:clicks`),
            redis.del(`short:${code}:lastClick`),
        ]);
        return true;
    }
    try {
        const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        if (!data[code]) return false;
        delete data[code];
        fs.writeFileSync(TMP_FILE, JSON.stringify(data));
        return true;
    } catch { return false; }
}
async function codeExists(code: string): Promise<boolean> {
    return (await getStoredLink(code)) !== null;
}
export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => null);
        const url = body?.url;
        if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });
        if (!isSafeDestination(url)) {
            return NextResponse.json({ error: 'URL de destino inválida ou não permitida' }, { status: 400 });
        }
        if (body?.baseUrl && !normalizeRequestedBase(body.baseUrl)) {
            return NextResponse.json({ error: 'Domínio de link curto inválido' }, { status: 400 });
        }

        const requestedCode = body?.customCode ? normalizeRequestedCode(body.customCode) : null;
        if (body?.customCode && !requestedCode) {
            return NextResponse.json({ error: 'Apelido do link inválido. Use letras minúsculas, números e hífen.' }, { status: 400 });
        }

        const origin = getOrigin(req, body?.baseUrl);
        let code = requestedCode || generateCode();
        if (requestedCode) {
            const existingUrl = await getStoredLink(requestedCode);
            if (existingUrl) {
                if (existingUrl === url) {
                    return NextResponse.json({ short: `${origin}/c/${requestedCode}`, code: requestedCode });
                }
                return NextResponse.json({ error: 'Esse apelido de link já está em uso. Escolha outro.' }, { status: 409 });
            }
        }
        let attempts = 0;
        while (!requestedCode && await codeExists(code) && attempts < 5) {
            code = generateCode();
            attempts++;
        }

        await storeLink(code, url);

        return NextResponse.json({ short: `${origin}/c/${code}`, code });

    } catch (err) {
        console.error('[shorten] error:', err);
        return NextResponse.json({ error: 'Erro interno ao encurtar link' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => null);
        const code = normalizeRequestedCode(body?.code);
        if (!code) return NextResponse.json({ error: 'Código inválido' }, { status: 400 });

        const expectedUrl = body?.url ? String(body.url) : '';
        const existingUrl = await getStoredLink(code);
        if (!existingUrl) return NextResponse.json({ ok: true, released: false });
        if (expectedUrl && existingUrl !== expectedUrl) {
            return NextResponse.json({ error: 'O código pertence a outro link e não foi liberado.' }, { status: 409 });
        }

        await removeStoredLink(code);
        return NextResponse.json({ ok: true, released: true });
    } catch (err) {
        console.error('[shorten:delete] error:', err);
        return NextResponse.json({ error: 'Erro interno ao liberar link curto' }, { status: 500 });
    }
}

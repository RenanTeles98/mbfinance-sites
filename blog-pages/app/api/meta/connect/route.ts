import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'mb_meta_oauth_state';

async function isAuthorized(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && await verifySession(token);
}

function getBaseUrl(req: NextRequest) {
    return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

function getGraphVersion() {
    return process.env.META_GRAPH_VERSION || 'v23.0';
}

function renderMessage(message: string) {
    return new NextResponse('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Meta</title></head><body style="font-family:Arial,sans-serif;padding:24px;color:#0f172a"><strong>' + message + '</strong></body></html>', {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

export async function GET(req: NextRequest) {
    if (!(await isAuthorized(req))) {
        return renderMessage('Faça login no admin antes de conectar a Meta.');
    }

    const appId = process.env.META_APP_ID || '';
    if (!appId) {
        return renderMessage('META_APP_ID não configurado no servidor.');
    }

    const platform = req.nextUrl.searchParams.get('platform') === 'facebook' ? 'facebook' : 'instagram';
    const state = crypto.randomBytes(24).toString('hex');
    const redirectUri = new URL('/api/meta/callback', getBaseUrl(req)).toString();
    const graphVersion = getGraphVersion();
    const scopes = [
        'pages_show_list'
    ];

    const oauthUrl = new URL('https://www.facebook.com/' + graphVersion + '/dialog/oauth');
    oauthUrl.searchParams.set('client_id', appId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('state', state + ':' + platform);
    oauthUrl.searchParams.set('scope', scopes.join(','));
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('auth_type', 'rerequest');
    oauthUrl.searchParams.set('return_scopes', 'true');

    const res = NextResponse.redirect(oauthUrl);
    res.cookies.set(STATE_COOKIE, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60,
        path: '/',
    });
    return res;
}




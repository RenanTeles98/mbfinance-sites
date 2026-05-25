import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const TMP_FILE = '/tmp/mb_shortlinks.json';
const TMP_STATS_FILE = '/tmp/mb_shortlink_clicks.json';

const ALLOWED_HOSTS = ['mbfinance.com.br', 'mbnegocios.com.br', 'blog.mbfinance.com.br', 'localhost'];

function isSafeUrl(raw: string): boolean {
    try {
        const { hostname, protocol } = new URL(raw);
        if (protocol !== 'https:' && protocol !== 'http:') return false;
        return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(`.${h}`));
    } catch { return false; }
}

async function getRedis() {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    }
    return null;
}

async function lookupUrl(code: string, redis: Awaited<ReturnType<typeof getRedis>>): Promise<string | null> {
    if (redis) return await redis.get<string>(`short:${code}`);
    try {
        const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        return data[code] || null;
    } catch { return null; }
}

async function registerClick(code: string, redis: Awaited<ReturnType<typeof getRedis>>): Promise<void> {
    if (redis) {
        // Best-effort tracking; redirect still works if this fails.
        await Promise.all([
            redis.incr(`short:${code}:clicks`),
            redis.set(`short:${code}:lastClick`, new Date().toISOString()),
        ]);
        return;
    }
    try {
        let data: Record<string, { clicks: number; lastClick: string | null }> = {};
        try { data = JSON.parse(fs.readFileSync(TMP_STATS_FILE, 'utf-8')); } catch { /* first use */ }
        const current = data[code] || { clicks: 0, lastClick: null };
        data[code] = { clicks: current.clicks + 1, lastClick: new Date().toISOString() };
        fs.writeFileSync(TMP_STATS_FILE, JSON.stringify(data));
    } catch { /* non-critical */ }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = params;
    if (!code) return NextResponse.redirect('/');

    try {
        const redis = await getRedis();
        const url = await lookupUrl(code, redis);

        if (!url) {
            return new NextResponse('Link não encontrado ou expirado.', { status: 404 });
        }
        if (!isSafeUrl(url)) {
            return new NextResponse('Destino inválido.', { status: 400 });
        }

        try { await registerClick(code, redis); } catch (err) { console.error('[shortlink-click] error:', err); }

        return NextResponse.redirect(url, 302);
    } catch {
        return new NextResponse('Erro interno.', { status: 500 });
    }
}

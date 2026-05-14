import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const TMP_FILE = '/tmp/mb_shortlinks.json';

function generateCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function getOrigin(req: NextRequest): string {
    if (process.env.SHORT_LINK_BASE) return process.env.SHORT_LINK_BASE.replace(/\/$/, '');
    const host = req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
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

async function codeExists(code: string): Promise<boolean> {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        return !!(await redis.exists(`short:${code}`));
    }
    try {
        const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        return !!data[code];
    } catch { return false; }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);
        const url = body?.url;
        if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

        let code = generateCode();
        let attempts = 0;
        while (await codeExists(code) && attempts < 5) {
            code = generateCode();
            attempts++;
        }

        await storeLink(code, url);

        const origin = getOrigin(req);
        return NextResponse.json({ short: `${origin}/c/${code}` });

    } catch (err) {
        console.error('[shorten] error:', err);
        return NextResponse.json({ error: 'Erro interno ao encurtar link' }, { status: 500 });
    }
}

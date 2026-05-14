import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const TTL_SECONDS = 60 * 60 * 24 * 365;

function generateCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function getOrigin(req: NextRequest): string {
    const host = req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '');
    return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);
        const url = body?.url;
        if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            return NextResponse.json({ error: 'Redis não configurado' }, { status: 503 });
        }

        const redis = new Redis({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });

        let code = generateCode();
        let attempts = 0;
        while (attempts < 5) {
            const exists = await redis.exists(`short:${code}`);
            if (!exists) break;
            code = generateCode();
            attempts++;
        }

        await redis.set(`short:${code}`, url, { ex: TTL_SECONDS });

        const origin = getOrigin(req);
        return NextResponse.json({ short: `${origin}/c/${code}` });

    } catch (err) {
        console.error('[shorten] error:', err);
        return NextResponse.json({ error: 'Erro interno ao encurtar link' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 ano

function getRedis() {
    return new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
    });
}

function generateCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

export async function POST(req: NextRequest) {
    const { url } = await req.json().catch(() => ({ url: null }));
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    const redis = getRedis();

    let code = generateCode();
    let attempts = 0;
    while (await redis.exists(`short:${code}`) && attempts < 5) {
        code = generateCode();
        attempts++;
    }

    await redis.set(`short:${code}`, url, { ex: TTL_SECONDS });

    const origin = req.nextUrl.origin;
    return NextResponse.json({ short: `${origin}/c/${code}` });
}

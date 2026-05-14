import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const TMP_FILE = '/tmp/mb_shortlinks.json';

async function lookupUrl(code: string): Promise<string | null> {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        return await redis.get<string>(`short:${code}`);
    }
    try {
        const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        return data[code] || null;
    } catch { return null; }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = params;
    if (!code) return NextResponse.redirect('/');

    try {
        const url = await lookupUrl(code);
        if (!url) {
            return new NextResponse('Link não encontrado ou expirado.', { status: 404 });
        }
        return NextResponse.redirect(url, 302);
    } catch {
        return new NextResponse('Erro interno.', { status: 500 });
    }
}

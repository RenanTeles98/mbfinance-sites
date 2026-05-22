import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const TMP_FILE = '/tmp/mb_shortlinks.json';

const ALLOWED_HOSTS = ['mbfinance.com.br', 'mbnegocios.com.br', 'blog.mbfinance.com.br', 'localhost'];

function isSafeUrl(raw: string): boolean {
    try {
        const { hostname, protocol } = new URL(raw);
        if (protocol !== 'https:' && protocol !== 'http:') return false;
        return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(`.${h}`));
    } catch { return false; }
}

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
        if (!isSafeUrl(url)) {
            return new NextResponse('Destino inválido.', { status: 400 });
        }
        return NextResponse.redirect(url, 302);
    } catch {
        return new NextResponse('Erro interno.', { status: 500 });
    }
}

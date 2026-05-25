import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ALLOWED_HOSTS = ['mbfinance.com.br', 'mbnegocios.com.br', 'blog.mbfinance.com.br', 'localhost'];

function isSafeUrl(raw: string): boolean {
    try {
        const { hostname, protocol } = new URL(raw);
        if (protocol !== 'https:' && protocol !== 'http:') return false;
        return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(`.${h}`));
    } catch { return false; }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = params;
    if (!code) return NextResponse.redirect('/');

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        return new NextResponse('Serviço indisponível.', { status: 503 });
    }

    try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });

        const url = await redis.get<string>(`short:${code}`);

        if (!url) return new NextResponse('Link não encontrado ou expirado.', { status: 404 });
        if (!isSafeUrl(url)) return new NextResponse('Destino inválido.', { status: 400 });

        // fire-and-forget — não atrasa o redirect
        redis.incr(`short:${code}:clicks`).catch(() => {});
        redis.set(`short:${code}:lastClick`, new Date().toISOString()).catch(() => {});

        return NextResponse.redirect(url, 302);
    } catch {
        return new NextResponse('Erro interno.', { status: 500 });
    }
}

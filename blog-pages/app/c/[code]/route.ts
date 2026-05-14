import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

function getRedis() {
    return new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
    });
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = params;
    if (!code) return NextResponse.redirect('/');

    try {
        const redis = getRedis();
        const url = await redis.get<string>(`short:${code}`);
        if (!url) {
            return new NextResponse('Link não encontrado ou expirado.', { status: 404 });
        }
        return NextResponse.redirect(url, 302);
    } catch {
        return new NextResponse('Erro interno.', { status: 500 });
    }
}

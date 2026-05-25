import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const CATEGORY_THEMES: Record<string, string> = {
    'credito': 'business loan approval, money flow, financial growth charts, coins and banknotes',
    'gestao': 'financial management dashboard, cash flow charts, business planning, spreadsheets',
    'conta-pj': 'digital banking, smartphone with banking app, modern corporate bank account',
    'mercado': 'Brazilian economy, financial market, stock charts, business news',
    'antecipacao': 'cash advance, receivables, credit card machine, instant payment',
    'noticias': 'financial news, Brazilian business, economy headlines',
};

function buildPrompt(title: string, category: string): string {
    const theme = CATEGORY_THEMES[category] || 'Brazilian business finance, corporate, professional';

    return `Professional blog cover image for a Brazilian financial company called MB Finance.
Theme: ${theme}. Inspired by the article title: "${title}".
Visual style: modern flat illustration, clean fintech design, dark navy blue background (#003956),
accents of sky blue (#0099dd) and white. Abstract geometric shapes, subtle grid lines,
glowing light effects. Professional and trustworthy mood.
No text, no letters, no words, no logos.
Widescreen 16:9 composition. High quality, sharp, corporate fintech aesthetic.`.replace(/\n/g, ' ');
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.FAL_KEY) {
        return NextResponse.json({ error: 'FAL_KEY não configurada no servidor.' }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.title) {
        return NextResponse.json({ error: 'title obrigatório' }, { status: 400 });
    }

    const { title, category = '' } = body;
    const prompt = buildPrompt(title, category);

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `Key ${process.env.FAL_KEY}`,
        },
        body: JSON.stringify({
            prompt,
            image_size: 'landscape_16_9',
            num_inference_steps: 4,
            num_images: 1,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[generate-image] fal.ai error:', err);
        let detail = '';
        try { detail = JSON.parse(err)?.detail || err; } catch { detail = err; }
        return NextResponse.json({ error: 'Erro ao gerar imagem: ' + detail }, { status: 502 });
    }

    const data = await response.json();
    const imageUrl = data?.images?.[0]?.url;

    if (!imageUrl) {
        return NextResponse.json({ error: 'Nenhuma imagem retornada pela IA.' }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl });
}

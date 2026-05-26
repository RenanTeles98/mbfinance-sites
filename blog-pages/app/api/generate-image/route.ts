import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const CATEGORY_SCENES: Record<string, string> = {
    'credito': 'a confident Brazilian business owner smiling while looking at a phone, relief on their face, modern office background',
    'gestao': 'a focused Brazilian entrepreneur reviewing documents at a clean desk, natural light, calm and organized environment',
    'conta-pj': 'a Brazilian small business owner holding a smartphone with a satisfied expression, casual professional attire',
    'mercado': 'a Brazilian professional standing in a modern office, thoughtful expression, city skyline visible through window',
    'antecipacao': 'a Brazilian business owner with a relieved smile, looking at a tablet, bright and airy workspace',
    'noticias': 'a Brazilian entrepreneur reading news on a tablet in a café, engaged and thoughtful expression',
    'seguros': 'a Brazilian business couple shaking hands with an advisor, warm and trustworthy atmosphere',
    'tributario': 'a focused Brazilian accountant or business owner at a desk with papers, calm and professional setting',
    'telemedicina': 'a Brazilian person having a video call on a laptop, comfortable home or office setting, relieved expression',
    'solucoes-personalizadas': 'a Brazilian executive in a modern meeting room, confident posture, clean corporate environment',
};

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ error: 'GROQ_API_KEY não configurada no servidor.' }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.title) {
        return NextResponse.json({ error: 'title obrigatório' }, { status: 400 });
    }

    const { title, category = '' } = body;
    const scene = CATEGORY_SCENES[category] || 'a confident Brazilian business owner smiling in a modern office, natural and approachable';

    const systemPrompt = `You are an expert at writing DALL-E 3 image generation prompts for blog covers.
Your prompts produce minimalist editorial photography — clean, real, warm and relatable.
Style reference: Bloomberg Businessweek covers, Nubank / iFood marketing photography.
Text in the image must always be in Portuguese (pt-BR), short, and placed as a subtle environmental element — never as a headline overlay.`;

    const userPrompt = `Write a DALL-E 3 prompt for a blog cover image.

Article title: "${title}"
Scene: ${scene}

Rules:
- Style: minimalist editorial photography, soft natural light, clean navy blue background
- Color palette: deep navy blue (#003956) dominant, with white or sky blue accents in clothing or props
- ONE person, Brazilian-looking, that the reader identifies with — entrepreneur, business owner, professional
- Expression matches the article emotion: relief, confidence, focus, or satisfaction
- Composition: 16:9 widescreen, subject slightly off-center, generous negative space on one side
- Add ONE subtle contextual element that makes the image less generic — choose the most natural fit:
  • A small framed sign or whiteboard in the background with 2–3 short Portuguese words related to the theme (e.g. "Crédito / Crescimento / Resultado")
  • OR a coffee mug, notebook, or prop with a single short Portuguese word on it
  • OR a very subtle, small icon/badge near a prop (phone screen, laptop, notepad) — minimal, not dominant
- The text element must be small, environmental, secondary — never a headline or main focus
- NO charts, NO dashboards, NO complex graphics, NO overlay text
- Photorealistic, not illustration

Return ONLY the prompt, no explanation, no quotes, no prefix.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 300,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        let detail = '';
        try { detail = JSON.parse(err)?.error?.message || err; } catch { detail = err; }
        return NextResponse.json({ error: 'Erro ao gerar prompt: ' + detail }, { status: 502 });
    }

    const data = await response.json();
    const prompt = (data.choices?.[0]?.message?.content || '').trim();

    return NextResponse.json({ prompt });
}

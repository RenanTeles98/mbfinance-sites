import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const CATEGORY_THEMES: Record<string, string> = {
    'credito': 'fluxo de dinheiro, aprovação de crédito, crescimento financeiro, moedas e notas',
    'gestao': 'dashboard financeiro, gráficos de fluxo de caixa, planejamento empresarial',
    'conta-pj': 'banco digital, app bancário no smartphone, conta empresarial moderna',
    'mercado': 'mercado financeiro brasileiro, gráficos de ações, notícias de negócios',
    'antecipacao': 'antecipação de recebíveis, maquininha de cartão, pagamento instantâneo',
    'noticias': 'economia brasileira, notícias financeiras, empresas e negócios',
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
    const categoryTheme = CATEGORY_THEMES[category] || 'finanças empresariais, negócios, corporativo';

    const systemPrompt = `Você é especialista em criar prompts para geração de imagens com DALL-E 3.
Sempre gera prompts em inglês, detalhados, otimizados para DALL-E 3.
A identidade visual da MB Finance é: fundo azul marinho escuro (#003956), acentos em azul claro (#0099dd) e branco, estilo flat illustration moderno, estética fintech clean e profissional.
Se o prompt incluir qualquer texto, rótulo ou palavra visível na imagem, esse texto deve estar obrigatoriamente em português do Brasil.`;

    const userPrompt = `Crie um prompt DALL-E 3 para a capa de um artigo de blog com o título: "${title}"
Tema visual do artigo: ${categoryTheme}

O prompt deve:
- Descrever uma ilustração flat moderna, estilo fintech/corporativo
- Usar fundo azul marinho escuro com acentos em azul claro e branco
- Incluir elementos visuais que representem o tema do artigo
- Ser composição widescreen 16:9
- Se houver qualquer texto ou palavra na imagem, deve obrigatoriamente estar em português do Brasil
- Ser em inglês, detalhado e direto

Retorne APENAS o prompt, sem explicações, sem aspas, sem prefixo.`;

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

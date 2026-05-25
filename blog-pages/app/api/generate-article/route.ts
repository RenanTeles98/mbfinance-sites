import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const MB_CONTEXT = `
Você é um redator especialista da MB Finance, hub financeiro para empresas PJ brasileiro (MEI até médias empresas).

MISSÃO DO BLOG: Educar o empresário sobre as suas dores financeiras. Nunca vender diretamente — primeiro aumentar o nível de consciência sobre o problema, depois apresentar a solução.

PRODUTOS MB FINANCE:
- Conta PJ: conta sem burocracia, sem taxa, para qualquer CNPJ
- Capital de Giro: crédito rápido para capital de giro, aprovação em 24h
- Antecipação de Recebíveis: antecipar recebíveis de cartão e boleto
- Máquina de Cartão: maquininha com as melhores taxas do mercado

PÚBLICO: Empresários PJ brasileiros, linguagem direta, sem jargão excessivo.
TOM: Especialista confiante, empático com a dor do empresário, orientado a resultado.
DIFERENCIAL MB FINANCE: IA que conecta a MÚLTIPLOS bancos — não fica preso às condições de um único banco.

REGRAS DE ESCRITA:
- Linguagem clara, direta, sem rodeios
- Parágrafos curtos (3-4 linhas max)
- Use dados, exemplos práticos e situações do cotidiano do empresário
- Mencione MB Finance naturalmente no final, como solução — nunca no título, nunca de forma forçada
- Use negrito para destacar pontos-chave
- Conclua com um CTA suave apontando para a solução MB Finance
`.trim();

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

    const { title, category = '', keyword = '', notes = '', awarenessLevel = '', excerptOnly = false } = body;

    const userPrompt = excerptOnly
        ? `Escreva um resumo de 1 a 2 frases atrativas para o artigo de blog abaixo. O resumo aparece nos cards do blog e deve capturar a dor do empresário e despertar curiosidade para clicar. Retorne APENAS o texto do resumo, sem aspas, sem prefixo.

TÍTULO DO ARTIGO: ${title}`.trim()
        : `
Escreva um artigo completo de blog para a MB Finance com as seguintes informações:

TÍTULO: ${title}
${category ? `CATEGORIA: ${category}` : ''}
${keyword ? `KEYWORD PRINCIPAL: ${keyword}` : ''}
${awarenessLevel ? `NÍVEL DE CONSCIÊNCIA: ${awarenessLevel}` : ''}
${notes ? `ÂNGULO E TÓPICOS:\n${notes}` : ''}

ESTRUTURA ESPERADA:
1. Introdução (1-2 parágrafos que capturam a dor do empresário)
2. 3 a 4 seções com subtítulos H2 desenvolvendo o tema
3. Conclusão com menção natural à MB Finance e CTA suave

FORMATO DE SAÍDA — retorne APENAS HTML limpo, sem markdown, sem \`\`\`html, sem texto antes ou depois:
- Use <h2>...</h2> para subtítulos
- Use <p>...</p> para parágrafos
- Use <strong>...</strong> para destaques
- Use <ul><li>...</li></ul> para listas
- Use <blockquote>...</blockquote> para citações ou destaques importantes
- NÃO inclua <html>, <head>, <body> nem <h1> (o título já está no campo acima)
`.trim();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: MB_CONTEXT },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: excerptOnly ? 120 : 3000,
            temperature: 0.65,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[generate-article] Groq error:', err);
        let detail = '';
        try { detail = JSON.parse(err)?.error?.message || err; } catch { detail = err; }
        return NextResponse.json({ error: 'Erro ao chamar a IA: ' + detail }, { status: 502 });
    }

    const data = await response.json();
    const raw = (data.choices?.[0]?.message?.content || '').trim();

    if (excerptOnly) {
        return NextResponse.json({ excerpt: raw });
    }

    // Strip any accidental markdown code fences
    const html = raw.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();
    return NextResponse.json({ html });
}

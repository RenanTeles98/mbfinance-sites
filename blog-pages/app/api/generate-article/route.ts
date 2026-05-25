import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const PRODUCTS: Record<string, { name: string; pitch: string; pain: string }> = {
    'conta-pj': {
        name: 'Conta PJ',
        pitch: 'A MB Finance oferece Conta PJ 100% gratuita, sem burocracia, aprovada para qualquer CNPJ — MEI, ME ou empresa de médio porte. Zero taxas de manutenção.',
        pain: 'burocracia bancária, taxas abusivas, limitações do banco único',
    },
    'capital-de-giro': {
        name: 'Capital de Giro',
        pitch: 'A MB Finance conecta sua empresa a múltiplos bancos e fintech ao mesmo tempo, garantindo as melhores condições de crédito para capital de giro — com aprovação em até 24 horas.',
        pain: 'falta de caixa, fluxo de caixa negativo, dificuldade de pagar fornecedores',
    },
    'antecipacao': {
        name: 'Antecipação de Recebíveis',
        pitch: 'Com a MB Finance você antecipa recebíveis de cartão e boleto de forma simples e com as melhores taxas do mercado — o dinheiro na sua conta em horas, não em semanas.',
        pain: 'dinheiro preso em recebíveis, espera longa para receber, capital imobilizado',
    },
    'maquininha': {
        name: 'Máquina de Cartão',
        pitch: 'A maquininha da MB Finance tem as menores taxas do mercado e recebimento na hora — sem aluguel, sem fidelidade, sem letra miúda.',
        pain: 'taxas altas na maquininha, perda de vendas, demora para receber',
    },
};

const MB_CONTEXT = `
Você é um redator especialista da MB Finance, hub financeiro para empresas PJ brasileiro (MEI até médias empresas).

MISSÃO DO BLOG: Educar o empresário sobre as suas dores financeiras. O artigo deve informar e ao mesmo tempo conduzir o leitor naturalmente a perceber que precisa do produto da MB Finance.

PÚBLICO: Empresários PJ brasileiros, linguagem direta, sem jargão excessivo.
TOM: Especialista confiante, empático com a dor do empresário, orientado a resultado.
DIFERENCIAL MB FINANCE: IA que conecta a MÚLTIPLOS bancos — não fica preso às condições de um único banco.

REGRAS DE ESCRITA:
- Linguagem clara, direta, parágrafos curtos (3-4 linhas max)
- Use dados, exemplos práticos e situações do cotidiano do empresário
- Use negrito para destacar pontos-chave
- Construa o artigo como uma jornada: dor → consciência → solução
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

    const { title, category = '', keyword = '', notes = '', awarenessLevel = '', excerptOnly = false, product = '' } = body;

    const productInfo = PRODUCTS[product];

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
${productInfo ? `
PRODUTO A VENDER: ${productInfo.name}
DOR QUE ESSE PRODUTO RESOLVE: ${productInfo.pain}
PITCH DO PRODUTO: ${productInfo.pitch}
` : ''}

ESTRUTURA ESPERADA:
1. Introdução (1-2 parágrafos que capturam a dor do empresário — desperte empatia imediata)
2. 3 a 4 seções com subtítulos H2 desenvolvendo o tema e aprofundando a consciência do problema
3. Conclusão persuasiva: conduza o leitor a sentir que precisa resolver isso agora${productInfo ? ` — mencione a MB Finance e o ${productInfo.name} de forma natural, como se fosse a solução óbvia. O tom deve fazer o leitor pensar "eu preciso disso". NÃO seja forçado — a menção deve surgir como consequência lógica do problema apresentado.` : ' — mencione a MB Finance como solução de forma natural.'}

FORMATO DE SAÍDA — retorne APENAS HTML limpo, sem markdown, sem \`\`\`html, sem texto antes ou depois:
- Use <h2>...</h2> para subtítulos
- Use <p>...</p> para parágrafos
- Use <strong>...</strong> para destaques
- Use <ul><li>...</li></ul> para listas
- Use <blockquote>...</blockquote> para citações ou destaques importantes
- NÃO inclua <html>, <head>, <body> nem <h1>
- NÃO inclua botão de CTA — ele será adicionado automaticamente pelo sistema
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

    const html = raw.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();
    return NextResponse.json({ html });
}

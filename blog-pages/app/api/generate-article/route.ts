import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const PRODUCTS: Record<string, { name: string; pitch: string; pain: string }> = {
    'conta-pj': {
        name: 'Conta Corrente Empresarial',
        pitch: 'A MB Finance simplifica a abertura de conta empresarial nos principais bancos — sem burocracia, sem filas, com toda a estrutura que o seu CNPJ precisa para operar.',
        pain: 'burocracia bancária, dificuldade de abrir conta PJ, limitações do banco único',
    },
    'maquininha': {
        name: 'Máquina de Cartão',
        pitch: 'A MB Finance oferece maquininhas e soluções de gateway de pagamento com as menores taxas do mercado e recebimento na hora — sem aluguel, sem fidelidade.',
        pain: 'taxas altas na maquininha, perda de vendas, demora para receber',
    },
    'credito-rapido': {
        name: 'Crédito Rápido',
        pitch: 'A MB Finance conecta sua empresa a múltiplos bancos simultaneamente para crédito empresarial, imobiliário e veicular — aprovação ágil com as melhores condições do mercado.',
        pain: 'dificuldade de conseguir crédito, juros altos, burocracia para financiamento',
    },
    'antecipacao': {
        name: 'Antecipação de Recebíveis',
        pitch: 'Com a MB Finance você antecipa recebíveis de cartão e boleto com as melhores taxas do mercado — o dinheiro cai na sua conta em horas, não em semanas.',
        pain: 'dinheiro preso em recebíveis, espera longa para receber, capital imobilizado',
    },
    'seguros': {
        name: 'Seguros e Consórcios',
        pitch: 'A MB Finance estrutura a proteção patrimonial e o planejamento de aquisições da sua empresa — seguros empresariais e consórcios com as melhores condições do mercado.',
        pain: 'patrimônio desprotegido, falta de planejamento para aquisições, riscos empresariais',
    },
    'tributario': {
        name: 'Soluções Tributárias',
        pitch: 'A MB Finance oferece diagnóstico, recuperação e planejamento fiscal para sua empresa pagar menos impostos dentro da lei — com especialistas que conhecem a realidade do empresário PJ.',
        pain: 'carga tributária alta, impostos mal planejados, passivo fiscal acumulado',
    },
    'telemedicina': {
        name: 'Telemedicina',
        pitch: 'Com a MB Finance, sua empresa oferece acesso a médico na tela para toda a família dos colaboradores — benefício de saúde acessível, sem custo de plano de saúde tradicional.',
        pain: 'falta de benefício de saúde, custo alto de plano de saúde, dificuldade de reter talentos',
    },
    'solucoes-personalizadas': {
        name: 'Soluções Personalizadas',
        pitch: 'Para grandes empresas, a MB Finance estrutura operações financeiras sob medida — crédito estruturado, gestão de passivo e soluções que os bancos tradicionais não conseguem entregar.',
        pain: 'operações complexas, falta de soluções sob medida, limitações dos bancos tradicionais',
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
    const { title = '', category = '', keyword = '', notes = '', awarenessLevel = '', excerptOnly = false, titleOnly = false, seoOnly = false, seoField = 'all', product = '' } = body || {};

    if (!title && !titleOnly && !excerptOnly) {
        return NextResponse.json({ error: 'title obrigatório' }, { status: 400 });
    }

    const productInfo = PRODUCTS[product];

    if (seoOnly) {
        const fieldInstructions: Record<string, string> = {
            title: `Retorne APENAS um JSON: { "seoTitle": "Título SEO com até 60 caracteres, pode terminar com | MB Finance" }`,
            desc:  `Retorne APENAS um JSON: { "seoDesc": "Meta descrição de 140-155 caracteres que desperta curiosidade e inclui a palavra-chave principal" }`,
            keywords: `Retorne APENAS um JSON: { "keywords": "palavra-chave 1, palavra-chave 2, palavra-chave 3, palavra-chave 4, palavra-chave 5" }`,
            all: `Retorne APENAS um JSON com este formato exato:
{ "seoTitle": "...", "seoDesc": "...", "keywords": "..." }`,
        };

        const seoPrompt = `Gere os dados de SEO para um artigo de blog da MB Finance.

TÍTULO DO ARTIGO: ${title}
${category ? `CATEGORIA: ${category}` : ''}
${productInfo ? `PRODUTO: ${productInfo.name}` : ''}

${fieldInstructions[seoField] || fieldInstructions.all}

Sem texto antes ou depois do JSON.`.trim();

        const seoRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `Bearer ${process.env.GROQ_API_KEY}` },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: seoPrompt }],
                max_tokens: 300,
                temperature: 0.5,
            }),
        });
        if (!seoRes.ok) return NextResponse.json({ error: 'Erro ao gerar SEO.' }, { status: 502 });
        const seoData = await seoRes.json();
        const rawSeo = (seoData.choices?.[0]?.message?.content || '').trim();
        const matchSeo = rawSeo.match(/\{[\s\S]*\}/);
        if (!matchSeo) return NextResponse.json({ error: 'Resposta inesperada da IA.' }, { status: 500 });
        const seo = JSON.parse(matchSeo[0]);
        return NextResponse.json(seo);
    }

    if (titleOnly) {
        const titlePrompt = `Gere 3 opções de título SEO para um artigo de blog da MB Finance.
${category ? `Categoria: ${category}` : ''}
${productInfo ? `Produto a vender: ${productInfo.name}` : ''}
${notes ? `Tema / ângulo: ${notes}` : ''}

Regras:
- Máximo 65 caracteres cada
- Formatos que funcionam: "Como...", "Por que...", listas ("X formas de..."), perguntas diretas
- Deve capturar a dor do empresário, não mencionar MB Finance
- Títulos diferentes entre si (não repita a mesma estrutura)

Retorne APENAS um JSON array com 3 strings, sem texto antes ou depois:
["Título 1", "Título 2", "Título 3"]`.trim();

        const titleRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `Bearer ${process.env.GROQ_API_KEY}` },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: titlePrompt }],
                max_tokens: 200,
                temperature: 0.8,
            }),
        });
        if (!titleRes.ok) return NextResponse.json({ error: 'Erro ao gerar títulos.' }, { status: 502 });
        const titleData = await titleRes.json();
        const raw = (titleData.choices?.[0]?.message?.content || '').trim();
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) return NextResponse.json({ error: 'Resposta inesperada da IA.' }, { status: 500 });
        const titles: string[] = JSON.parse(match[0]);
        return NextResponse.json({ titles });
    }

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

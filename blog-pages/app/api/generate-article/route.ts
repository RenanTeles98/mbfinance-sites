import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const PRODUCTS: Record<string, { name: string; pitch: string; pain: string }> = {
    'conta-pj': {
        name: 'Conta Corrente Empresarial',
        pitch: 'A Mb Finance simplifica a abertura de conta empresarial nos principais bancos â€” sem burocracia, sem filas, com toda a estrutura que o seu CNPJ precisa para operar.',
        pain: 'burocracia bancÃ¡ria, dificuldade de abrir conta PJ, limitaÃ§Ãµes do banco Ãºnico',
    },
    'maquininha': {
        name: 'MÃ¡quina de CartÃ£o',
        pitch: 'A Mb Finance oferece maquininhas e soluÃ§Ãµes de gateway de pagamento com as menores taxas do mercado e recebimento na hora â€” sem aluguel, sem fidelidade.',
        pain: 'taxas altas na maquininha, perda de vendas, demora para receber',
    },
    'credito-rapido': {
        name: 'CrÃ©dito RÃ¡pido',
        pitch: 'A Mb Finance conecta sua empresa a mÃºltiplos bancos simultaneamente para crÃ©dito empresarial, imobiliÃ¡rio e veicular â€” aprovaÃ§Ã£o Ã¡gil com as melhores condiÃ§Ãµes do mercado.',
        pain: 'dificuldade de conseguir crÃ©dito, juros altos, burocracia para financiamento',
    },
    'antecipacao': {
        name: 'AntecipaÃ§Ã£o de RecebÃ­veis',
        pitch: 'Com a Mb Finance vocÃª antecipa recebÃ­veis de cartÃ£o e boleto com as melhores taxas do mercado â€” o dinheiro cai na sua conta em horas, nÃ£o em semanas.',
        pain: 'dinheiro preso em recebÃ­veis, espera longa para receber, capital imobilizado',
    },
    'seguros': {
        name: 'Seguros e ConsÃ³rcios',
        pitch: 'A Mb Finance estrutura a proteÃ§Ã£o patrimonial e o planejamento de aquisiÃ§Ãµes da sua empresa â€” seguros empresariais e consÃ³rcios com as melhores condiÃ§Ãµes do mercado.',
        pain: 'patrimÃ´nio desprotegido, falta de planejamento para aquisiÃ§Ãµes, riscos empresariais',
    },
    'tributario': {
        name: 'SoluÃ§Ãµes TributÃ¡rias',
        pitch: 'A Mb Finance oferece diagnÃ³stico, recuperaÃ§Ã£o e planejamento fiscal para sua empresa pagar menos impostos dentro da lei â€” com especialistas que conhecem a realidade do empresÃ¡rio PJ.',
        pain: 'carga tributÃ¡ria alta, impostos mal planejados, passivo fiscal acumulado',
    },
    'telemedicina': {
        name: 'Telemedicina',
        pitch: 'Com a Mb Finance, sua empresa oferece acesso a mÃ©dico na tela para toda a famÃ­lia dos colaboradores â€” benefÃ­cio de saÃºde acessÃ­vel, sem custo de plano de saÃºde tradicional.',
        pain: 'falta de benefÃ­cio de saÃºde, custo alto de plano de saÃºde, dificuldade de reter talentos',
    },
    'solucoes-personalizadas': {
        name: 'SoluÃ§Ãµes Personalizadas',
        pitch: 'Para grandes empresas, a Mb Finance estrutura operaÃ§Ãµes financeiras sob medida â€” crÃ©dito estruturado, gestÃ£o de passivo e soluÃ§Ãµes que os bancos tradicionais nÃ£o conseguem entregar.',
        pain: 'operaÃ§Ãµes complexas, falta de soluÃ§Ãµes sob medida, limitaÃ§Ãµes dos bancos tradicionais',
    },
};

const MB_CONTEXT = `
VocÃª Ã© um redator especialista da Mb Finance, hub financeiro para empresas PJ brasileiro (MEI atÃ© mÃ©dias empresas).

MISSÃƒO DO BLOG: Educar o empresÃ¡rio sobre as suas dores financeiras. O artigo deve informar e ao mesmo tempo conduzir o leitor naturalmente a perceber que precisa do produto da Mb Finance.

PÃšBLICO: EmpresÃ¡rios PJ brasileiros, linguagem direta, sem jargÃ£o excessivo.
TOM: Especialista confiante, empÃ¡tico com a dor do empresÃ¡rio, orientado a resultado.
DIFERENCIAL Mb Finance: IA que conecta a MÃšLTIPLOS bancos â€” nÃ£o fica preso Ã s condiÃ§Ãµes de um Ãºnico banco.

REGRAS DE ESCRITA:
- Linguagem clara, direta, parÃ¡grafos curtos (3-4 linhas max)
- Use dados, exemplos prÃ¡ticos e situaÃ§Ãµes do cotidiano do empresÃ¡rio
- Use negrito para destacar pontos-chave
- Construa o artigo como uma jornada: dor â†’ consciÃªncia â†’ soluÃ§Ã£o
`.trim();

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'NÃ£o autorizado' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OPENAI_API_KEY nÃ£o configurada no servidor.' }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    const { title = '', category = '', keyword = '', notes = '', awarenessLevel = '', excerptOnly = false, titleOnly = false, seoOnly = false, seoField = 'all', product = '' } = body || {};

    if (!title && !titleOnly && !excerptOnly) {
        return NextResponse.json({ error: 'title obrigatÃ³rio' }, { status: 400 });
    }

    const productInfo = PRODUCTS[product];

    if (seoOnly) {
        const fieldInstructions: Record<string, string> = {
            title: `Retorne APENAS um JSON: { "seoTitle": "TÃ­tulo SEO com atÃ© 60 caracteres, pode terminar com | Mb Finance" }`,
            desc:  `Retorne APENAS um JSON: { "seoDesc": "Meta descriÃ§Ã£o de 140-155 caracteres que desperta curiosidade e inclui a palavra-chave principal" }`,
            keywords: `Retorne APENAS um JSON: { "keywords": "palavra-chave 1, palavra-chave 2, palavra-chave 3, palavra-chave 4, palavra-chave 5" }`,
            all: `Retorne APENAS um JSON com este formato exato:
{ "seoTitle": "...", "seoDesc": "...", "keywords": "..." }`,
        };

        const seoPrompt = `Gere os dados de SEO para um artigo de blog da Mb Finance.

TÃTULO DO ARTIGO: ${title}
${category ? `CATEGORIA: ${category}` : ''}
${productInfo ? `PRODUTO: ${productInfo.name}` : ''}

${fieldInstructions[seoField] || fieldInstructions.all}

Sem texto antes ou depois do JSON.`.trim();

        const seoRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
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
        const titlePrompt = `Gere 3 opÃ§Ãµes de tÃ­tulo SEO para um artigo de blog da Mb Finance.
${category ? `Categoria: ${category}` : ''}
${productInfo ? `Produto a vender: ${productInfo.name}` : ''}
${notes ? `Tema / Ã¢ngulo: ${notes}` : ''}

Regras:
- MÃ¡ximo 65 caracteres cada
- Formatos que funcionam: "Como...", "Por que...", listas ("X formas de..."), perguntas diretas
- Deve capturar a dor do empresÃ¡rio, nÃ£o mencionar Mb Finance
- TÃ­tulos diferentes entre si (nÃ£o repita a mesma estrutura)

Retorne APENAS um JSON array com 3 strings, sem texto antes ou depois:
["TÃ­tulo 1", "TÃ­tulo 2", "TÃ­tulo 3"]`.trim();

        const titleRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: titlePrompt }],
                max_tokens: 200,
                temperature: 0.8,
            }),
        });
        if (!titleRes.ok) return NextResponse.json({ error: 'Erro ao gerar tÃ­tulos.' }, { status: 502 });
        const titleData = await titleRes.json();
        const raw = (titleData.choices?.[0]?.message?.content || '').trim();
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) return NextResponse.json({ error: 'Resposta inesperada da IA.' }, { status: 500 });
        const titles: string[] = JSON.parse(match[0]);
        return NextResponse.json({ titles });
    }

    const userPrompt = excerptOnly
        ? `Escreva um resumo de 1 a 2 frases atrativas para o artigo de blog abaixo. O resumo aparece nos cards do blog e deve capturar a dor do empresÃ¡rio e despertar curiosidade para clicar. Retorne APENAS o texto do resumo, sem aspas, sem prefixo.

TÃTULO DO ARTIGO: ${title}`.trim()
        : `
Escreva um artigo completo de blog para a Mb Finance com as seguintes informaÃ§Ãµes:

TÃTULO: ${title}
${category ? `CATEGORIA: ${category}` : ''}
${keyword ? `KEYWORD PRINCIPAL: ${keyword}` : ''}
${awarenessLevel ? `NÃVEL DE CONSCIÃŠNCIA: ${awarenessLevel}` : ''}
${notes ? `Ã‚NGULO E TÃ“PICOS:\n${notes}` : ''}
${productInfo ? `
PRODUTO A VENDER: ${productInfo.name}
DOR QUE ESSE PRODUTO RESOLVE: ${productInfo.pain}
PITCH DO PRODUTO: ${productInfo.pitch}
` : ''}

ESTRUTURA ESPERADA:
1. IntroduÃ§Ã£o (1-2 parÃ¡grafos que capturam a dor do empresÃ¡rio â€” desperte empatia imediata)
2. 3 a 4 seÃ§Ãµes com subtÃ­tulos H2 desenvolvendo o tema e aprofundando a consciÃªncia do problema
3. ConclusÃ£o persuasiva: conduza o leitor a sentir que precisa resolver isso agora${productInfo ? ` â€” mencione a Mb Finance e o ${productInfo.name} de forma natural, como se fosse a soluÃ§Ã£o Ã³bvia. O tom deve fazer o leitor pensar "eu preciso disso". NÃƒO seja forÃ§ado â€” a menÃ§Ã£o deve surgir como consequÃªncia lÃ³gica do problema apresentado.` : ' â€” mencione a Mb Finance como soluÃ§Ã£o de forma natural.'}

FORMATO DE SAÃDA â€” retorne APENAS HTML limpo, sem markdown, sem \`\`\`html, sem texto antes ou depois:
- Use <h2>...</h2> para subtÃ­tulos
- Use <p>...</p> para parÃ¡grafos
- Use <strong>...</strong> para destaques
- Use <ul><li>...</li></ul> para listas
- Use <blockquote>...</blockquote> para citaÃ§Ãµes ou destaques importantes
- NÃƒO inclua <html>, <head>, <body> nem <h1>
- NÃƒO inclua botÃ£o de CTA â€” ele serÃ¡ adicionado automaticamente pelo sistema
`.trim();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
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

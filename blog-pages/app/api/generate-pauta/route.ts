import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const MB_CONTEXT = `
VocÃª Ã© o estrategista de conteÃºdo da Mb Finance, um hub financeiro para empresas PJ brasileiro (MEI atÃ© mÃ©dias empresas), fundado em 2013, +130.000 empresas atendidas.

MISSÃƒO DO BLOG: Educar o empresÃ¡rio sobre as suas dores financeiras. Nunca vender diretamente â€” primeiro aumentar o nÃ­vel de consciÃªncia sobre o problema, depois apresentar a soluÃ§Ã£o.

PRODUTOS Mb Finance:
- Conta PJ: conta sem burocracia, sem taxa, para qualquer CNPJ
- Capital de Giro: crÃ©dito rÃ¡pido para capital de giro, aprovaÃ§Ã£o em 24h
- AntecipaÃ§Ã£o de RecebÃ­veis: antecipar recebÃ­veis de cartÃ£o e boleto
- MÃ¡quina de CartÃ£o: maquininha com as melhores taxas do mercado

MAPEAMENTO DOR â†’ PRODUTO:
- Falta de caixa, fluxo de caixa negativo, dificuldade de pagamento â†’ Capital de Giro
- Dinheiro preso em recebÃ­veis, cartÃ£o demora para cair â†’ AntecipaÃ§Ã£o de RecebÃ­veis
- Taxas bancÃ¡rias altas, burocracia, conta cara, limitaÃ§Ã£o do banco Ãºnico â†’ Conta PJ
- Perda de vendas, sem maquininha, taxas altas no cartÃ£o â†’ MÃ¡quina de CartÃ£o

NÃVEIS DE CONSCIÃŠNCIA:
- topo: empresÃ¡rio nÃ£o sabe que tem o problema â†’ artigo educacional amplo
- meio: sabe o problema, nÃ£o conhece a soluÃ§Ã£o â†’ artigo comparativo, causas e impactos
- fundo: estÃ¡ pronto para resolver â†’ artigo de como fazer, passo a passo, com CTA

PÃšBLICO: EmpresÃ¡rios PJ brasileiros, linguagem direta, sem jargÃ£o excessivo.
TOM: Especialista confiante, empÃ¡tico com a dor do empresÃ¡rio, orientado a resultado.
DIFERENCIAL Mb Finance: IA que conecta a MÃšLTIPLOS bancos â€” nÃ£o fica preso Ã s condiÃ§Ãµes de um Ãºnico banco.
`.trim();

interface PautaAngle {
    title: string;
    angle: string;
    awarenessLevel: 'topo' | 'meio' | 'fundo';
    awarenessLabel: string;
    category: string;
    keyword: string;
    notes: string;
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'NÃ£o autorizado' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OPENAI_API_KEY nÃ£o configurada no servidor.' }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.headline) {
        return NextResponse.json({ error: 'headline obrigatÃ³rio' }, { status: 400 });
    }

    const { headline, description = '', product = '' } = body;

    const userPrompt = `
NOTÃCIA DO DIA:
TÃ­tulo: ${headline}
${description ? `DescriÃ§Ã£o: ${description}` : ''}
${product ? `Produto Mb Finance a priorizar: ${product}` : ''}

Com base nessa notÃ­cia e no contexto da Mb Finance, gere 3 Ã¢ngulos de artigo para o blog.
Cada Ã¢ngulo deve ser de um nÃ­vel de consciÃªncia diferente (topo, meio, fundo).
O tÃ­tulo deve ser atraente para o Google â€” formato "Como...", "Por que...", ou lista funciona bem.
NÃ£o mencione Mb Finance no tÃ­tulo. Fale da dor, nÃ£o da soluÃ§Ã£o.

Responda APENAS com um JSON array de 3 objetos, sem texto antes ou depois:
[
  {
    "title": "TÃ­tulo SEO otimizado (mÃ¡x 65 caracteres)",
    "angle": "Em 2 frases: qual dor este artigo ataca e como se conecta Ã  Mb Finance",
    "awarenessLevel": "topo",
    "awarenessLabel": "ConscientizaÃ§Ã£o",
    "category": "credito|gestao|conta-pj|mercado|antecipacao|noticias",
    "keyword": "keyword principal para SEO",
    "notes": "TÃ³pico 1\\nTÃ³pico 2\\nTÃ³pico 3\\nTÃ³pico 4"
  }
]
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
            max_tokens: 1200,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[generate-pauta] OpenAI error:', err);
        let detail = '';
        try { detail = JSON.parse(err)?.error?.message || err; } catch { detail = err; }
        return NextResponse.json({ error: 'Erro ao chamar a IA: ' + detail }, { status: 502 });
    }

    const data = await response.json();
    const raw = (data.choices?.[0]?.message?.content || '').trim();

    // Extract JSON even if model adds surrounding text
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        console.error('[generate-pauta] Could not extract JSON from:', raw);
        return NextResponse.json({ error: 'Resposta da IA em formato inesperado.', raw }, { status: 500 });
    }

    try {
        const angles: PautaAngle[] = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ angles });
    } catch (e) {
        console.error('[generate-pauta] JSON parse error:', e);
        return NextResponse.json({ error: 'Erro ao interpretar resposta da IA.', raw }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const MB_CONTEXT = `
Você é o estrategista de conteúdo da MB Finance, um hub financeiro para empresas PJ brasileiro (MEI até médias empresas), fundado em 2013, +130.000 empresas atendidas.

MISSÃO DO BLOG: Educar o empresário sobre as suas dores financeiras. Nunca vender diretamente — primeiro aumentar o nível de consciência sobre o problema, depois apresentar a solução.

PRODUTOS MB FINANCE:
- Conta PJ: conta sem burocracia, sem taxa, para qualquer CNPJ
- Capital de Giro: crédito rápido para capital de giro, aprovação em 24h
- Antecipação de Recebíveis: antecipar recebíveis de cartão e boleto
- Máquina de Cartão: maquininha com as melhores taxas do mercado

MAPEAMENTO DOR → PRODUTO:
- Falta de caixa, fluxo de caixa negativo, dificuldade de pagamento → Capital de Giro
- Dinheiro preso em recebíveis, cartão demora para cair → Antecipação de Recebíveis
- Taxas bancárias altas, burocracia, conta cara, limitação do banco único → Conta PJ
- Perda de vendas, sem maquininha, taxas altas no cartão → Máquina de Cartão

NÍVEIS DE CONSCIÊNCIA:
- topo: empresário não sabe que tem o problema → artigo educacional amplo
- meio: sabe o problema, não conhece a solução → artigo comparativo, causas e impactos
- fundo: está pronto para resolver → artigo de como fazer, passo a passo, com CTA

PÚBLICO: Empresários PJ brasileiros, linguagem direta, sem jargão excessivo.
TOM: Especialista confiante, empático com a dor do empresário, orientado a resultado.
DIFERENCIAL MB FINANCE: IA que conecta a MÚLTIPLOS bancos — não fica preso às condições de um único banco.
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
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OPENAI_API_KEY não configurada no servidor.' }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.headline) {
        return NextResponse.json({ error: 'headline obrigatório' }, { status: 400 });
    }

    const { headline, description = '', product = '' } = body;

    const userPrompt = `
NOTÍCIA DO DIA:
Título: ${headline}
${description ? `Descrição: ${description}` : ''}
${product ? `Produto MB Finance a priorizar: ${product}` : ''}

Com base nessa notícia e no contexto da MB Finance, gere 3 ângulos de artigo para o blog.
Cada ângulo deve ser de um nível de consciência diferente (topo, meio, fundo).
O título deve ser atraente para o Google — formato "Como...", "Por que...", ou lista funciona bem.
Não mencione MB Finance no título. Fale da dor, não da solução.

Responda APENAS com um JSON array de 3 objetos, sem texto antes ou depois:
[
  {
    "title": "Título SEO otimizado (máx 65 caracteres)",
    "angle": "Em 2 frases: qual dor este artigo ataca e como se conecta à MB Finance",
    "awarenessLevel": "topo",
    "awarenessLabel": "Conscientização",
    "category": "credito|gestao|conta-pj|mercado|antecipacao|noticias",
    "keyword": "keyword principal para SEO",
    "notes": "Tópico 1\\nTópico 2\\nTópico 3\\nTópico 4"
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

import { NextResponse } from 'next/server';

const SOURCES = [
    { name: 'G1 Economia', url: 'https://g1.globo.com/rss/g1/economia/', color: '#cc0000' },
    { name: 'G1 Educação Financeira', url: 'https://g1.globo.com/rss/g1/economia/educacao-financeira/', color: '#cc0000' },
    { name: 'Exame Negócios', url: 'https://exame.com/feed/', color: '#1a1a2e' },
];

const PJ_KEYWORDS = [
    'crédito', 'capital de giro', 'fluxo de caixa', 'juros', 'taxa', 'empréstimo',
    'mei', 'microempresa', 'pequena empresa', 'pme', 'empresário', 'empreendedor',
    'banco', 'fintech', 'financiamento', 'antecipação', 'recebíveis',
    'tributação', 'imposto', 'cnpj', 'nota fiscal', 'endividamento',
    'inadimplência', 'selic', 'inflação', 'maquininha', 'pagamento',
    'pix', 'faturamento', 'lucro', 'custo', 'receita', 'dívida',
    'conta pj', 'abertura de empresa', 'simples nacional', 'caixa',
];

interface NewsItem {
    source: string;
    sourceColor: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

function extractCdata(raw: string): string {
    return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function stripHtml(raw: string): string {
    return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseRss(xml: string, sourceName: string, sourceColor: string): NewsItem[] {
    const items: NewsItem[] = [];
    const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const m of matches) {
        const block = m[1];
        const title       = extractCdata((block.match(/<title>([\s\S]*?)<\/title>/)       || [])[1] || '');
        const link        = ((block.match(/<link>([\s\S]*?)<\/link>/)                     || [])[1] || '').trim();
        const rawDesc     = extractCdata((block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '');
        const description = stripHtml(rawDesc).substring(0, 220);
        const pubDate     = ((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)               || [])[1] || '').trim();

        if (title && link) items.push({ source: sourceName, sourceColor, title, link, description, pubDate });
        if (items.length >= 20) break;
    }
    return items;
}

function isRelevant(item: NewsItem): boolean {
    const text = (item.title + ' ' + item.description).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');
    return PJ_KEYWORDS.some(kw => {
        const normalized = kw.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return text.includes(normalized);
    });
}

export async function GET() {
    const results = await Promise.allSettled(
        SOURCES.map(async (src) => {
            const res = await fetch(src.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MBFinanceRadar/1.0)' },
                next: { revalidate: 1800 },
            });
            if (!res.ok) throw new Error(`${src.name}: HTTP ${res.status}`);
            const xml = await res.text();
            return parseRss(xml, src.name, src.color);
        })
    );

    const allItems = results
        .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .filter(isRelevant);

    // Sort by date desc, remove near-duplicates by title prefix
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    const seen = new Set<string>();
    const deduped = allItems.filter(item => {
        const key = item.title.substring(0, 40).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason?.message || 'unknown');

    return NextResponse.json({
        items: deduped.slice(0, 15),
        fetchedAt: new Date().toISOString(),
        ...(errors.length ? { errors } : {}),
    });
}

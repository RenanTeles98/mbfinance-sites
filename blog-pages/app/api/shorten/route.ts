import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    try {
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('tinyurl error');
        const short = await res.text();
        return NextResponse.json({ short: short.trim() });
    } catch {
        return NextResponse.json({ error: 'Não foi possível encurtar o link' }, { status: 500 });
    }
}

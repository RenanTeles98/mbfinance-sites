import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';
import fs from 'fs';

const TMP_STATS_FILE = '/tmp/mb_shortlink_clicks.json';

type ShortStats = {
    clicks: number;
    lastClick: string | null;
};

function normalizeCodes(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .map((code) => String(code || '').trim())
        .filter((code) => /^[a-z0-9]{3,24}$/i.test(code))
        .slice(0, 100);
}

async function getStats(codes: string[]): Promise<Record<string, ShortStats>> {
    const stats: Record<string, ShortStats> = {};
    codes.forEach((code) => {
        stats[code] = { clicks: 0, lastClick: null };
    });

    if (!codes.length) return stats;

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
        await Promise.all(codes.map(async (code) => {
            const [clicks, lastClick] = await Promise.all([
                redis.get<number>(`short:${code}:clicks`),
                redis.get<string>(`short:${code}:lastClick`),
            ]);
            stats[code] = {
                clicks: Number(clicks || 0),
                lastClick: lastClick || null,
            };
        }));
        return stats;
    }

    let local: Record<string, ShortStats> = {};
    try { local = JSON.parse(fs.readFileSync(TMP_STATS_FILE, 'utf-8')); } catch { /* first use */ }
    codes.forEach((code) => {
        const item = local[code];
        stats[code] = {
            clicks: Number(item?.clicks || 0),
            lastClick: item?.lastClick || null,
        };
    });
    return stats;
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySession(token))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const codes = normalizeCodes(body?.codes);
    return NextResponse.json({ stats: await getStats(codes) });
}

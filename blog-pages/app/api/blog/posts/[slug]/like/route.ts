import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const TTL_30_DAYS = 60 * 60 * 24 * 30;

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const fp = request.nextUrl.searchParams.get('fp') ?? '';

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0, liked: false });
  }

  try {
    const countKey = `mb_likes:${slug}`;
    const likerKey = `mb_liker:${slug}:${fp}`;

    const [rawCount, rawLiked] = await Promise.all([
      redis.get<number>(countKey),
      fp ? redis.get<string>(likerKey) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      count: rawCount ?? 0,
      liked: rawLiked === '1',
    });
  } catch {
    return NextResponse.json({ count: 0, liked: false });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0, liked: false });
  }

  let fp = '';
  try {
    const body = await request.json();
    fp = typeof body?.fp === 'string' ? body.fp.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!fp) {
    return NextResponse.json({ error: 'Missing fp' }, { status: 400 });
  }

  try {
    const countKey = `mb_likes:${slug}`;
    const likerKey = `mb_liker:${slug}:${fp}`;

    const alreadyLiked = await redis.get<string>(likerKey);

    let count: number;
    let liked: boolean;

    if (alreadyLiked === '1') {
      // toggle off
      const newCount = await redis.decr(countKey);
      await redis.del(likerKey);
      count = Math.max(0, newCount);
      liked = false;
    } else {
      // toggle on
      const newCount = await redis.incr(countKey);
      await redis.set(likerKey, '1', { ex: TTL_30_DAYS });
      count = newCount;
      liked = true;
    }

    return NextResponse.json({ count, liked });
  } catch {
    return NextResponse.json({ count: 0, liked: false });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';
import type { Comment } from '@/app/api/blog/posts/[slug]/comments/route';

export const dynamic = 'force-dynamic';

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

async function requireAuth(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? '';
  return verifySession(token);
}

export async function GET(_request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ comments: [] });
  }

  try {
    // Scan all mb_comments:* keys
    let cursor = 0;
    const allKeys: string[] = [];

    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: 'mb_comments:*',
        count: 100,
      });
      cursor = Number(nextCursor);
      allKeys.push(...keys);
    } while (cursor !== 0);

    type CommentWithSlug = Comment & { slug: string };
    const pending: CommentWithSlug[] = [];

    await Promise.all(
      allKeys.map(async (key) => {
        const slug = key.replace('mb_comments:', '');
        try {
          const raw = await redis.get<Comment[]>(key);
          if (!Array.isArray(raw)) return;
          raw
            .filter((c) => !c.approved)
            .forEach((c) => pending.push({ ...c, slug }));
        } catch {
          // skip keys with parse errors
        }
      })
    );

    pending.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return NextResponse.json({ comments: pending });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { slug?: unknown; id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const action = body.action;

  if (!slug || !id || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json(
      { error: 'slug, id, and action (approve|reject) are required.' },
      { status: 422 }
    );
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ ok: true });
  }

  try {
    const key = `mb_comments:${slug}`;
    const raw = await redis.get<Comment[]>(key);
    if (!Array.isArray(raw)) {
      return NextResponse.json({ error: 'No comments found for this slug.' }, { status: 404 });
    }

    const index = raw.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    let updated: Comment[];
    if (action === 'approve') {
      updated = raw.map((c) => (c.id === id ? { ...c, approved: true } : c));
    } else {
      // reject = remove
      updated = raw.filter((c) => c.id !== id);
    }

    await redis.set(key, updated);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update comment.' }, { status: 500 });
  }
}

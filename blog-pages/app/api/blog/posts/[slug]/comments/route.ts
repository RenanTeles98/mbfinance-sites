import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  approved: boolean;
  email?: string;
}

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

async function getComments(redis: Redis, slug: string): Promise<Comment[]> {
  try {
    const raw = await redis.get<Comment[]>(`mb_comments:${slug}`);
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch {
    return [];
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ comments: [] });
  }

  try {
    const all = await getComments(redis, slug);
    const approved = all.filter((c) => c.approved);
    return NextResponse.json({ comments: approved });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  let body: { author?: unknown; body?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const commentBody = typeof body.body === 'string' ? body.body.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : undefined;

  if (!author || author.length > 60) {
    return NextResponse.json(
      { error: 'Author is required and must be at most 60 characters.' },
      { status: 422 }
    );
  }

  if (!commentBody || commentBody.length < 10 || commentBody.length > 1000) {
    return NextResponse.json(
      { error: 'Body must be between 10 and 1000 characters.' },
      { status: 422 }
    );
  }

  const redis = getRedis();
  if (!redis) {
    // Accept silently when Redis is not configured (dev mode)
    return NextResponse.json({ ok: true });
  }

  try {
    const key = `mb_comments:${slug}`;
    const existing = await getComments(redis, slug);

    const newComment: Comment = {
      id: randomUUID(),
      author,
      body: commentBody,
      createdAt: new Date().toISOString(),
      approved: false,
      ...(email ? { email } : {}),
    };

    await redis.set(key, [...existing, newComment]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save comment.' }, { status: 500 });
  }
}

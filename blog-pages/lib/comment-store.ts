import { Redis } from '@upstash/redis';

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
  return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
}

export async function getApprovedComments(slug: string): Promise<Comment[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const raw = await redis.get<Comment[]>(`mb_comments:${slug}`);
    if (!Array.isArray(raw)) return [];
    return raw.filter((c) => c.approved);
  } catch {
    return [];
  }
}

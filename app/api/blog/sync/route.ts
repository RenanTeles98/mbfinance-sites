import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { BlogPost } from "@/types/blog";

const KV_KEY = "mb_blog_posts";

function isAuthorized(request: NextRequest) {
  const token = request.headers.get("x-blog-admin-token");
  const expected = process.env.BLOG_ADMIN_TOKEN || "mbfinance2026";
  return token === expected;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  if (!hasKV) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
  }

  const postsPath = path.join(process.cwd(), "content", "blog-posts.json");
  const raw = await fs.readFile(postsPath, "utf8");
  const bundled = JSON.parse(raw) as BlogPost[];

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  // Lê posts atuais do Redis
  const existing = (await redis.get<BlogPost[]>(KV_KEY)) || [];

  // Cria mapa dos bundled por id para lookup rápido
  const bundledMap = new Map(bundled.map((p) => [p.id, p]));

  // Atualiza posts que vieram do JSON, mantém posts criados pelo admin (não estão no JSON)
  const updated = existing.map((p) => bundledMap.get(p.id) ?? p);

  // Adiciona bundled que ainda não existem no Redis
  const existingIds = new Set(existing.map((p) => p.id));
  const missing = bundled.filter((p) => !existingIds.has(p.id));

  const final = [...updated, ...missing].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  await redis.set(KV_KEY, final);

  return NextResponse.json({ ok: true, synced: bundled.length, total: final.length });
}

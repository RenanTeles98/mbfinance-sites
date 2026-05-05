import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { BlogPost } from "@/types/blog";
import { readBlogPosts, writeBlogPosts } from "@/lib/blog-store";

function isAuthorized(request: NextRequest) {
  const expected = process.env.BLOG_ADMIN_TOKEN;
  if (!expected) return false;
  const token = request.headers.get("x-blog-admin-token");
  return token === expected;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postsPath = path.join(process.cwd(), "content", "blog-posts.json");
  const raw = await fs.readFile(postsPath, "utf8");
  const bundled = JSON.parse(raw) as BlogPost[];

  const existing = await readBlogPosts();

  const bundledMap = new Map(bundled.map((p) => [p.id, p]));
  const updated = existing.map((p) => bundledMap.get(p.id) ?? p);

  const existingIds = new Set(existing.map((p) => p.id));
  const missing = bundled.filter((p) => !existingIds.has(p.id));

  const final = [...updated, ...missing].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  await writeBlogPosts(final);

  return NextResponse.json({ ok: true, synced: bundled.length, total: final.length });
}

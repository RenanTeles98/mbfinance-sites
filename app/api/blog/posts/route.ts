import { NextRequest, NextResponse } from "next/server";
import { readBlogPosts, writeBlogPosts } from "@/lib/blog-store";
import { BlogPost } from "@/types/blog";

function isAuthorized(request: NextRequest) {
  const token = request.headers.get("x-blog-admin-token");
  const expected = process.env.BLOG_ADMIN_TOKEN || "mbfinance2026";
  return token === expected;
}

export async function GET() {
  const posts = await readBlogPosts();
  return NextResponse.json({ posts });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { posts?: BlogPost[] };
  if (!Array.isArray(body.posts)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await writeBlogPosts(body.posts);
  return NextResponse.json({ ok: true, count: body.posts.length });
}

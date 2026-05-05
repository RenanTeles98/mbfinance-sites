import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { readBlogPosts, writeBlogPosts } from "@/lib/blog-store";
import { BlogPost } from "@/types/blog";

const ALLOWED_BLOG_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  "h1", "h2", "h3", "h4", "h5", "h6", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td", "iframe",
];

function sanitizePost(post: BlogPost): BlogPost {
  return {
    ...post,
    content: sanitizeHtml(post.content, {
      allowedTags: ALLOWED_BLOG_TAGS,
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height", "loading"],
        a: ["href", "target", "rel"],
        iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
        "*": ["class", "style"],
      },
      allowedSchemes: ["https", "http", "mailto"],
      allowIframeRelativeUrls: false,
    }),
  };
}

function isAuthorized(request: NextRequest) {
  const expected = process.env.BLOG_ADMIN_TOKEN;
  if (!expected) return false;
  const token = request.headers.get("x-blog-admin-token");
  return token === expected;
}

export async function GET(request: NextRequest) {
  const posts = await readBlogPosts();
  
  if (isAuthorized(request)) {
    return NextResponse.json({ posts });
  }

  const now = new Date();
  const publicPosts = posts.filter((p) => {
    if (p.published === false) return false;
    try {
      const pubDate = new Date(`${p.date}T${p.time || "00:00"}:00`);
      return pubDate <= now;
    } catch {
      return true;
    }
  });

  return NextResponse.json({ posts: publicPosts });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { posts?: BlogPost[] };
  if (!Array.isArray(body.posts)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sanitized = body.posts.map(sanitizePost);
  await writeBlogPosts(sanitized);
  return NextResponse.json({ ok: true, count: body.posts.length });
}

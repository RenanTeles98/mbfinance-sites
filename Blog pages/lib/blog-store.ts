import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { BlogPost } from "@/types/blog";

const contentDir = path.join(process.cwd(), "content");
const postsPath = path.join(contentDir, "blog-posts.json");
const tmpPath = "/tmp/mb-blog-posts.json";
const KV_KEY = "mb_blog_posts";

const isVercel = !!process.env.VERCEL;
const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const writePath = isVercel && !hasKV ? tmpPath : postsPath;

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

async function ensureStore() {
  if (!isVercel) {
    await fs.mkdir(contentDir, { recursive: true });
    try {
      await fs.access(postsPath);
    } catch {
      await fs.writeFile(postsPath, "[]\n", "utf8");
    }
  }
}

function normalizePost(post: BlogPost): BlogPost {
  return {
    ...post,
    excerpt: post.excerpt || "",
    image: post.image || "",
    content: post.content || "",
    readTime: post.readTime || "5 min",
    date: post.date || new Date().toISOString().slice(0, 10),
    featured: Boolean(post.featured),
    published: post.published !== false,
    seoTitle: post.seoTitle || "",
    seoDesc: post.seoDesc || "",
    keywords: post.keywords || "",
    time: post.time || "00:00",
  };
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  // Upstash Redis — banco persistente (quando configurado)
  if (hasKV) {
    try {
      const redis = getRedis();
      const posts = await redis.get<BlogPost[]>(KV_KEY);
      const existing = posts || [];
      // Mescla: adiciona artigos bundled que ainda nao estao no KV
      try {
        const raw = await fs.readFile(postsPath, "utf8");
        const bundled = JSON.parse(raw) as BlogPost[];
        const existingIds = new Set(existing.map((p) => p.id));
        const missing = bundled.filter((b) => !existingIds.has(b.id));
        if (missing.length > 0) {
          const merged = [...existing, ...missing];
          await redis.set(KV_KEY, merged);
          return merged.map(normalizePost);
        }
      } catch { /* ignora */ }
      return existing.map(normalizePost);
    } catch {
      // Redis falhou — fallback para arquivo bundled
    }
  }

  // Fallback: arquivo local (dev) ou /tmp (Vercel sem KV)
  await ensureStore();
  let readFrom = postsPath;
  if (isVercel) {
    try {
      await fs.access(tmpPath);
      readFrom = tmpPath;
    } catch {
      readFrom = postsPath;
    }
  }
  try {
    const raw = await fs.readFile(readFrom, "utf8");
    const parsed = JSON.parse(raw) as BlogPost[];
    return parsed.map(normalizePost);
  } catch {
    return [];
  }
}

export async function writeBlogPosts(posts: BlogPost[]): Promise<void> {
  const normalized = posts
    .map(normalizePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Upstash Redis — banco persistente (quando configurado)
  if (hasKV) {
    const redis = getRedis();
    await redis.set(KV_KEY, normalized);
    return;
  }

  // Fallback: arquivo
  await ensureStore();
  await fs.writeFile(writePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export async function readPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await readBlogPosts();
  const now = new Date();
  return posts.filter((post) => {
    if (post.published === false) return false;
    try {
        const pubDate = new Date(`${post.date}T${post.time || "00:00"}:00`);
        return pubDate <= now;
    } catch {
        return true;
    }
  });
}

export async function readFeaturedPost(): Promise<BlogPost | null> {
  const posts = await readPublishedBlogPosts();
  return posts.find((post) => post.featured) || posts[0] || null;
}

export async function readBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await readPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

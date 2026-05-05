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
const hasSupabase = !!(
  process.env.SUPABASE_URL &&
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
);
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

type SupabasePostRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  category_label: string;
  excerpt: string | null;
  image: string | null;
  content: string | null;
  read_time: string | null;
  date: string | null;
  featured: boolean | null;
  published: boolean | null;
  seo_title: string | null;
  seo_desc: string | null;
  keywords: string | null;
  time: string | null;
};

function getSupabaseBaseUrl() {
  return `${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/blog_posts`;
}

function getSupabaseHeaders() {
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!apiKey) {
    throw new Error("Supabase key is not configured");
  }

  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

function toBlogPost(row: SupabasePostRow): BlogPost {
  return normalizePost({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    categoryLabel: row.category_label,
    excerpt: row.excerpt || "",
    image: row.image || "",
    content: row.content || "",
    readTime: row.read_time || "5 min",
    date: row.date || new Date().toISOString().slice(0, 10),
    featured: Boolean(row.featured),
    published: row.published !== false,
    seoTitle: row.seo_title || "",
    seoDesc: row.seo_desc || "",
    keywords: row.keywords || "",
    time: row.time || "00:00",
  });
}

function toSupabaseRow(post: BlogPost): SupabasePostRow {
  const normalized = normalizePost(post);

  return {
    id: normalized.id,
    title: normalized.title,
    slug: normalized.slug,
    category: normalized.category,
    category_label: normalized.categoryLabel,
    excerpt: normalized.excerpt,
    image: normalized.image,
    content: normalized.content,
    read_time: normalized.readTime,
    date: normalized.date,
    featured: normalized.featured,
    published: normalized.published,
    seo_title: normalized.seoTitle || "",
    seo_desc: normalized.seoDesc || "",
    keywords: normalized.keywords || "",
    time: normalized.time || "00:00",
  };
}

async function readSupabasePosts(): Promise<BlogPost[]> {
  const response = await fetch(`${getSupabaseBaseUrl()}?select=*&order=date.desc,time.desc`, {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase read failed: ${response.status}`);
  }

  const rows = (await response.json()) as SupabasePostRow[];
  return rows.map(toBlogPost);
}

async function writeSupabasePosts(posts: BlogPost[]): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for Supabase writes");
  }

  const normalized = posts
    .map(normalizePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const rows = normalized.map(toSupabaseRow);

  const existing = await readSupabasePosts();
  const nextIds = new Set(normalized.map((post) => post.id));
  const removed = existing.filter((post) => !nextIds.has(post.id));

  await Promise.all(
    removed.map((post) =>
      fetch(`${getSupabaseBaseUrl()}?id=eq.${encodeURIComponent(post.id)}`, {
        method: "DELETE",
        headers: getSupabaseHeaders(),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Supabase delete failed: ${response.status}`);
        }
      })
    )
  );

  if (!rows.length) return;

  const response = await fetch(`${getSupabaseBaseUrl()}?on_conflict=id`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Supabase write failed: ${response.status}`);
  }
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  if (hasSupabase) {
    try {
      const posts = await readSupabasePosts();
      if (posts.length > 0) return posts;

      try {
        const raw = await fs.readFile(postsPath, "utf8");
        const bundled = (JSON.parse(raw) as BlogPost[]).map(normalizePost);
        if (bundled.length > 0 && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          await writeSupabasePosts(bundled);
        }
        return bundled;
      } catch {
        return posts;
      }
    } catch {
      // Supabase falhou: segue para os fallbacks abaixo.
    }
  }

  if (hasKV) {
    try {
      const redis = getRedis();
      const posts = await redis.get<BlogPost[]>(KV_KEY);
      const existing = posts || [];

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
      } catch {
        // Ignora seed local quando nao estiver disponivel.
      }

      return existing.map(normalizePost);
    } catch {
      // Redis falhou: segue para arquivo.
    }
  }

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

  if (hasSupabase) {
    await writeSupabasePosts(normalized);
    return;
  }

  if (hasKV) {
    const redis = getRedis();
    await redis.set(KV_KEY, normalized);
    return;
  }

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


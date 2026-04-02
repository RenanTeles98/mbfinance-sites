import { promises as fs } from "fs";
import path from "path";
import { BlogPost } from "@/types/blog";

const contentDir = path.join(process.cwd(), "content");
const postsPath = path.join(contentDir, "blog-posts.json");

async function ensureStore() {
  await fs.mkdir(contentDir, { recursive: true });
  try {
    await fs.access(postsPath);
  } catch {
    await fs.writeFile(postsPath, "[]\n", "utf8");
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
  };
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  await ensureStore();
  const raw = await fs.readFile(postsPath, "utf8");
  const parsed = JSON.parse(raw) as BlogPost[];
  return parsed.map(normalizePost);
}

export async function writeBlogPosts(posts: BlogPost[]): Promise<void> {
  await ensureStore();
  const normalized = posts
    .map(normalizePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  await fs.writeFile(postsPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export async function readPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await readBlogPosts();
  return posts.filter((post) => post.published !== false);
}

export async function readFeaturedPost(): Promise<BlogPost | null> {
  const posts = await readPublishedBlogPosts();
  return posts.find((post) => post.featured) || posts[0] || null;
}

export async function readBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await readPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

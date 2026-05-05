import type { MetadataRoute } from "next";
import { readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await readPublishedBlogPosts();

  return [
    {
      url: blogUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: blogUrl(`/blog/${post.slug}`),
      lastModified: new Date(`${post.date}T${post.time || "12:00"}:00`),
      changeFrequency: "weekly" as const,
      priority: post.featured ? 0.9 : 0.8,
    })),
  ];
}

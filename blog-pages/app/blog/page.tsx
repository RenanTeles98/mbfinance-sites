import type { Metadata } from "next";
import BlogIndexClient from "@/components/BlogIndexClient";
import { readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conteúdos sobre crédito empresarial, conta PJ, antecipação de recebíveis e gestão financeira.",
  alternates: {
    canonical: blogUrl("/blog"),
  },
  openGraph: {
    title: "Blog MB Finance",
    description:
      "Conteúdos sobre crédito empresarial, conta PJ, antecipação de recebíveis e gestão financeira.",
    url: blogUrl("/blog"),
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await readPublishedBlogPosts();

  return (
    <>
      <BlogIndexClient posts={posts} />
    </>
  );
}

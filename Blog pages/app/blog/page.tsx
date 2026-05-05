import type { Metadata } from "next";
import BlogIndexClient from "@/components/BlogIndexClient";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import MetaPixel from "@/components/MetaPixel";
import { readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog MB Finance",
  description:
    "Conteudos sobre credito empresarial, conta PJ, antecipacao de recebiveis e gestao financeira.",
  alternates: {
    canonical: blogUrl("/blog"),
  },
  openGraph: {
    title: "Blog MB Finance",
    description:
      "Conteudos sobre credito empresarial, conta PJ, antecipacao de recebiveis e gestao financeira.",
    url: blogUrl("/blog"),
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await readPublishedBlogPosts();

  return (
    <>
      <GoogleAdsTag />
      <MetaPixel />
      <BlogIndexClient posts={posts} />
    </>
  );
}

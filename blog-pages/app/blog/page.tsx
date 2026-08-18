import type { Metadata } from "next";
import BlogIndexClient from "@/components/BlogIndexClient";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import MetaPixel from "@/components/MetaPixel";
import { readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "ConteÃºdos sobre crÃ©dito empresarial, conta PJ, antecipaÃ§Ã£o de recebÃ­veis e gestÃ£o financeira.",
  alternates: {
    canonical: blogUrl("/blog"),
  },
  openGraph: {
    title: "Blog Mb Finance",
    description:
      "ConteÃºdos sobre crÃ©dito empresarial, conta PJ, antecipaÃ§Ã£o de recebÃ­veis e gestÃ£o financeira.",
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

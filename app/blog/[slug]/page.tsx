import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readBlogPostBySlug, readPublishedBlogPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await readPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await readBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Artigo nao encontrado | MB Finance" };
  }

  return {
    title: post.seoTitle || `${post.title} | MB Finance`,
    description: post.seoDesc || post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await readBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#003956] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-300">
            {post.categoryLabel}
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex gap-4 text-sm font-semibold text-white/60">
            <span>{formatDate(post.date)}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {post.image ? (
        <div className="mx-auto -mt-8 max-w-5xl px-6">
          <div
            className="h-[320px] rounded-[24px] border border-white/20 bg-cover bg-center shadow-2xl md:h-[420px]"
            style={{ backgroundImage: `url("${post.image}")` }}
          />
        </div>
      ) : null}

      <article className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/blog" className="text-sm font-semibold text-slate-500 hover:text-slate-800">
          Voltar para o blog
        </Link>

        {post.excerpt ? (
          <div className="mt-6 rounded-2xl border-l-4 border-sky-500 bg-sky-50 px-6 py-5 text-lg leading-8 text-slate-600">
            {post.excerpt}
          </div>
        ) : null}

        <div
          className="blog-article-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 rounded-[24px] bg-[#003956] px-8 py-10 text-white">
          <h2 className="font-serif text-3xl font-black">Precisa falar com um especialista?</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            A MB Finance ajuda sua empresa a comparar linhas, contas e solucoes com mais criterio.
          </p>
          <a
            href={`https://wa.me/552139008295?text=${encodeURIComponent(
              `Ola! Li o artigo "${post.title}" e quero falar com um especialista.`
            )}`}
            className="mt-6 inline-flex rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
          >
            Falar com um especialista
          </a>
        </div>
      </article>
    </main>
  );
}

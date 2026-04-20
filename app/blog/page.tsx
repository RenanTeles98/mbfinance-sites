import type { Metadata } from "next";
import Link from "next/link";
import { readFeaturedPost, readPublishedBlogPosts } from "@/lib/blog-store";
import NewsletterSignup from "@/components/NewsletterSignup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog MB Finance",
  description:
    "Conteudos sobre credito empresarial, conta PJ, antecipacao de recebiveis e gestao financeira.",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await readPublishedBlogPosts();
  const featured = await readFeaturedPost();
  const gridPosts = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#003956] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-300">
            Blog MB Finance
          </p>
          <h1 className="max-w-4xl font-sans text-4xl font-bold leading-tight md:text-6xl">
            Conteudo para empresas que querem decidir melhor.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            Artigos praticos sobre credito, liquidez, conta PJ e gestao financeira.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        {featured ? (
          <>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-600">
              Destaque
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="grid overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl md:grid-cols-2"
            >
              <div
                className="min-h-[280px] bg-slate-200 bg-cover bg-center"
                style={{
                  backgroundImage: featured.image ? `url("${featured.image}")` : undefined,
                  backgroundColor: featured.image ? undefined : "#003956",
                }}
              />
              <div className="flex flex-col justify-center p-8 md:p-10">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-600">
                  {featured.categoryLabel}
                </p>
                <h2 className="font-sans text-3xl font-bold leading-tight text-[#003956]">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">{featured.excerpt}</p>
                <div className="mt-6 flex gap-4 text-xs font-semibold text-slate-400">
                  <span>{featured.readTime}</span>
                  <span>{formatDate(featured.date)}</span>
                </div>
              </div>
            </Link>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            Nenhum artigo publicado ainda.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-600">
          Artigos
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {gridPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="h-52 bg-slate-200 bg-cover bg-center"
                style={{
                  backgroundImage: post.image ? `url("${post.image}")` : undefined,
                  backgroundColor: post.image ? undefined : "#003956",
                }}
              />
              <div className="p-6">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-600">
                  {post.categoryLabel}
                </p>
                <h3 className="text-lg font-extrabold leading-7 text-[#003956]">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{post.excerpt}</p>
                <div className="mt-5 flex gap-4 text-xs font-semibold text-slate-400">
                  <span>{post.readTime}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterSignup />
    </main>
  );
}

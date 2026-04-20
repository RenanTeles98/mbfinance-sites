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
      <nav style={{ background: "#003956", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/mb-finance-completo.html">
            <img src="/images/logo-horizontal-logo.branca.png" alt="MB Finance" style={{ height: 36, width: "auto", display: "block" }} />
          </a>
          <a href="/pages/blog.html" className="flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar ao blog
          </a>
        </div>
      </nav>

      <section className="bg-[#003956] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-300">
            {post.categoryLabel}
          </p>
          <h1 className="font-sans text-4xl font-bold leading-tight md:text-5xl">
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
          <h2 className="font-sans text-3xl font-black">Precisa falar com um especialista?</h2>
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

      <footer className="text-white" style={{ background: "#040f1a", padding: "80px 0 64px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* Col 1: Brand */}
            <div className="flex flex-col gap-7 lg:col-span-4">
              <a href="/mb-finance-completo.html" className="inline-block opacity-100 transition-opacity hover:opacity-80">
                <img src="/images/logo-horizontal-logo.branca.png" alt="MB Finance" style={{ height: 36, width: "auto" }} />
              </a>
              <p className="max-w-[280px] text-[15px] font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Há mais de 10 anos conectando empresas às melhores soluções financeiras do mercado. Seu elo estratégico com as principais instituições bancárias do Brasil.
              </p>
              <div className="flex gap-3">
                <a href="https://www.linkedin.com/company/mbfassessoria/?viewAsMember=true" target="_blank" rel="noopener" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/15">
                  <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://www.instagram.com/mbfassessoria/" target="_blank" rel="noopener" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/15">
                  <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Soluções */}
            <div className="lg:col-span-3">
              <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-white">Soluções</h4>
              <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {["Conta Corrente Empresarial","Máquina de Cartão","Seguros e Consórcios","Crédito Rápido","Soluções Tributárias","Telemedicina","Soluções Personalizadas"].map((item) => (
                  <li key={item}><a href="/mb-finance-completo.html#produtos" className="transition-colors hover:text-brand-secondary">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Col 3: Empresa + Legal */}
            <div className="flex flex-col gap-10 lg:col-span-2">
              <div>
                <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-white">Empresa</h4>
                <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <li><a href="/mb-finance-completo.html#como-funciona" className="transition-colors hover:text-brand-secondary">Como Funciona</a></li>
                  <li><a href="/mb-finance-completo.html#vagas" className="transition-colors hover:text-brand-secondary">Trabalhe Conosco</a></li>
                  <li><a href="/mb-finance-completo.html" className="transition-colors hover:text-brand-secondary">Seja um Parceiro</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-7 text-xs font-bold uppercase tracking-widest text-white">Legal</h4>
                <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <li><a href="/pages/politica-de-privacidade.html" className="transition-colors hover:text-brand-secondary">Política de Privacidade</a></li>
                  <li><a href="/pages/termos-de-uso.html" className="transition-colors hover:text-brand-secondary">Termos de Uso</a></li>
                </ul>
              </div>
            </div>

            {/* Col 4: Contato */}
            <div className="lg:col-span-3">
              <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-white">Contato</h4>
              <div className="flex flex-col gap-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                <div>
                  <div className="text-xl font-bold text-white">(21) 3900-8295</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Seg - Sex: 9h às 18h</div>
                </div>
                <a href="mailto:atendimento@mbfinance.com.br" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>atendimento@mbfinance.com.br</a>
                <div className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Av. Rio Branco, 110 - 30º andar<br />
                  Centro, Rio de Janeiro - RJ<br />
                  CEP: 20040-006
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-10 text-center">
            <p className="text-[10px] uppercase leading-relaxed tracking-[2px] sm:text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              © 2026 MB ASSESSORIA E ESTRUTURAÇÃO DE NEGÓCIOS LTDA. CNPJ: 26.388.817/0001-72. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

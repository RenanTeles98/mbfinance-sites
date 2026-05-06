"use client";

import { useMemo, useState, type FormEvent } from "react";
import { pushAnalyticsEvent } from "@/components/AnalyticsTracker";
import type { BlogPost } from "@/types/blog";
import { mainSiteUrl } from "@/lib/site";

const filters = [
  { label: "Todos", value: "todos" },
  { label: "Crédito Empresarial", value: "credito" },
  { label: "Gestão Financeira", value: "gestao" },
  { label: "Conta PJ", value: "conta-pj" },
  { label: "Antecipação", value: "antecipacao" },
  { label: "Gestão Tributária", value: "gestao-tributaria" },
];

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function matchesSearch(post: BlogPost, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [post.title, post.excerpt, post.categoryLabel, post.category, post.keywords]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function imageStyle(image?: string) {
  return image
    ? { backgroundImage: `url("${image}")` }
    : { background: "linear-gradient(135deg,#003956,#0099dd)" };
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const featured = posts.find((post) => post.featured) || posts[0] || null;
  const gridPosts = posts.filter((post) => post.id !== featured?.id);

  const visibleFeatured =
    featured &&
    (category === "todos" || featured.category === category) &&
    matchesSearch(featured, query)
      ? featured
      : null;

  const visibleGridPosts = useMemo(
    () =>
      gridPosts.filter(
        (post) =>
          (category === "todos" || post.category === category) &&
          matchesSearch(post, query)
      ),
    [category, gridPosts, query]
  );

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Erro ao inscrever");
      }
      pushAnalyticsEvent("newsletter_submit", {
        form_name: "blog_index_newsletter",
        source_area: "blog_index",
      });
      pushAnalyticsEvent("sign_up", {
        method: "newsletter",
        source_area: "blog_index",
      });
      setEmail("");
      setNewsletterStatus("success");
    } catch {
      setNewsletterStatus("error");
    }
  }

  function trackSearch() {
    const searchTerm = query.trim();
    if (!searchTerm) return;

    pushAnalyticsEvent("blog_search", {
      search_term: searchTerm,
      results_count: Number(visibleFeatured ? 1 : 0) + visibleGridPosts.length,
    });
    pushAnalyticsEvent("search", {
      search_term: searchTerm,
    });
  }

  const hasResults = Boolean(visibleFeatured) || visibleGridPosts.length > 0;

  return (
    <main className="blog-page">
      <nav className="blog-nav">
        <div className="blog-nav-inner">
          <a href={mainSiteUrl("/")} className="blog-logo-link">
            <img src="/images/logo-horizontal-logo.branca.png" alt="mb finance" width="146" height="36" />
          </a>
          <a href={mainSiteUrl("/")} className="blog-back">
            <span aria-hidden="true">←</span>
            Voltar ao site
          </a>
        </div>
      </nav>

      <section className="blog-hero">
        <div className="blog-shell">
          <div className="hero-tag">Conteúdo exclusivo</div>
          <h1 className="hero-title">
            Inteligência financeira para
            <br />
            <span>o seu negócio crescer</span>
          </h1>
          <p className="hero-sub">
            Guias práticos sobre crédito, liquidez, conta PJ e gestão para ajudar empresários a tomar decisões melhores todos os meses.
          </p>
          <div className="search-box">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") trackSearch();
              }}
              type="text"
              placeholder="Buscar artigos, temas ou palavras-chave..."
            />
            <button type="button" onClick={trackSearch}>Buscar</button>
          </div>
        </div>
      </section>

      <div className="filter-bar">
        <div className="filter-inner">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`filter-btn ${category === item.value ? "active" : ""}`}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <section className="blog-shell blog-main">
        <div className="intro-banner">
          <div>
            <h3>{posts.length} artigos publicados no blog</h3>
            <p>Conteúdo sobre crédito empresarial, gestão financeira e soluções para fazer o seu negócio crescer.</p>
          </div>
          <span>Ao vivo</span>
        </div>

        {visibleFeatured ? (
          <>
            <p className="section-title">Destaque</p>
            <a
              className="featured-card"
              href={`/blog/${visibleFeatured.slug}`}
              data-cat={visibleFeatured.category}
              data-analytics-label={visibleFeatured.title}
              data-analytics-area="featured_post"
            >
              <div className="featured-image" style={imageStyle(visibleFeatured.image)}>
                <div className="featured-image-overlay" />
                <span>Artigo em destaque</span>
              </div>
              <div className="featured-content">
                <p className="article-category">{visibleFeatured.categoryLabel}</p>
                <h2>{visibleFeatured.title}</h2>
                <p className="featured-excerpt">{visibleFeatured.excerpt}</p>
                <div className="article-meta">
                  <span>{formatDate(visibleFeatured.date)}</span>
                  <span>{visibleFeatured.readTime}</span>
                </div>
                <strong className="read-btn">
                  Ler artigo
                  <span aria-hidden="true">→</span>
                </strong>
              </div>
            </a>
          </>
        ) : null}

        <p className="section-title">Artigos recentes</p>
        <div className="posts-grid">
          {visibleGridPosts.map((post) => (
            <a
              key={post.id}
              className="post-card"
              href={`/blog/${post.slug}`}
              data-cat={post.category}
              data-analytics-label={post.title}
              data-analytics-area="recent_posts"
            >
              <div className="card-thumb" style={imageStyle(post.image)} />
              <div className="card-body">
                <p className="card-category">{post.categoryLabel}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="card-footer">
                  <span>{post.readTime}</span>
                  <strong>Ler agora</strong>
                </div>
              </div>
            </a>
          ))}
          {!hasResults ? <div className="no-results">Nenhum artigo encontrado para esta busca.</div> : null}
        </div>

        <section className="newsletter-box">
          <h2>Receba os melhores conteúdos</h2>
          <p>Análises e guias sobre finanças empresariais direto no seu e-mail.</p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="seu@email.com.br"
              required
            />
            <button disabled={newsletterStatus === "loading"} type="submit">
              {newsletterStatus === "loading" ? "Enviando..." : "Quero receber"}
            </button>
          </form>
          {newsletterStatus === "success" ? <small>Cadastro realizado com sucesso.</small> : null}
          {newsletterStatus === "error" ? <small>Não foi possível cadastrar agora. Tente novamente.</small> : null}
        </section>
      </section>

      <BlogFooter />

      <style jsx global>{`
        .blog-page { min-height: 100vh; background: #f4f8fc; color: #1a2332; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; text-size-adjust: 100%; }
        .blog-shell { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .blog-nav { background: #003956; }
        .blog-nav-inner { max-width: 1200px; height: 64px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
        .blog-logo-link { display: inline-flex; width: 146px; height: 36px; flex: 0 0 auto; }
        .blog-logo-link img { height: 36px; width: 146px; display: block; object-fit: contain; }
        .blog-back { color: rgba(255,255,255,.7); font-size: 13px; font-weight: 700; text-decoration: none; display: inline-flex; gap: 6px; align-items: center; }
        .blog-hero { background: #003956; padding: 56px 0 80px; color: #fff; min-height: 406px; contain: layout paint; }
        .blog-hero .blog-shell { min-height: 270px; display: flex; flex-direction: column; justify-content: center; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,153,221,.15); color: #0099dd; font-size: 11px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(0,153,221,.25); margin-bottom: 24px; }
        .hero-tag:before { content: ""; width: 6px; height: 6px; background: #0099dd; border-radius: 999px; }
        .hero-title { font-size: clamp(36px, 5vw, 60px); line-height: 1.1; letter-spacing: 0; font-weight: 800; margin: 0 0 20px; text-wrap: balance; }
        .hero-title span { color: #0099dd; }
        .hero-sub { max-width: 640px; min-height: 58px; color: rgba(255,255,255,.68); font-size: 17px; line-height: 1.7; margin: 0; }
        .search-box { max-width: 640px; margin-top: 32px; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); border-radius: 14px; padding: 10px 16px; }
        .search-box svg { color: rgba(255,255,255,.45); flex: 0 0 auto; }
        .search-box input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: #fff; font-size: 15px; }
        .search-box input::placeholder { color: rgba(255,255,255,.38); }
        .search-box button { border: 0; border-radius: 8px; padding: 8px 20px; background: #0099dd; color: #fff; font-size: 13px; font-weight: 800; cursor: pointer; }
        .filter-bar { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid #e8edf2; }
        .filter-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
        .filter-inner::-webkit-scrollbar { display: none; }
        .filter-btn { flex: 0 0 auto; border: 0; background: transparent; color: #64748b; padding: 16px 18px; font-size: 13px; font-weight: 800; border-bottom: 2px solid transparent; cursor: pointer; }
        .filter-btn.active { color: #0099dd; border-bottom-color: #0099dd; }
        .blog-main { padding-top: 56px; padding-bottom: 80px; }
        .intro-banner { margin-bottom: 56px; background: linear-gradient(135deg,#003956,#004d73); border-radius: 16px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border: 1px solid rgba(0,153,221,.2); }
        .intro-banner h3 { margin: 0 0 6px; color: #fff; font-size: 20px; font-weight: 900; }
        .intro-banner p { margin: 0; color: rgba(255,255,255,.64); font-size: 14px; }
        .intro-banner span { background: rgba(0,153,221,.15); color: #0099dd; border: 1px solid rgba(0,153,221,.3); font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 8px 18px; border-radius: 999px; white-space: nowrap; }
        .section-title { color: #0099dd; font-size: 11px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 24px; display: flex; align-items: center; gap: 10px; }
        .section-title:after { content: ""; flex: 1; height: 1px; background: #e8edf2; }
        .featured-card { display: grid; grid-template-columns: 1fr 1fr; background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid #e8edf2; text-decoration: none; margin-bottom: 56px; transition: transform .2s, box-shadow .2s; }
        .featured-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,57,86,.12); }
        .featured-image { min-height: 380px; position: relative; background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 32px; }
        .featured-image-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.5), transparent 60%); }
        .featured-image span { position: relative; z-index: 1; background: #0099dd; color: #fff; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; }
        .featured-content { padding: 48px 40px; display: flex; flex-direction: column; justify-content: center; }
        .article-category, .card-category { color: #0099dd; font-size: 11px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; margin: 0 0 14px; }
        .featured-content h2 { color: #003956; font-size: 28px; line-height: 1.3; font-weight: 800; margin: 0 0 16px; }
        .featured-excerpt { color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 28px; }
        .article-meta { display: flex; gap: 16px; color: #94a3b8; font-size: 12px; font-weight: 700; min-height: 18px; font-variant-numeric: tabular-nums; }
        .article-meta span { display: inline-block; min-width: 5ch; line-height: 1.5; }
        .read-btn { margin-top: 28px; width: fit-content; display: inline-flex; gap: 8px; align-items: center; background: #003956; color: #fff; border-radius: 10px; padding: 12px 24px; font-size: 13px; }
        .posts-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-bottom: 56px; }
        .post-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e8edf2; text-decoration: none; transition: transform .2s, box-shadow .2s, border-color .2s; }
        .post-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,57,86,.1); border-color: #0099dd; }
        .card-thumb { height: 180px; background-size: cover; background-position: center; }
        .card-body { padding: 24px; }
        .card-category { font-size: 10px; letter-spacing: 2px; margin-bottom: 10px; }
        .card-body h3 { color: #003956; font-size: 16px; line-height: 1.4; font-weight: 900; margin: 0 0 10px; }
        .card-body p { color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-footer { display: flex; justify-content: space-between; min-height: 31px; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px; font-weight: 800; font-variant-numeric: tabular-nums; }
        .card-footer span { display: inline-block; min-width: 5ch; line-height: 1.35; }
        .card-footer strong { color: #0099dd; }
        .no-results { grid-column: 1 / -1; text-align: center; padding: 48px 24px; color: #94a3b8; }
        .newsletter-box { background: #003956; border-radius: 20px; padding: 56px 48px; text-align: center; color: #fff; }
        .newsletter-box h2 { font-size: 32px; line-height: 1.2; font-weight: 800; margin: 0 0 12px; }
        .newsletter-box p { color: rgba(255,255,255,.6); margin: 0 0 32px; }
        .newsletter-form { display: flex; gap: 12px; max-width: 520px; margin: 0 auto; }
        .newsletter-form input { flex: 1; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.08); color: #fff; border-radius: 10px; padding: 14px 20px; outline: 0; }
        .newsletter-form input::placeholder { color: rgba(255,255,255,.45); }
        .newsletter-form button { border: 0; border-radius: 10px; background: #0099dd; color: #fff; padding: 14px 28px; font-weight: 800; cursor: pointer; }
        .newsletter-box small { display: block; margin-top: 16px; color: rgba(255,255,255,.75); font-weight: 700; }
        .blog-footer { background: #040f1a; color: #fff; padding: 120px 0 64px; }
        .footer-grid { display: grid; grid-template-columns: 4fr 2fr 2fr 3fr; gap: 48px; }
        .footer-logo img { height: 36px; width: auto; margin-bottom: 34px; }
        .footer-bio { color: rgba(255,255,255,.45); font-size: 15px; line-height: 1.7; max-width: 360px; margin: 0 0 28px; }
        .footer-social { display: flex; gap: 12px; }
        .footer-social a { width: 36px; height: 36px; display: grid; place-items: center; color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: rgba(255,255,255,.05); font-size: 13px; font-weight: 900; }
        .footer-col h4 { color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 900; margin: 0 0 28px; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
        .footer-col a, .footer-col p { color: rgba(255,255,255,.45); text-decoration: none; font-size: 14px; line-height: 1.5; }
        .footer-col a:hover { color: #0099dd; }
        .footer-phone { display: block; color: #fff; font-size: 22px; font-weight: 900; margin-bottom: 4px; }
        .footer-hours { display: block; color: rgba(255,255,255,.25); font-size: 10px; letter-spacing: 1.6px; text-transform: uppercase; margin-bottom: 28px; }
        .footer-bottom { margin-top: 80px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,.08); text-align: center; color: rgba(255,255,255,.35); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
        @media (max-width: 900px) {
          .featured-card, .posts-grid, .footer-grid { grid-template-columns: 1fr; }
          .featured-image { min-height: 240px; }
          .featured-content { padding: 28px 24px; }
          .intro-banner, .newsletter-form { flex-direction: column; align-items: stretch; }
        }
        @media (max-width: 640px) {
          .blog-shell, .blog-nav-inner, .filter-inner { padding-left: 16px; padding-right: 16px; }
          .blog-logo-link { width: 130px; }
          .blog-logo-link img { width: 130px; }
          .blog-hero { min-height: 426px; padding-top: 42px; padding-bottom: 58px; }
          .blog-hero .blog-shell { min-height: 326px; }
          .hero-sub { min-height: 87px; }
          .search-box { align-items: stretch; }
          .search-box button { padding-left: 14px; padding-right: 14px; }
          .intro-banner, .newsletter-box { padding: 28px 22px; }
          .blog-footer { padding-top: 72px; }
        }
      `}</style>
    </main>
  );
}

function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-shell">
        <div className="footer-grid">
          <div className="footer-col">
            <a href={mainSiteUrl("/")} className="footer-logo">
              <img src="/images/logo-horizontal-logo.branca.png" alt="mb finance" />
            </a>
            <p className="footer-bio">
              Há mais de 10 anos conectando empresas às melhores soluções financeiras do mercado. Seu elo estratégico com as principais instituições bancárias do Brasil.
            </p>
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/mbfassessoria/?viewAsMember=true" target="_blank" rel="noopener noreferrer">in</a>
              <a href="https://www.instagram.com/mbfassessoria/" target="_blank" rel="noopener noreferrer">ig</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Soluções</h4>
            <ul>
              <li><a href={mainSiteUrl("/#produtos")}>Conta Corrente Empresarial</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Máquina de Cartão</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Seguros e Consórcios</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Crédito Rápido</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Soluções Tributárias</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Telemedicina</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Soluções Personalizadas</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href={mainSiteUrl("/#como-funciona")}>Como Funciona</a></li>
              <li><a href="https://mbfinance.inhire.app/vagas">Trabalhe Conosco</a></li>
              <li><a href={mainSiteUrl("/")}>Seja um Parceiro</a></li>
            </ul>
            <h4 style={{ marginTop: 44 }}>Legal</h4>
            <ul>
              <li><a href={mainSiteUrl("/pages/politica-de-privacidade.html")}>Política de Privacidade</a></li>
              <li><a href={mainSiteUrl("/pages/termos-de-uso.html")}>Termos de Uso</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <span className="footer-phone">(21) 3900-8295</span>
            <span className="footer-hours">Seg - Sex: 9h às 18h</span>
            <p><a href="mailto:atendimento@mbfinance.com.br">atendimento@mbfinance.com.br</a></p>
            <p>
              Av. Rio Branco, 110 - 30º andar<br />
              Centro, Rio de Janeiro - RJ<br />
              CEP: 20040-006
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 MB Assessoria e Estruturação de Negócios LTDA. CNPJ: 26.388.817/0001-72. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

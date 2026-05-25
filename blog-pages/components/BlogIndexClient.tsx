"use client";

import { useMemo, useState, type FormEvent } from "react";
import { pushAnalyticsEvent } from "@/components/AnalyticsTracker";
import type { BlogPost } from "@/types/blog";
import { mainSiteUrl } from "@/lib/site";
import "@/app/blog/blog.css";

const filters = [
  { label: "Todos", value: "todos" },
  { label: "Crédito", value: "credito" },
  { label: "Gestão", value: "gestao" },
  { label: "Conta PJ", value: "conta-pj" },
  { label: "Antecipação", value: "antecipacao" },
  { label: "Tributos", value: "gestao-tributaria" },
];

const marketItems = [
  { label: "Capital de giro", value: "a partir de 1,39% a.m.", trend: "up" },
  { label: "Antecipação", value: "receba em até 24h", trend: "up" },
  { label: "Conta PJ", value: "compare custos", trend: "neutral" },
  { label: "Fluxo de caixa", value: "projeção 90 dias", trend: "neutral" },
];

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
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

function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <div className="article-meta">
      <span>{formatDate(post.date)}</span>
      <span>{post.readTime}</span>
    </div>
  );
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const visiblePosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          (category === "todos" || post.category === category) &&
          matchesSearch(post, query)
      ),
    [category, posts, query]
  );

  const leadPost = visiblePosts.find((post) => post.featured) || visiblePosts[0] || null;
  const secondaryPosts = visiblePosts.filter((post) => post.id !== leadPost?.id).slice(0, 2);
  const listPosts = visiblePosts
    .filter((post) => post.id !== leadPost?.id && !secondaryPosts.some((item) => item.id === post.id));
  const sidebarPosts = posts.filter((post) => post.id !== leadPost?.id).slice(0, 5);
  const hasResults = visiblePosts.length > 0;

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
      if (!response.ok || !data.ok) throw new Error(data.error || "Erro ao inscrever");
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
      results_count: visiblePosts.length,
    });
    pushAnalyticsEvent("search", {
      search_term: searchTerm,
    });
  }

  return (
    <main className="blog-page">
      <div className="network-strip">
        <div className="blog-shell network-strip-inner">
          <a href={mainSiteUrl("/")}>mbfinance.com.br</a>
          <a href={mainSiteUrl("/#produtos")}>Produtos</a>
          <a href={mainSiteUrl("/#como-funciona")}>Como funciona</a>
          <a href={mainSiteUrl("/#contato")}>Atendimento</a>
        </div>
      </div>

      <nav className="blog-nav">
        <div className="blog-nav-inner">
          <a href={mainSiteUrl("/")} className="blog-logo-link" aria-label="MB Finance">
            <span>mb<span>finance.</span></span>
          </a>
          <strong>Negócios</strong>
          <div className="blog-nav-actions">
            <div className="search-box">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") trackSearch();
                }}
                type="search"
                placeholder="Buscar"
                aria-label="Buscar no blog"
              />
            </div>
            <a href={mainSiteUrl("/")} className="blog-back">Ver site oficial</a>
          </div>
        </div>
      </nav>

      <section className="market-strip" aria-label="Indicadores e atalhos">
        <div className="blog-shell market-strip-inner">
          {marketItems.map((item) => (
            <div className="market-item" key={item.label}>
              <span>{item.label}</span>
              <strong className={`trend-${item.trend}`}>{item.value}</strong>
            </div>
          ))}
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
        <div className="section-kicker">
          <span>MB Finance</span>
          <strong>{posts.length} análises publicadas</strong>
        </div>

        {hasResults && leadPost ? (
          <section className="top-news-grid">
            <a
              className="lead-story"
              href={`/blog/${leadPost.slug}`}
              data-cat={leadPost.category}
              data-analytics-label={leadPost.title}
              data-analytics-area="lead_story"
            >
              <p className="article-category">{leadPost.categoryLabel}</p>
              <h1>{leadPost.title}</h1>
              <p>{leadPost.excerpt}</p>
              <ArticleMeta post={leadPost} />
            </a>

            <div className="side-feature-stack">
              {secondaryPosts.map((post) => (
                <a
                  key={post.id}
                  className="side-feature-card"
                  href={`/blog/${post.slug}`}
                  style={imageStyle(post.image)}
                  data-cat={post.category}
                  data-analytics-label={post.title}
                  data-analytics-area="side_feature"
                >
                  <span>{post.categoryLabel}</span>
                  <h2>{post.title}</h2>
                </a>
              ))}
            </div>
          </section>
        ) : (
          <div className="no-results">Nenhum artigo encontrado para esta busca.</div>
        )}

        {hasResults ? (
          <div className="content-layout">
            <section className="news-list" aria-label="Artigos recentes">
              {listPosts.map((post) => (
                <a
                  key={post.id}
                  className="news-row"
                  href={`/blog/${post.slug}`}
                  data-cat={post.category}
                  data-analytics-label={post.title}
                  data-analytics-area="news_list"
                >
                  <div className="news-thumb" style={imageStyle(post.image)} />
                  <div className="news-row-content">
                    <p className="article-category">{post.categoryLabel}</p>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <ArticleMeta post={post} />
                  </div>
                </a>
              ))}
            </section>

            <aside className="blog-sidebar">
              <section className="sidebar-card">
                <h3>Guias rápidos</h3>
                <div className="quick-links">
                  {sidebarPosts.map((post) => (
                    <a key={post.id} href={`/blog/${post.slug}`}>
                      {post.title}
                    </a>
                  ))}
                </div>
              </section>

              <section className="sidebar-card newsletter-card">
                <h3>Receba análises</h3>
                <p>Conteúdos sobre crédito, caixa e gestão direto no seu e-mail.</p>
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="seu@email.com.br"
                    required
                  />
                  <button disabled={newsletterStatus === "loading"} type="submit">
                    {newsletterStatus === "loading" ? "Enviando..." : "Cadastrar"}
                  </button>
                </form>
                {newsletterStatus === "success" ? <small>Cadastro realizado com sucesso.</small> : null}
                {newsletterStatus === "error" ? <small>Não foi possível cadastrar agora. Tente novamente.</small> : null}
              </section>

              <section className="sidebar-card">
                <h3>Editorias</h3>
                <div className="topic-grid">
                  {filters.slice(1).map((item) => (
                    <button key={item.value} type="button" onClick={() => setCategory(item.value)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </section>

      <BlogFooter />
    </main>
  );
}

function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-shell">
        <div className="footer-grid">
          <div className="footer-col">
            <a href={mainSiteUrl("/")} className="footer-logo">mb<span>finance.</span></a>
            <p className="footer-bio">
              Há mais de 10 anos conectando empresas às melhores soluções financeiras do mercado.
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
              <li><a href={mainSiteUrl("/#produtos")}>Crédito Rápido</a></li>
              <li><a href={mainSiteUrl("/#produtos")}>Soluções Tributárias</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href={mainSiteUrl("/#como-funciona")}>Como funciona</a></li>
              <li><a href="https://mbfinance.inhire.app/vagas">Trabalhe conosco</a></li>
              <li><a href={mainSiteUrl("/pages/politica-de-privacidade.html")}>Política de privacidade</a></li>
              <li><a href={mainSiteUrl("/pages/termos-de-uso.html")}>Termos de uso</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <span className="footer-phone">(21) 3900-8295</span>
            <span className="footer-hours">Seg - Sex: 9h às 18h</span>
            <p><a href="mailto:atendimento@mbfinance.com.br">atendimento@mbfinance.com.br</a></p>
            <p>Av. Rio Branco, 110 - 30º andar<br />Centro, Rio de Janeiro - RJ</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 MB Assessoria e Estruturação de Negócios LTDA. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

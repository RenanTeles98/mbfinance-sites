"use client";

import { useMemo, useState, type FormEvent } from "react";
import { pushAnalyticsEvent } from "@/components/AnalyticsTracker";
import type { BlogPost } from "@/types/blog";
import { mainSiteUrl } from "@/lib/site";
import "@/app/blog/blog.css";

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

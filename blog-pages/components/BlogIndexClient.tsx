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

const productHubs = [
  {
    label: "Todos",
    value: "todos",
    description: "Veja todos os conteúdos e soluções financeiras da MB Finance.",
  },
  {
    label: "Crédito",
    value: "credito",
    description: "Capital de giro e liquidez para manter a operação rodando.",
  },
  {
    label: "Gestão",
    value: "gestao",
    description: "Conteúdo para melhorar margem, caixa e tomada de decisão.",
  },
  {
    label: "Conta PJ",
    value: "conta-pj",
    description: "Estrutura bancária para organizar pagamentos e recebimentos.",
  },
  {
    label: "Antecipação",
    value: "antecipacao",
    description: "Recebíveis convertidos em caixa com mais previsibilidade.",
  },
  {
    label: "Tributos",
    value: "gestao-tributaria",
    description: "Planejamento tributário e impactos fiscais para empresas.",
  },
];

const specialistWhatsAppUrl = `https://wa.me/552139008295?text=${encodeURIComponent(
  "Olá! Vim pelo hub financeiro da MB Finance e gostaria de falar com um especialista."
)}`;

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
  const [category, setCategory] = useState("todos");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const visiblePosts = useMemo(
    () =>
      posts.filter(
        (post) => category === "todos" || post.category === category
      ),
    [category, posts]
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

      <section className="blog-shell blog-main">
        <aside className="product-side-menu" id="hub-produtos" aria-label="Menu de produtos">
          <span>Escolha por necessidade</span>
          <h2>Produtos e conteúdos</h2>
          <div className="product-menu-list">
            {productHubs.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`product-menu-button ${category === item.value ? "active" : ""}`}
                onClick={() => setCategory(item.value)}
              >
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="blog-main-content">
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
                <section className="sidebar-card hot-news-card">
                  <h3>Mais acessadas</h3>
                  <ol className="quick-links hot-links">
                    {sidebarPosts.map((post, index) => (
                      <li key={post.id}>
                        <a href={`/blog/${post.slug}`}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{post.title}</strong>
                        </a>
                      </li>
                    ))}
                  </ol>
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
        </div>
      </section>

      <section className="blog-cta-section">
        <div className="blog-shell blog-cta-box">
          <div>
            <span>Atendimento MB Finance</span>
            <h2>Precisa escolher a solução certa para sua empresa?</h2>
            <p>Fale com um especialista para comparar crédito, conta PJ, antecipação e gestão de caixa.</p>
          </div>
          <a href={specialistWhatsAppUrl} target="_blank" rel="noopener noreferrer">
            Falar com especialista
          </a>
        </div>
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

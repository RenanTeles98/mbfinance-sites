import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import MetaPixel from "@/components/MetaPixel";
import { readBlogPostBySlug, readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl, mainSiteUrl } from "@/lib/site";
import type { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const AUTHOR_NAME = "Equipe MB Finance";

const displayTitles: Record<string, string> = {
  "reforma-tributaria-o-que-muda-para-sua-empresa":
    "Reforma Tributária: o que muda para a sua empresa a partir de 2026",
};

const ctas: Record<string, { title: string; description: string; button: string; message: string }> = {
  "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado": {
    title: "Precisa estruturar capital de giro?",
    description:
      "A MB Finance ajuda sua empresa a organizar os dados, comparar propostas e encontrar linhas com melhor aderência ao caixa.",
    button: "Simular capital de giro",
    message: "Olá! Li o artigo sobre capital de giro e quero simular uma linha para minha empresa.",
  },
  "conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher": {
    title: "Quer comparar contas PJ com critério?",
    description:
      "A MB Finance avalia custo total, integração, atendimento e recursos bancários para indicar soluções alinhadas à rotina da sua empresa.",
    button: "Comparar contas PJ",
    message: "Olá! Li o artigo sobre conta PJ e quero comparar opções para minha empresa.",
  },
  "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio": {
    title: "Quer antecipar recebíveis com controle?",
    description:
      "A MB Finance compara taxas, prazos e custo efetivo para sua empresa usar antecipação sem pressionar o caixa futuro.",
    button: "Calcular antecipação",
    message: "Olá! Li o artigo sobre antecipação de recebíveis e quero calcular opções para minha empresa.",
  },
  "reforma-tributaria-o-que-muda-para-sua-empresa": {
    title: "Quer preparar sua empresa para a Reforma Tributária?",
    description:
      "A MB Finance ajuda a mapear impactos financeiros, contratos, precificação e rotina tributária antes da transição ganhar força.",
    button: "Avaliar impactos tributários",
    message: "Olá! Li o artigo sobre Reforma Tributária e quero avaliar os impactos na minha empresa.",
  },
  "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes": {
    title: "Quer organizar o fluxo de caixa?",
    description:
      "A MB Finance ajuda sua empresa a conectar conta PJ, crédito e antecipação em uma rotina financeira mais previsível.",
    button: "Organizar meu caixa",
    message: "Olá! Li o artigo sobre fluxo de caixa e quero organizar melhor o caixa da minha empresa.",
  },
};

const relatedBySlug: Record<string, string[]> = {
  "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado": [
    "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes",
    "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio",
  ],
  "conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher": [
    "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio",
    "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes",
  ],
  "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio": [
    "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado",
    "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes",
  ],
  "reforma-tributaria-o-que-muda-para-sua-empresa": [
    "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes",
    "conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher",
  ],
  "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes": [
    "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio",
    "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado",
  ],
};

function getDisplayTitle(post: BlogPost) {
  return displayTitles[post.slug] || post.title;
}

function replaceOnce(content: string, search: string, replacement: string) {
  return content.includes(search) ? content.replace(search, replacement) : content;
}

function enhanceArticleContent(post: BlogPost) {
  let content = post.content;

  if (post.slug === "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado") {
    content = replaceOnce(
      content,
      "<ul><li>Prazo da operação e risco total percebido.</li><li>Garantia oferecida e qualidade dos recebíveis.</li><li>Destino do recurso e previsão de retorno.</li><li>Qualidade cadastral, fiscal e societária.</li><li>Histórico de relacionamento com o mercado.</li></ul>",
      "<ul><li>Prazo da operação e risco total percebido: quanto maior a incerteza sobre pagamento e ciclo de caixa, maior tende a ser o custo.</li><li>Garantia oferecida e qualidade dos recebíveis: garantias sólidas e recebíveis previsíveis reduzem risco para a instituição.</li><li>Destino do recurso e previsão de retorno: crédito para estoque, contrato fechado ou expansão comprovável costuma ser melhor interpretado.</li><li>Qualidade cadastral, fiscal e societária: pendências, alterações recentes e inconsistências documentais atrasam análise e encarecem a proposta.</li><li>Histórico de relacionamento com o mercado: comportamento bancário, pontualidade e recorrência de faturamento ajudam a sustentar a negociação.</li></ul>"
    );
    content = replaceOnce(
      content,
      "entende seu ciclo financeiro",
      'entende seu <a href="/blog/fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes">ciclo financeiro e fluxo de caixa</a>'
    );
  }

  if (post.slug === "conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher") {
    if (!content.includes("entenda quando vale antecipar")) {
      content = replaceOnce(
        content,
        "antecipação de recebíveis vinculada",
        'antecipação de recebíveis vinculada'
          + ' (<a href="/blog/antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio">entenda quando vale antecipar</a>)'
      );
    }
    if (!content.includes(">taxas de maquininha</a>")) {
      content = replaceOnce(
        content,
        "taxas de maquininha",
        `<a href="${mainSiteUrl("/#produtos")}">taxas de maquininha</a>`
      );
    }
    content = replaceOnce(content, "Uma conta pensada para MEI", "Uma conta pensada para MEI (Microempreendedor Individual)");
  }

  if (post.slug === "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio") {
    if (!content.includes(">capital de giro</a>")) {
      content = replaceOnce(
        content,
        "como capital de giro",
        'como <a href="/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado">capital de giro</a>'
      );
    }
    if (!content.includes("Exemplo simples: se a empresa antecipa R$ 100 mil")) {
      content = replaceOnce(
        content,
        "<p>O empresário precisa olhar para o valor líquido recebido agora, para a data original do recebimento e para todas as tarifas envolvidas. Isso mostra o custo efetivo do adiantamento e permite comparar com outras alternativas, como <a href=\"/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado\">capital de giro</a> ou renegociação com fornecedor.</p>",
        "<p>O empresário precisa olhar para o valor líquido recebido agora, para a data original do recebimento e para todas as tarifas envolvidas. Isso mostra o custo efetivo do adiantamento e permite comparar com outras alternativas, como <a href=\"/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado\">capital de giro</a> ou renegociação com fornecedor.</p><p>Exemplo simples: se a empresa antecipa R$ 100 mil que venceriam em 30 dias e recebe R$ 98 mil líquidos hoje, o custo financeiro é de R$ 2 mil no mês, ou 2% sobre o valor antecipado. Esse número precisa ser comparado com o ganho gerado pelo uso do dinheiro e com outras linhas disponíveis.</p>"
      );
    }
  }

  if (post.slug === "reforma-tributaria-o-que-muda-para-sua-empresa") {
    content = replaceOnce(
      content,
      "<li>Fim do ICMS e ISS: substituídos pelo IBS a partir de 2029.</li>",
      "<li>Substituição gradual de ICMS e ISS pelo IBS entre 2029 e 2032, com extinção completa prevista para 2033.</li>"
    );
    if (!content.includes("split payment")) {
      content = replaceOnce(
        content,
        "<p>Também é importante revisar contratos com clientes e fornecedores que têm cláusulas atreladas a alíquotas vigentes. Mudança de regime sem revisão contratual gera exposição jurídica e financeira.</p>",
        "<p>Também é importante revisar contratos com clientes e fornecedores que têm cláusulas atreladas a alíquotas vigentes. Mudança de regime sem revisão contratual gera exposição jurídica e financeira.</p><p>Outro ponto operacional é o split payment, mecanismo em que parte do imposto pode ser separada no momento da liquidação financeira. Para empresas com margens apertadas, isso exige atenção ao fluxo de caixa, conciliação e prazo real de disponibilidade dos recursos.</p><p>Para aprofundar o tema, consulte a <a href=\"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm\" target=\"_blank\" rel=\"noopener noreferrer\">Lei Complementar 214/2025</a> e os materiais oficiais da <a href=\"https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/janeiro/reforma-tributaria-sancionada-a-lei-complementar-214-2025\" target=\"_blank\" rel=\"noopener noreferrer\">Receita Federal</a>.</p>"
      );
    }
    if (!content.includes("Perguntas frequentes")) {
      content += "<h2>Perguntas frequentes</h2><h3>A Reforma Tributária muda tudo em 2026?</h3><p>Não. Em 2026 começa uma fase parcial e de teste, com transição gradual nos anos seguintes. O impacto completo aparece ao longo do cronograma até 2033.</p><h3>Empresa do Simples Nacional precisa se preocupar?</h3><p>Sim. Mesmo com regras próprias, clientes, fornecedores, créditos fiscais e formação de preço podem mudar durante a transição.</p><h3>O que revisar primeiro?</h3><p>Mapeie tributos atuais, contratos, precificação, sistemas de emissão fiscal e impacto no caixa projetado.</p>";
    }
  }

  if (post.slug === "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes") {
    if (!content.includes("<blockquote>Saldo é fotografia. Fluxo é filme.</blockquote>")) {
      content = replaceOnce(
        content,
        "<p>O empresário normalmente descobre que o caixa está apertado tarde demais. Isso acontece porque muita empresa acompanha apenas saldo em conta, e não fluxo de caixa. Saldo é fotografia. Fluxo é filme. Quem olha só para a fotografia perde o movimento das próximas semanas.</p>",
        "<p>O empresário normalmente descobre que o caixa está apertado tarde demais. Isso acontece porque muita empresa acompanha apenas saldo em conta, e não fluxo de caixa. Saldo é fotografia. Fluxo é filme. Quem olha só para a fotografia perde o movimento das próximas semanas.</p><blockquote>Saldo é fotografia. Fluxo é filme.</blockquote>"
      );
    }
    content = replaceOnce(
      content,
      "Ter de 15 a 30 dias de despesas fixas projetadas já muda a qualidade das decisões.",
      "Ter de 15 a 30 dias de despesas fixas projetadas já muda a qualidade das decisões como ponto de partida; a meta saudável, quando possível, é caminhar para três ou mais meses de despesas essenciais."
    );
    content = replaceOnce(
      content,
      "antecipar uma linha previamente aprovada",
      'usar <a href="/blog/antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio">antecipação de recebíveis</a> ou uma linha previamente aprovada'
    );
  }

  return content;
}

function getRelatedPosts(post: BlogPost, posts: BlogPost[]) {
  const slugs = relatedBySlug[post.slug] || [];
  return slugs
    .map((slug) => posts.find((item) => item.slug === slug))
    .filter((item): item is BlogPost => Boolean(item));
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
    return { title: "Artigo não encontrado | MB Finance" };
  }
  const title = getDisplayTitle(post);

  return {
    title: post.seoTitle || `${title} | MB Finance`,
    description: post.seoDesc || post.excerpt,
    alternates: {
      canonical: blogUrl(`/blog/${post.slug}`),
    },
    openGraph: {
      title: post.seoTitle || title,
      description: post.seoDesc || post.excerpt,
      url: blogUrl(`/blog/${post.slug}`),
      type: "article",
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await readBlogPostBySlug(params.slug);
  if (!post) notFound();
  const posts = await readPublishedBlogPosts();
  const title = getDisplayTitle(post);
  const content = enhanceArticleContent(post);
  const cta = ctas[post.slug] || {
    title: "Precisa falar com um especialista?",
    description:
      "A MB Finance ajuda sua empresa a comparar linhas, contas e soluções com mais critério.",
    button: "Falar com um especialista",
    message: `Olá! Li o artigo "${title}" e quero falar com um especialista.`,
  };
  const relatedPosts = getRelatedPosts(post, posts);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: post.seoDesc || post.excerpt,
    image: post.image ? [post.image] : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: AUTHOR_NAME,
      url: mainSiteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "MB Finance",
      logo: {
        "@type": "ImageObject",
        url: blogUrl("/images/logo-horizontal-logo.png.png"),
      },
    },
    mainEntityOfPage: blogUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <GoogleAdsTag />
      <MetaPixel />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="min-h-screen bg-slate-50">
      <nav style={{ background: "#003956", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href={mainSiteUrl("/")}>
            <img src="/images/logo-horizontal-logo.branca.png" alt="MB Finance" style={{ height: 36, width: "auto", display: "block" }} />
          </a>
          <a href="/blog" className="flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
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
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-white/60">
            <span>Por {AUTHOR_NAME}</span>
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
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {relatedPosts.length > 0 ? (
          <section className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Leitura relacionada</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-lg"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">
                    {relatedPost.categoryLabel}
                  </span>
                  <h2 className="mt-2 text-lg font-black leading-snug text-[#003956]">
                    {getDisplayTitle(relatedPost)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10 rounded-[24px] bg-[#003956] px-8 py-10 text-white">
          <h2 className="font-sans text-3xl font-black">{cta.title}</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            {cta.description}
          </p>
          <a
            href={`https://wa.me/552139008295?text=${encodeURIComponent(
              cta.message
            )}`}
            className="mt-6 inline-flex rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
            data-analytics-event="cta_click"
            data-analytics-label={cta.button}
            data-analytics-area="article_cta"
          >
            {cta.button}
          </a>
        </div>
      </article>

      <footer className="text-white" style={{ background: "#040f1a", padding: "80px 0 64px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* Col 1: Brand */}
            <div className="flex flex-col gap-7 lg:col-span-4">
              <a href={mainSiteUrl("/")} className="inline-block opacity-100 transition-opacity hover:opacity-80">
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
                  <li key={item}><a href={mainSiteUrl("/#produtos")} className="transition-colors hover:text-brand-secondary">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Col 3: Empresa + Legal */}
            <div className="flex flex-col gap-10 lg:col-span-2">
              <div>
                <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-white">Empresa</h4>
                <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <li><a href={mainSiteUrl("/#como-funciona")} className="transition-colors hover:text-brand-secondary">Como Funciona</a></li>
                  <li><a href="https://mbfinance.inhire.app/vagas" className="transition-colors hover:text-brand-secondary">Trabalhe Conosco</a></li>
                  <li><a href={mainSiteUrl("/")} className="transition-colors hover:text-brand-secondary">Seja um Parceiro</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-7 text-xs font-bold uppercase tracking-widest text-white">Legal</h4>
                <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <li><a href={mainSiteUrl("/pages/politica-de-privacidade.html")} className="transition-colors hover:text-brand-secondary">Política de Privacidade</a></li>
                  <li><a href={mainSiteUrl("/pages/termos-de-uso.html")} className="transition-colors hover:text-brand-secondary">Termos de Uso</a></li>
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
    </>
  );
}

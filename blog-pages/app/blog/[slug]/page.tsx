import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import MetaPixel from "@/components/MetaPixel";
import { readBlogPostBySlug, readPublishedBlogPosts } from "@/lib/blog-store";
import { blogUrl, mainSiteUrl } from "@/lib/site";
import type { BlogPost } from "@/types/blog";
import PostEngagement from "@/components/PostEngagement";
import { getApprovedComments } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const AUTHOR_NAME = "Equipe Mb Finance";

const displayTitles: Record<string, string> = {
  "reforma-tributaria-o-que-muda-para-sua-empresa":
    "Reforma TributÃ¡ria: o que muda para a sua empresa a partir de 2026",
};

const ctas: Record<string, { title: string; description: string; button: string; message: string }> = {
  "como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado": {
    title: "Precisa estruturar capital de giro?",
    description:
      "A Mb Finance ajuda sua empresa a organizar os dados, comparar propostas e encontrar linhas com melhor aderÃªncia ao caixa.",
    button: "Simular capital de giro",
    message: "OlÃ¡! Li o artigo sobre capital de giro e quero simular uma linha para minha empresa.",
  },
  "conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher": {
    title: "Quer comparar contas PJ com critÃ©rio?",
    description:
      "A Mb Finance avalia custo total, integraÃ§Ã£o, atendimento e recursos bancÃ¡rios para indicar soluÃ§Ãµes alinhadas Ã  rotina da sua empresa.",
    button: "Comparar contas PJ",
    message: "OlÃ¡! Li o artigo sobre conta PJ e quero comparar opÃ§Ãµes para minha empresa.",
  },
  "antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio": {
    title: "Quer antecipar recebÃ­veis com controle?",
    description:
      "A Mb Finance compara taxas, prazos e custo efetivo para sua empresa usar antecipaÃ§Ã£o sem pressionar o caixa futuro.",
    button: "Calcular antecipaÃ§Ã£o",
    message: "OlÃ¡! Li o artigo sobre antecipaÃ§Ã£o de recebÃ­veis e quero calcular opÃ§Ãµes para minha empresa.",
  },
  "reforma-tributaria-o-que-muda-para-sua-empresa": {
    title: "Quer preparar sua empresa para a Reforma TributÃ¡ria?",
    description:
      "A Mb Finance ajuda a mapear impactos financeiros, contratos, precificaÃ§Ã£o e rotina tributÃ¡ria antes da transiÃ§Ã£o ganhar forÃ§a.",
    button: "Avaliar impactos tributÃ¡rios",
    message: "OlÃ¡! Li o artigo sobre Reforma TributÃ¡ria e quero avaliar os impactos na minha empresa.",
  },
  "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes": {
    title: "Quer organizar o fluxo de caixa?",
    description:
      "A Mb Finance ajuda sua empresa a conectar conta PJ, crÃ©dito e antecipaÃ§Ã£o em uma rotina financeira mais previsÃ­vel.",
    button: "Organizar meu caixa",
    message: "OlÃ¡! Li o artigo sobre fluxo de caixa e quero organizar melhor o caixa da minha empresa.",
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
      "<ul><li>Prazo da operaÃ§Ã£o e risco total percebido.</li><li>Garantia oferecida e qualidade dos recebÃ­veis.</li><li>Destino do recurso e previsÃ£o de retorno.</li><li>Qualidade cadastral, fiscal e societÃ¡ria.</li><li>HistÃ³rico de relacionamento com o mercado.</li></ul>",
      "<ul><li>Prazo da operaÃ§Ã£o e risco total percebido: quanto maior a incerteza sobre pagamento e ciclo de caixa, maior tende a ser o custo.</li><li>Garantia oferecida e qualidade dos recebÃ­veis: garantias sÃ³lidas e recebÃ­veis previsÃ­veis reduzem risco para a instituiÃ§Ã£o.</li><li>Destino do recurso e previsÃ£o de retorno: crÃ©dito para estoque, contrato fechado ou expansÃ£o comprovÃ¡vel costuma ser melhor interpretado.</li><li>Qualidade cadastral, fiscal e societÃ¡ria: pendÃªncias, alteraÃ§Ãµes recentes e inconsistÃªncias documentais atrasam anÃ¡lise e encarecem a proposta.</li><li>HistÃ³rico de relacionamento com o mercado: comportamento bancÃ¡rio, pontualidade e recorrÃªncia de faturamento ajudam a sustentar a negociaÃ§Ã£o.</li></ul>"
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
        "antecipaÃ§Ã£o de recebÃ­veis vinculada",
        'antecipaÃ§Ã£o de recebÃ­veis vinculada'
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
        "<p>O empresÃ¡rio precisa olhar para o valor lÃ­quido recebido agora, para a data original do recebimento e para todas as tarifas envolvidas. Isso mostra o custo efetivo do adiantamento e permite comparar com outras alternativas, como <a href=\"/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado\">capital de giro</a> ou renegociaÃ§Ã£o com fornecedor.</p>",
        "<p>O empresÃ¡rio precisa olhar para o valor lÃ­quido recebido agora, para a data original do recebimento e para todas as tarifas envolvidas. Isso mostra o custo efetivo do adiantamento e permite comparar com outras alternativas, como <a href=\"/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado\">capital de giro</a> ou renegociaÃ§Ã£o com fornecedor.</p><p>Exemplo simples: se a empresa antecipa R$ 100 mil que venceriam em 30 dias e recebe R$ 98 mil lÃ­quidos hoje, o custo financeiro Ã© de R$ 2 mil no mÃªs, ou 2% sobre o valor antecipado. Esse nÃºmero precisa ser comparado com o ganho gerado pelo uso do dinheiro e com outras linhas disponÃ­veis.</p>"
      );
    }
  }

  if (post.slug === "reforma-tributaria-o-que-muda-para-sua-empresa") {
    content = replaceOnce(
      content,
      "<li>Fim do ICMS e ISS: substituÃ­dos pelo IBS a partir de 2029.</li>",
      "<li>SubstituiÃ§Ã£o gradual de ICMS e ISS pelo IBS entre 2029 e 2032, com extinÃ§Ã£o completa prevista para 2033.</li>"
    );
    if (!content.includes("split payment")) {
      content = replaceOnce(
        content,
        "<p>TambÃ©m Ã© importante revisar contratos com clientes e fornecedores que tÃªm clÃ¡usulas atreladas a alÃ­quotas vigentes. MudanÃ§a de regime sem revisÃ£o contratual gera exposiÃ§Ã£o jurÃ­dica e financeira.</p>",
        "<p>TambÃ©m Ã© importante revisar contratos com clientes e fornecedores que tÃªm clÃ¡usulas atreladas a alÃ­quotas vigentes. MudanÃ§a de regime sem revisÃ£o contratual gera exposiÃ§Ã£o jurÃ­dica e financeira.</p><p>Outro ponto operacional Ã© o split payment, mecanismo em que parte do imposto pode ser separada no momento da liquidaÃ§Ã£o financeira. Para empresas com margens apertadas, isso exige atenÃ§Ã£o ao fluxo de caixa, conciliaÃ§Ã£o e prazo real de disponibilidade dos recursos.</p><p>Para aprofundar o tema, consulte a <a href=\"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm\" target=\"_blank\" rel=\"noopener noreferrer\">Lei Complementar 214/2025</a> e os materiais oficiais da <a href=\"https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/janeiro/reforma-tributaria-sancionada-a-lei-complementar-214-2025\" target=\"_blank\" rel=\"noopener noreferrer\">Receita Federal</a>.</p>"
      );
    }
    if (!content.includes("Perguntas frequentes")) {
      content += "<h2>Perguntas frequentes</h2><h3>A Reforma TributÃ¡ria muda tudo em 2026?</h3><p>NÃ£o. Em 2026 comeÃ§a uma fase parcial e de teste, com transiÃ§Ã£o gradual nos anos seguintes. O impacto completo aparece ao longo do cronograma atÃ© 2033.</p><h3>Empresa do Simples Nacional precisa se preocupar?</h3><p>Sim. Mesmo com regras prÃ³prias, clientes, fornecedores, crÃ©ditos fiscais e formaÃ§Ã£o de preÃ§o podem mudar durante a transiÃ§Ã£o.</p><h3>O que revisar primeiro?</h3><p>Mapeie tributos atuais, contratos, precificaÃ§Ã£o, sistemas de emissÃ£o fiscal e impacto no caixa projetado.</p>";
    }
  }

  if (post.slug === "fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes") {
    if (!content.includes("<blockquote>Saldo Ã© fotografia. Fluxo Ã© filme.</blockquote>")) {
      content = replaceOnce(
        content,
        "<p>O empresÃ¡rio normalmente descobre que o caixa estÃ¡ apertado tarde demais. Isso acontece porque muita empresa acompanha apenas saldo em conta, e nÃ£o fluxo de caixa. Saldo Ã© fotografia. Fluxo Ã© filme. Quem olha sÃ³ para a fotografia perde o movimento das prÃ³ximas semanas.</p>",
        "<p>O empresÃ¡rio normalmente descobre que o caixa estÃ¡ apertado tarde demais. Isso acontece porque muita empresa acompanha apenas saldo em conta, e nÃ£o fluxo de caixa. Saldo Ã© fotografia. Fluxo Ã© filme. Quem olha sÃ³ para a fotografia perde o movimento das prÃ³ximas semanas.</p><blockquote>Saldo Ã© fotografia. Fluxo Ã© filme.</blockquote>"
      );
    }
    content = replaceOnce(
      content,
      "Ter de 15 a 30 dias de despesas fixas projetadas jÃ¡ muda a qualidade das decisÃµes.",
      "Ter de 15 a 30 dias de despesas fixas projetadas jÃ¡ muda a qualidade das decisÃµes como ponto de partida; a meta saudÃ¡vel, quando possÃ­vel, Ã© caminhar para trÃªs ou mais meses de despesas essenciais."
    );
    content = replaceOnce(
      content,
      "antecipar uma linha previamente aprovada",
      'usar <a href="/blog/antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio">antecipaÃ§Ã£o de recebÃ­veis</a> ou uma linha previamente aprovada'
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
    return { title: "Artigo nÃ£o encontrado | Mb Finance" };
  }
  const title = getDisplayTitle(post);

  return {
    title: post.seoTitle || `${title} | Mb Finance`,
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
  const [posts, initialComments] = await Promise.all([
    readPublishedBlogPosts(),
    getApprovedComments(params.slug),
  ]);
  const title = getDisplayTitle(post);
  const content = enhanceArticleContent(post);
  const productCtas: Record<string, { title: string; description: string; button: string; message: string; label: string }> = {
    'conta-pj': {
      label: "Conta Corrente Empresarial",
      title: "Abra sua conta empresarial sem burocracia",
      description: "A Mb Finance simplifica a abertura de conta nos principais bancos. Sem filas, sem papelada, com toda estrutura que seu CNPJ precisa.",
      button: "Abrir Conta Empresarial",
      message: `OlÃ¡! Li o artigo "${title}" e quero abrir minha conta empresarial com a Mb Finance.`,
    },
    'maquininha': {
      label: "MÃ¡quina de CartÃ£o",
      title: "Pare de perder dinheiro nas taxas da maquininha",
      description: "Maquininhas com as menores taxas do mercado e recebimento na hora. Sem aluguel, sem fidelidade, sem letra miÃºda.",
      button: "Pedir Minha Maquininha",
      message: `OlÃ¡! Li o artigo "${title}" e tenho interesse na MÃ¡quina de CartÃ£o da Mb Finance.`,
    },
    'credito-rapido': {
      label: "CrÃ©dito RÃ¡pido",
      title: "CrÃ©dito para sua empresa com as melhores condiÃ§Ãµes",
      description: "A Mb Finance conecta sua empresa a mÃºltiplos bancos ao mesmo tempo â€” crÃ©dito empresarial, imobiliÃ¡rio e veicular com aprovaÃ§Ã£o Ã¡gil.",
      button: "Simular CrÃ©dito Agora",
      message: `OlÃ¡! Li o artigo "${title}" e quero simular crÃ©dito para minha empresa com a Mb Finance.`,
    },
    'antecipacao': {
      label: "AntecipaÃ§Ã£o de RecebÃ­veis",
      title: "Transforme vendas a prazo em dinheiro imediato",
      description: "Antecipe recebÃ­veis de cartÃ£o e boleto com as melhores taxas do mercado. Processo 100% digital, dinheiro na conta em horas.",
      button: "Antecipar Meus RecebÃ­veis",
      message: `OlÃ¡! Li o artigo "${title}" e quero antecipar meus recebÃ­veis com a Mb Finance.`,
    },
    'seguros': {
      label: "Seguros e ConsÃ³rcios",
      title: "Proteja o patrimÃ´nio da sua empresa",
      description: "A Mb Finance estrutura seguros empresariais e consÃ³rcios com as melhores condiÃ§Ãµes â€” proteÃ§Ã£o real para o que vocÃª levou anos construindo.",
      button: "Conhecer Seguros e ConsÃ³rcios",
      message: `OlÃ¡! Li o artigo "${title}" e quero conhecer as opÃ§Ãµes de seguros e consÃ³rcios da Mb Finance.`,
    },
    'tributario': {
      label: "SoluÃ§Ãµes TributÃ¡rias",
      title: "Pague menos impostos dentro da lei",
      description: "DiagnÃ³stico, recuperaÃ§Ã£o e planejamento fiscal com especialistas que conhecem a realidade do empresÃ¡rio PJ. Sua empresa pode estar pagando mais do que deve.",
      button: "Fazer DiagnÃ³stico TributÃ¡rio",
      message: `OlÃ¡! Li o artigo "${title}" e quero fazer um diagnÃ³stico tributÃ¡rio com a Mb Finance.`,
    },
    'telemedicina': {
      label: "Telemedicina",
      title: "MÃ©dico na tela para vocÃª e sua equipe",
      description: "OfereÃ§a acesso a saÃºde para toda a famÃ­lia dos seus colaboradores â€” benefÃ­cio de alto valor, sem o custo de um plano de saÃºde tradicional.",
      button: "Conhecer a Telemedicina",
      message: `OlÃ¡! Li o artigo "${title}" e quero conhecer a soluÃ§Ã£o de telemedicina da Mb Finance.`,
    },
    'solucoes-personalizadas': {
      label: "SoluÃ§Ãµes Personalizadas",
      title: "Sua empresa precisa de mais do que o banco oferece",
      description: "Para operaÃ§Ãµes complexas e grandes empresas, a Mb Finance estrutura soluÃ§Ãµes financeiras sob medida que os bancos tradicionais nÃ£o entregam.",
      button: "Falar com um Especialista",
      message: `OlÃ¡! Li o artigo "${title}" e quero conhecer as soluÃ§Ãµes personalizadas da Mb Finance para minha empresa.`,
    },
  };

  const cta = (post.product && productCtas[post.product]) || ctas[post.slug] || {
    title: "Precisa falar com um especialista?",
    description: "A Mb Finance ajuda sua empresa a comparar linhas, contas e soluÃ§Ãµes com mais critÃ©rio.",
    button: "Falar com um especialista",
    message: `OlÃ¡! Li o artigo "${title}" e quero falar com um especialista.`,
    accent: "#0099dd",
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
      name: "Mb Finance",
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
            <img src="/images/logo-horizontal-logo.branca.png" alt="Mb Finance" style={{ height: 36, width: "auto", display: "block" }} />
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
            className="w-full rounded-[24px] border border-white/20 bg-cover bg-center shadow-2xl"
            style={{ backgroundImage: `url("${post.image}")`, aspectRatio: '16/9' }}
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

        <div className="mt-10 overflow-hidden rounded-[24px] bg-[#003956] px-8 py-10 text-white" style={{ background: "linear-gradient(135deg, #003956 0%, #002840 100%)" }}>
          {post.product && productCtas[post.product] && (
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-400">
              Mb Finance â€” {productCtas[post.product].label}
            </p>
          )}
          <h2 className="font-sans text-2xl font-black leading-snug md:text-3xl">{cta.title}</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            {cta.description}
          </p>
          <a
            href={`https://wa.me/552139008295?text=${encodeURIComponent(cta.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-400 hover:shadow-lg"
            data-analytics-event="cta_click"
            data-analytics-label={cta.button}
            data-analytics-area="article_cta"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {cta.button}
          </a>
        </div>

        <PostEngagement slug={post.slug} initialComments={initialComments} />
      </article>

      <footer className="text-white" style={{ background: "#040f1a", padding: "80px 0 64px" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* Col 1: Brand */}
            <div className="flex flex-col gap-7 lg:col-span-4">
              <a href={mainSiteUrl("/")} className="inline-block opacity-100 transition-opacity hover:opacity-80">
                <img src="/images/logo-horizontal-logo.branca.png" alt="Mb Finance" style={{ height: 36, width: "auto" }} />
              </a>
              <p className="max-w-[280px] text-[15px] font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                HÃ¡ mais de 10 anos conectando empresas Ã s melhores soluÃ§Ãµes financeiras do mercado. Seu elo estratÃ©gico com as principais instituiÃ§Ãµes bancÃ¡rias do Brasil.
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

            {/* Col 2: SoluÃ§Ãµes */}
            <div className="lg:col-span-3">
              <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-white">SoluÃ§Ãµes</h4>
              <ul className="flex flex-col gap-3.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {["Conta Corrente Empresarial","MÃ¡quina de CartÃ£o","Seguros e ConsÃ³rcios","CrÃ©dito RÃ¡pido","SoluÃ§Ãµes TributÃ¡rias","Telemedicina","SoluÃ§Ãµes Personalizadas"].map((item) => (
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
                  <li><a href={mainSiteUrl("/pages/politica-de-privacidade.html")} className="transition-colors hover:text-brand-secondary">PolÃ­tica de Privacidade</a></li>
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
                  <div className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Seg - Sex: 9h Ã s 18h</div>
                </div>
                <a href="mailto:atendimento@mbfinance.com.br" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>atendimento@mbfinance.com.br</a>
                <div className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Av. Rio Branco, 110 - 30Âº andar<br />
                  Centro, Rio de Janeiro - RJ<br />
                  CEP: 20040-006
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-10 text-center">
            <p className="text-[10px] uppercase leading-relaxed tracking-[2px] sm:text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Â© 2026 MB ASSESSORIA E ESTRUTURAÃ‡ÃƒO DE NEGÃ“CIOS LTDA. CNPJ: 26.388.817/0001-72. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
        </footer>
      </main>
    </>
  );
}

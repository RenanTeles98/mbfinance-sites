/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/blog.html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/pages/blog.html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog-admin.html",
        destination: "/pages/blog-admin.html",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/pages/blog-admin.html",
        permanent: false,
      },
      {
        source: "/artigo-capital-de-giro-melhores-taxas.html",
        destination: "/blog/como-conseguir-capital-de-giro-com-as-melhores-taxas-do-mercado",
        permanent: true,
      },
      {
        source: "/artigo-conta-pj-o-que-sua-empresa-precisa-saber.html",
        destination: "/blog/conta-pj-o-que-sua-empresa-precisa-saber-antes-de-escolher",
        permanent: true,
      },
      {
        source: "/artigo-antecipacao-de-recebiveis-quando-vale-a-pena.html",
        destination: "/blog/antecipacao-de-recebiveis-quando-vale-a-pena-para-o-seu-negocio",
        permanent: true,
      },
      {
        source: "/artigo-fluxo-de-caixa-como-evitar-surpresas.html",
        destination: "/blog/fluxo-de-caixa-como-evitar-surpresas-no-fim-do-mes",
        permanent: true,
      },
      {
        source: "/artigo-reforma-tributaria-o-que-muda-para-sua-empresa.html",
        destination: "/blog/reforma-tributaria-o-que-muda-para-sua-empresa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

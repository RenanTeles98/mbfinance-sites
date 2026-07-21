/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/admin',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },      {
        source: '/assets/js/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://googleads.g.doubleclick.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; frame-ancestors 'self'",
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
    ];
  },
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
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/pages/blog-admin.html",
        destination: "/admin",
        permanent: true,
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





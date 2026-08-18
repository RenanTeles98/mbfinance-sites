import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mb Finance | Hub de Produtos Financeiros para Empresas",
  description:
    "A Mb Finance conecta empresários às melhores condições financeiras do mercado. Capital de giro, antecipação de recebíveis, conta PJ e maquininha com tecnologia e inteligência artificial.",
  keywords:
    "capital de giro, antecipação de recebíveis, conta PJ, maquininha, crédito empresarial, hub financeiro, Mb Finance",
  openGraph: {
    title: "Mb Finance | Hub de Produtos Financeiros para Empresas",
    description:
      "Mais de 130.000 empresas já escolheram a Mb Finance. Acesse as melhores condições financeiras do mercado em um só lugar.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MDST4NTK');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MDST4NTK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}

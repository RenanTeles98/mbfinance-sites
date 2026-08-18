import type { Metadata } from "next";
import Script from "next/script";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { BLOG_BASE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_BASE_URL),
  title: {
    default: "Blog Mb Finance",
    template: "%s | Mb Finance",
  },
  description:
    "ConteÃºdos sobre crÃ©dito empresarial, conta PJ, antecipaÃ§Ã£o de recebÃ­veis e gestÃ£o financeira para empresas.",
  keywords:
    "capital de giro, antecipaÃ§Ã£o de recebÃ­veis, conta PJ, crÃ©dito empresarial, gestÃ£o financeira, Mb Finance",
  alternates: {
    canonical: BLOG_BASE_URL,
  },
  icons: {
    icon: "/images/logo-icon.png",
    shortcut: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  openGraph: {
    title: "Blog Mb Finance",
    description:
      "Artigos sobre crÃ©dito empresarial, liquidez, conta PJ e gestÃ£o financeira para empresas.",
    url: BLOG_BASE_URL,
    siteName: "Blog Mb Finance",
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
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MDST4NTK');`}
        </Script>
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MDST4NTK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}

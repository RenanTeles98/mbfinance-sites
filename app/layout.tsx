import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MB Finance | Hub de Produtos Financeiros para Empresas",
  description:
    "A MB Finance conecta empresários às melhores condições financeiras do mercado. Capital de giro, antecipação de recebíveis, conta PJ e maquininha com tecnologia e inteligência artificial.",
  keywords:
    "capital de giro, antecipação de recebíveis, conta PJ, maquininha, crédito empresarial, hub financeiro, MB Finance",
  openGraph: {
    title: "MB Finance | Hub de Produtos Financeiros para Empresas",
    description:
      "Mais de 130.000 empresas já escolheram a MB Finance. Acesse as melhores condições financeiras do mercado em um só lugar.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}

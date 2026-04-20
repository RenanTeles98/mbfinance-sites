"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_MSG } from "@/lib/constants";

/* ─── DATA ─────────────────────────────────────────────────── */

const timeline = [
  {
    year: "2013",
    title: "Fundação no Rio de Janeiro",
    description:
      "Mauro Barbosa e Fabiano Ribeiro fundam a MB Finance com o propósito de democratizar o acesso a produtos financeiros de qualidade para empresas de todos os portes no Brasil.",
    badge: "Fundação",
  },
  {
    year: "2014",
    title: "Soluções de Crédito Customizadas",
    description:
      "Introdução das primeiras soluções de crédito personalizadas para clientes PJ, ampliando o portfólio de produtos financeiros da MB Finance e fortalecendo o relacionamento com a carteira inicial.",
    badge: null,
  },
  {
    year: "2015",
    title: "Estruturação Financeira para Saúde",
    description:
      "Estruturação de soluções financeiras especializadas para o setor de saúde e reabertura da carteira do SUS, consolidando a MB Finance como referência em crédito para segmentos estratégicos.",
    badge: null,
  },
  {
    year: "2017",
    title: "Real Estate e Expansão da Estrutura",
    description:
      "Incorporação de produtos de Real Estate ao portfólio e significativa expansão da estrutura operacional, preparando a empresa para um novo ciclo de crescimento acelerado.",
    badge: null,
  },
  {
    year: "2020",
    title: "Parceria com Conexão C6",
    description:
      "Início da parceria estratégica com o Conexão C6, com foco na abertura de contas C6 Pay para MEIs em todo o Brasil. Um novo capítulo que abriria o caminho para o crescimento exponencial da MB Finance.",
    badge: null,
  },
  {
    year: "2021",
    title: "Consultoria Financeira e Consolidação no C6",
    description:
      "Foco intenso em consultoria financeira e consolidação da posição da MB Finance dentro do ecossistema Conexão C6, estruturando processos, governança e equipe para suportar o crescimento acelerado que viria a seguir.",
    badge: null,
    trophy: { src: "/images/premios/premio-2021.png", label: "AgRio 2021 - 1º Lugar" },
  },
  {
    year: "2022",
    title: "TOP 3 + Criação do Fomenta Mais",
    description:
      "No final do ano, a MB Finance estava entre os TOP 3 do projeto Conexão C6, superando a marca de 600 contas abertas por mês. Neste mesmo ano, criamos o Fomenta Mais — ampliando nossa capacidade de atender e fomentar o ecossistema de negócios parceiros.",
    badge: "TOP 3 · Fomenta Mais",
    trophy: { src: "/images/premios/premio-2022.png", label: "Destaque 2022 - Conexão C6" },
  },
  {
    year: "2023",
    title: "Melhor Parceiro Conexão C6",
    description:
      "Primeiros a superar 1.500 contas/mês, chegando a 2.500 em julho. Investimos em governança e processos. Conquistamos o título de Melhor Parceiro do Conexão C6 — com lucro 3× maior que os demais parceiros do canal.",
    badge: "Melhor Parceiro",
    trophy: { src: "/images/premios/premio-2023.png", label: "Awards 2023 - Melhor Escritório" },
  },
  {
    year: "2024",
    title: "Recorde Nacional 59.230 Contas PJ",
    description:
      "Estabelecemos o recorde nacional de abertura de contas PJ: 59.230 contas em um único ano. Premiados com o título de melhor escritório do Conexão C6, consolidando nossa liderança no projeto.",
    badge: "59.230 contas PJ",
    trophy: { src: "/images/premios/premio-2024.png", label: "Awards 2024 - Melhor Escritório" },
  },
  {
    year: "2025",
    title: "Novo Recorde 95.000 Contas PJ e R$ 100Mi com Mercado Pago",
    description:
      "Superamos o próprio recorde: 95.000 contas PJ abertas em um único ano e conquistamos novamente o prêmio de melhor escritório do Conexão C6. Em parceria com o Mercado Pago, atingimos a marca de R$ 100 milhões em movimentação em tempo recorde — consolidando a MB Finance como referência nacional em soluções financeiras para empresas.",
    badge: "95.000 contas PJ · R$ 100Mi · Mercado Pago",
  },
  {
    year: "2026",
    title: "Expansão do Portfólio de Produtos",
    description:
      "Iniciamos 2026 com o propósito de expandir nosso portfólio além do crédito. Lançamos soluções em Seguros e Consórcios, Soluções Tributárias e Telemedicina — consolidando a MB Finance como um Hub completo de soluções para empresas.",
    badge: "Seguros · Tributário · Telemedicina",
  },
];

/* ─── COUNTER ───────────────────────────────────────────────── */

/* ─── HORIZONTAL TIMELINE ───────────────────────────────────── */

function HorizontalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Move the strip from 0 to -(N-1) cards worth of width
  // Each card ~380px + 32px gap = 412px; 11 cards total; viewport ~1200px
  // Need to scroll: 11*412 - 1200 ≈ 3332px → use -110vw as rough value
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-110vw"]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "400vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-white">
        {/* Section label */}
        <div className="px-8 md:px-16 mb-10 flex-shrink-0">
          <p className="text-[#0099dd] text-xs font-bold tracking-widest uppercase mb-3">
            Nossa trajetória
          </p>
          <h2 className="text-[#001e2e] text-4xl md:text-5xl font-black leading-tight">
            Evolução e{" "}
            <span className="text-[#0099dd]">Excelência</span>
          </h2>
        </div>

        {/* Scrolling strip */}
        <motion.div className="flex gap-8 pl-8 md:pl-16" style={{ x }}>
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-shrink-0 w-[340px] md:w-[380px]"
            >
              {/* Year bubble */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-3 h-3 rounded-full bg-[#0099dd] ring-4 ring-[#0099dd]/15 flex-shrink-0" />
                <div className="h-px flex-1 bg-gradient-to-r from-[#0099dd]/40 to-transparent" />
              </div>

              <div className="bg-[#003956]/5 border border-[#003956]/10 rounded-2xl p-7 hover:bg-[#003956]/8 hover:border-[#0099dd]/40 transition-all duration-300 h-full">
                <span className="text-4xl font-black text-[#001e2e]/8 leading-none block mb-3">
                  {item.year}
                </span>
                <h3 className="text-[#001e2e] font-bold text-lg mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#001e2e]/70 text-sm leading-relaxed">
                  {item.description}
                </p>
                {item.badge && (
                  <span className="mt-4 inline-block bg-[#0099dd]/10 border border-[#0099dd]/25 text-[#0099dd] text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {item.badge}
                  </span>
                )}
                {item.trophy && (
                  <div className="mt-6 flex items-end gap-4">
                    <img
                      src={item.trophy.src}
                      alt={item.trophy.label}
                      className="w-20 h-auto drop-shadow-md"
                    />
                    <span className="text-[10px] font-bold text-[#001e2e]/40 uppercase tracking-widest leading-tight">
                      {item.trophy.label}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {/* End spacer */}
          <div className="flex-shrink-0 w-16" />
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16">
          <div className="h-px bg-[#001e2e]/10 rounded-full">
            <motion.div
              className="h-full bg-[#0099dd] rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */

export default function SobrePage() {
  return (
    <main className="bg-white overflow-x-hidden max-w-full">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #001e2e 0%, #003956 60%, #005080 100%)" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16 py-32 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#0099dd] text-xs font-bold tracking-widest uppercase mb-6">
              Sobre a MB Finance
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-light tracking-[-0.04em] leading-[1.02] mb-8 max-w-5xl">
              <span className="block">Conectamos empresas às</span>
              <span className="block text-[#0099dd] font-normal">melhores soluções financeiras</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-12 mt-12"
          >
            <div>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                A MB Finance tem como missão conectar empresas brasileiras às
                soluções financeiras mais adequadas para cada etapa da sua
                trajetória, com tecnologia, visão financeira e soluções inovadoras.
                Nossa evolução para um{" "}
                <strong className="text-white">Hub de Produtos Financeiros</strong>{" "}
                reflete o compromisso de oferecer ao mercado uma atuação mais
                ampla, consultiva e eficiente, reunindo em um só ecossistema
                diferentes alternativas de crédito, serviços bancários e
                soluções complementares.
              </p>
              <p className="text-white/60 text-base leading-relaxed">
                Dessa forma, proporcionamos às empresas mais autonomia na tomada
                de decisão, acesso a condições mais competitivas e um portfólio
                diversificado, que vai além das opções limitadas de uma única
                instituição financeira.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Fundação", value: "2013" },
                { label: "Sede", value: "Rio de Janeiro, RJ" },
                { label: "Parceiro principal", value: "+ 40 parceiros" },
                { label: "Foco", value: "Empresas de pequeno, médio e grande porte" },
                { label: "Clientes ativos", value: "+200.000 PJs", primary: true },
                { label: "Crédito transacionado", value: "R$ 1,5 bilhão", primary: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-white/10 pb-4"
                >
                  <span className="text-white/50 text-sm">{item.label}</span>
                  <span className={`font-semibold text-sm ${item.primary ? 'text-[#0099dd]' : 'text-white'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
        </div>
      </section>

      {/* ── HORIZONTAL TIMELINE ──────────────────────────────── */}
      <HorizontalTimeline />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #001e2e 0%, #003956 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
          }}
        />
        <div className="absolute top-0 right-0 h-[520px] w-[520px] bg-[#0099dd]/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] bg-white/5 blur-[120px]" />
        <div className="relative max-w-5xl mx-auto px-6 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#0099dd] text-[11px] font-bold tracking-[0.24em] uppercase mb-4">
              Vamos conversar
            </p>
            <h2 className="text-white text-4xl md:text-6xl font-black leading-[1.08] mb-8 max-w-4xl mx-auto">
              Pronto para descobrir como a MB Finance pode{" "}
              <span className="text-[#0099dd]">impulsionar sua empresa</span>?
            </h2>
            <p className="text-white/70 text-base md:text-xl mb-10 md:mb-14 max-w-2xl mx-auto font-light leading-relaxed">
              Fale com um consultor MB Finance e acesse soluções mais
              inteligentes, competitivas e aderentes ao momento do seu negócio.
            </p>
            <Link
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-[#0099dd] hover:bg-[#0077b6] text-white font-bold text-base px-12 py-5 rounded-2xl transition-all duration-500 hover:scale-105 shadow-[0_14px_40px_rgba(0,153,221,0.28)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Quero uma proposta
            </Link>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-10 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0099dd]" />
                Sem custo de analise
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0099dd]" />
                Resposta em ate 2h
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0099dd]" />
                Formalizacao digital
              </span>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

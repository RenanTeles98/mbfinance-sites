"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CreditCard, Building2, TrendingUp, Clock, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999";

const products = [
  {
    icon: Building2,
    title: "Conta PJ",
    tag: "Zero tarifas",
    description: "Conta empresarial completa com Pix ilimitado, cartão e gestão financeira integrada — sem taxas ocultas.",
    features: ["Pix ilimitado", "Cartão empresarial", "Internet Banking 24/7", "Sem taxa de manutenção"],
    msg: "Olá! Tenho interesse em abrir uma Conta PJ na MB Finance.",
    accent: "#0099dd",
  },
  {
    icon: CreditCard,
    title: "Máquina de Cartão",
    tag: "Melhores taxas",
    description: "Aceite todas as bandeiras com as menores taxas. Receba suas vendas com antecipação e sem surpresas.",
    features: ["Todas as bandeiras", "Recebimento em D+1", "App de gestão", "Suporte 24h"],
    msg: "Olá! Quero conhecer as taxas da Máquina de Cartão da MB Finance.",
    accent: "#3b82f6",
  },
  {
    icon: TrendingUp,
    title: "Capital de Giro",
    tag: "Aprovação em 24h",
    description: "Crédito para impulsionar seu negócio. Nossa IA encontra a melhor oferta entre todos os nossos parceiros.",
    features: ["A partir de 1,2% a.m.", "Aprovação em 24h", "Parcelas flexíveis", "Sem garantia real"],
    msg: "Olá! Preciso de Capital de Giro para minha empresa.",
    accent: "#10b981",
  },
  {
    icon: Clock,
    title: "Antecipação de Recebíveis",
    tag: "Liquidez imediata",
    description: "Transforme vendas a prazo em dinheiro imediato. Antecipe recebíveis de cartão, duplicatas e NFs.",
    features: ["Antecipação de cartões", "Antecipação de duplicatas", "Dinheiro em conta hoje", "100% digital"],
    msg: "Olá! Quero antecipar meus recebíveis. Quais as condições?",
    accent: "#8b5cf6",
  },
];

export default function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="produtos" className="py-14 md:py-28 relative" style={{ background: "#f8fafc" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.2), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase mb-3">
            Produtos
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight max-w-lg">
              Tudo que sua empresa precisa,{" "}
              <span className="text-brand-secondary">em um só lugar</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Produtos financeiros com as melhores condições do mercado, negociados especialmente para o seu negócio.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const Icon = product.icon;
            const msg = encodeURIComponent(product.msg);
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-secondary/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${product.accent}66, transparent)` }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${product.accent}18`, border: `1px solid ${product.accent}30` }}
                >
                  <Icon size={18} style={{ color: product.accent }} />
                </div>

                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-3 w-fit"
                  style={{ background: `${product.accent}15`, color: product.accent }}
                >
                  {product.tag}
                </span>

                <h3 className="text-base font-black text-brand-primary mb-2">{product.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-5 flex-1">{product.description}</p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold transition-colors group/link"
                  style={{ color: product.accent }}
                >
                  Saber mais
                  <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

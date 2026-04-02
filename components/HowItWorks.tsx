"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Search, FileCheck, Handshake } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site da MB Finance e quero dar o primeiro passo para melhorar as condições financeiras da minha empresa."
);

const steps = [
  { icon: MessageCircle, num: "01", title: "Fale com um especialista", desc: "Entre em contato via WhatsApp. Sem compromisso, sem burocracia, sem custo." },
  { icon: Search, num: "02", title: "Análise inteligente", desc: "Nossa IA analisa o perfil da sua empresa e mapeia as melhores oportunidades entre todos os parceiros." },
  { icon: FileCheck, num: "03", title: "Receba as propostas", desc: "Você recebe propostas personalizadas com as melhores taxas disponíveis no mercado para o seu caso." },
  { icon: Handshake, num: "04", title: "Contratação e acompanhamento", desc: "Escolha a melhor opção, finalize de forma digital e conte com nosso time de forma contínua." },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="como-funciona" className="py-14 md:py-28 relative" style={{ background: "#f8fafc" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.2), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase mb-3">Como funciona</p>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight">
            Do contato ao crédito em{" "}
            <span className="text-brand-secondary">4 passos</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-secondary/30 transition-all duration-300"
              >
                {/* Number */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-light border border-brand-secondary/20 flex items-center justify-center">
                    <Icon size={18} className="text-brand-secondary" />
                  </div>
                  <span className="text-gray-100 font-black text-3xl">{step.num}</span>
                </div>
                <h3 className="font-black text-brand-primary text-sm mb-2">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-brand-primary text-white font-bold w-full sm:w-auto px-8 py-4 rounded-lg text-sm transition-all duration-200 hover:bg-brand-secondary hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MessageCircle size={16} />
            Começar agora — é gratuito
          </a>
        </motion.div>
      </div>
    </section>
  );
}

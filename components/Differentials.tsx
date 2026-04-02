"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Network, Shield, Zap, Users, BarChart3 } from "lucide-react";

const items = [
  { icon: Brain, title: "Inteligência Artificial", desc: "Nossa IA analisa +200 variáveis do seu perfil empresarial para encontrar a melhor oferta entre todos os parceiros em segundos.", featured: true },
  { icon: Network, title: "Hub de Parceiros", desc: "Acesso a múltiplas instituições financeiras parceiras, garantindo sempre as melhores condições disponíveis no mercado.", featured: false },
  { icon: Shield, title: "Segurança Total", desc: "Todos os processos seguem as regulamentações do Banco Central e melhores práticas de segurança da informação.", featured: false },
  { icon: Zap, title: "100% Digital", desc: "Da análise à aprovação, tudo acontece digitalmente. Sem visitas ao banco, sem papelada, sem perda de tempo.", featured: false },
  { icon: Users, title: "Especialista Dedicado", desc: "Cada cliente tem um especialista financeiro para orientar, negociar e garantir as melhores condições.", featured: false },
  { icon: BarChart3, title: "Inteligência de Dados", desc: "Dados e análises avançadas para monitorar o mercado e sempre oferecer as condições mais competitivas.", featured: false },
];

export default function Differentials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="diferenciais" className="py-14 md:py-28 bg-white relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.2), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase mb-3">Diferenciais</p>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight">
            Tecnologia e IA trabalhando{" "}
            <span className="text-brand-secondary">pelo seu negócio</span>
          </h2>
          <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto">
            Desde 2013 investimos em tecnologia para simplificar o acesso a produtos financeiros.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`relative rounded-2xl p-6 border transition-all duration-300 overflow-hidden group ${
                  item.featured
                    ? "border-brand-secondary/25 bg-brand-light lg:col-span-1"
                    : "border-gray-100 bg-gray-50 hover:border-brand-secondary/20 hover:shadow-md"
                }`}
              >
                {item.featured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.4), transparent)" }}
                  />
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  item.featured ? "bg-brand-secondary/20" : "bg-brand-light"
                }`}>
                  <Icon size={18} className="text-brand-secondary" />
                </div>
                {item.featured && (
                  <span className="inline-block text-xs font-semibold bg-brand-secondary/15 text-brand-secondary px-2.5 py-1 rounded-md mb-3">
                    Principal diferencial
                  </span>
                )}
                <h3 className="font-black text-brand-primary text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

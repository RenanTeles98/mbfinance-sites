"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const pains = [
  "Taxas altas impostas pelo seu banco atual",
  "Crédito negado sem explicação",
  "Processos lentos e burocráticos",
  "Sem opções para comparar condições",
  "Atendimento genérico e impessoal",
];

const solutions = [
  "Acesso às melhores taxas de múltiplos parceiros",
  "IA que maximiza suas chances de aprovação",
  "Processo 100% digital, aprovação em até 24h",
  "Comparativo automático entre instituições",
  "Especialista dedicado ao seu negócio",
];

export default function PainSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-14 md:py-28 bg-white relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase mb-4">
            O problema que resolvemos
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight">
            Empresários limitados a{" "}
            <span className="text-red-400">um único banco</span>
            <br className="hidden sm:block" />
            {" "}perdem dinheiro todo mês
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Sem MB Finance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <X size={16} className="text-red-400" />
              </div>
              <span className="text-gray-500 font-semibold text-sm">Sem a MB Finance</span>
            </div>
            <ul className="space-y-4">
              {pains.map((pain) => (
                <li key={pain} className="flex items-start gap-3">
                  <X size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500 text-sm leading-relaxed">{pain}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Com MB Finance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-brand-secondary/20 bg-brand-light p-8 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: "radial-gradient(circle at 100% 0%, rgba(0,153,221,0.10) 0%, transparent 70%)" }}
            />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                <Check size={16} className="text-brand-secondary" />
              </div>
              <span className="text-brand-primary font-semibold text-sm">Com a MB Finance</span>
            </div>
            <ul className="space-y-4">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={14} className="text-brand-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-brand-primary/80 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

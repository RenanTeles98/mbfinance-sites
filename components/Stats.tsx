"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 130000, suffix: "+", prefix: "", label: "Empresas atendidas", sub: "De MEI a médias empresas" },
  { value: 13, suffix: " anos", prefix: "", label: "No mercado", sub: "Fundada em 2013" },
  { value: 98, suffix: "%", prefix: "", label: "Satisfação", sub: "Índice de aprovação" },
  { value: 24, suffix: "h", prefix: "", label: "Aprovação média", sub: "Processo 100% digital" },
];

function Counter({ value, prefix, suffix, active }: { value: number; prefix: string; suffix: string; active: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let count = 0;
    const timer = setInterval(() => {
      count += increment;
      if (count >= value) { setCurrent(value); clearInterval(timer); }
      else setCurrent(Math.floor(count));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, value]);

  const display = value >= 1000 ? current.toLocaleString("pt-BR") : current.toString();
  return <>{prefix}{display}{suffix}</>;
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="sobre"
      className="py-14 md:py-24 relative"
      style={{ background: "linear-gradient(135deg, #003956 0%, #005a8a 100%)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase mb-3">
            Nossos números
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Mais de uma década construindo{" "}
            <span className="text-brand-secondary">confiança</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} active={isInView} />
              </div>
              <div className="text-brand-secondary font-bold text-sm mb-1">{stat.label}</div>
              <div className="text-white/60 text-xs">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

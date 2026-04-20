"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

import { WHATSAPP_NUMBER, WHATSAPP_MSG } from "@/lib/constants";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-16 md:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #002840 0%, #003956 50%, #005a8a 100%)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,153,221,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-5">
            Pronto para começar?
          </p>

          <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Seu negócio merece as
            <br className="hidden sm:block" />
            {" "}<span
              style={{
                background: "linear-gradient(90deg, #0099dd 0%, #66ccff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              melhores condições.
            </span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Fale agora com um especialista e descubra quanto você está deixando de ganhar com o banco atual.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 bg-brand-secondary text-white font-bold w-full sm:w-auto px-8 py-4 rounded-lg text-base transition-all duration-200 hover:bg-white hover:text-brand-primary hover:-translate-y-0.5 hover:shadow-xl"
            >
              <MessageCircle size={18} />
              Falar com um especialista agora
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
            <span>Sem taxa de análise</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Sem compromisso</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Resposta em até 2h</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Seg–Sáb 8h–18h</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

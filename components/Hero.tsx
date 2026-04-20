"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackgroundNodes } from "@/components/BackgroundNodes";

import { WHATSAPP_NUMBER, WHATSAPP_MSG } from "@/lib/constants";

export default function Hero() {
  return (
    <>
      {/* ── Keyframes injetados via <style> ── */}
      <style>{`
        @keyframes aurora-drift {
          0%   { transform: translate(0%,  0%)  scale(1);    }
          25%  { transform: translate(4%, -3%)  scale(1.04); }
          50%  { transform: translate(-3%, 5%)  scale(0.97); }
          75%  { transform: translate(6%,  2%)  scale(1.06); }
          100% { transform: translate(-5%,-4%)  scale(1.02); }
        }
        @keyframes aurora-drift-reverse {
          0%   { transform: translate(0%,  0%)  scale(1.02); }
          30%  { transform: translate(-5%, 4%)  scale(0.96); }
          60%  { transform: translate(4%, -5%)  scale(1.05); }
          100% { transform: translate(3%,  3%)  scale(0.99); }
        }
        @keyframes text-shimmer {
          0%   { background-position:  200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%      { opacity: 0.5; transform: scale(0.75); }
        }
        .aurora-layer-1 {
          animation: aurora-drift 14s ease-in-out infinite alternate;
        }
        .aurora-layer-2 {
          animation: aurora-drift-reverse 18s ease-in-out infinite alternate;
          mix-blend-mode: screen;
        }
        .hero-title-line2 {
          background: linear-gradient(90deg, #1E90FF 0%, #00c8ff 45%, #1E90FF 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 4s 1s linear infinite;
        }
        .pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
        .hero-cta-btn {
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #1E90FF;
        }
        .hero-cta-btn:hover {
          background: #3aa0ff !important;
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(30,144,255,0.7), 0 12px 40px rgba(30,144,255,0.45), inset 0 1px 0 rgba(255,255,255,0.25) !important;
        }
        .hero-cta-btn:hover .cta-arrow {
          transform: translateX(4px);
        }
        .cta-arrow {
          transition: transform 0.2s ease;
        }
        /* Mobile: permite quebra de linha e ajustes de layout */
        @media (max-width: 768px) {
          .hero-title-line1 { white-space: normal !important; font-size: clamp(1.5rem, 6.5vw, 2.2rem) !important; }
          .hero-title-line2 { white-space: normal !important; font-size: clamp(1.1rem, 4.8vw, 1.7rem) !important; }
          .hero-cta-wrapper { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta-btn, .hero-cta-secondary { width: 100% !important; justify-content: center !important; text-align: center !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-layer-1, .aurora-layer-2, .hero-title-line2, .pulse-dot { animation: none; }
        }
      `}</style>

      <section
        id="inicio"
        aria-label="Hero MB Finance"
        style={{ position: "relative", width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#040f1a" }}
      >
        {/* ── Blob de luz 1 (aurora principal) ── */}
        <div
          aria-hidden="true"
          className="aurora-layer-1"
          style={{
            position: "absolute",
            inset: "-60%",
            background: `
              radial-gradient(ellipse 55% 45% at 15% 20%, rgba(30,144,255,0.55) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 85% 80%, rgba(0,200,255,0.45) 0%, transparent 65%),
              radial-gradient(ellipse 70% 60% at 50% 50%, rgba(10,80,128,0.6)  0%, transparent 70%)
            `,
          }}
        />

        {/* ── Blob de luz 2 (aurora secundária, fase oposta) ── */}
        <div
          aria-hidden="true"
          className="aurora-layer-2"
          style={{
            position: "absolute",
            inset: "-60%",
            background: `
              radial-gradient(ellipse 50% 55% at 10% 85%, rgba(0,200,255,0.4)   0%, transparent 65%),
              radial-gradient(ellipse 65% 45% at 90% 10%, rgba(30,144,255,0.35) 0%, transparent 68%),
              radial-gradient(ellipse 40% 40% at 60% 40%, rgba(13,45,78,0.5)    0%, transparent 60%)
            `,
          }}
        />

        {/* ── Grain / textura ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Vignette ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(4,15,26,0.75) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── Scanlines ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── Background Nodes (Tech Connected Particles) ── */}
        <BackgroundNodes />

        {/* ── Conteúdo ── */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>

          {/* Eyebrow */}
          {/* Eyebrow Removido */}


          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ margin: 0 }}
          >
            <span
              className="hero-title-line1"
              style={{
                display: "block",
                fontSize: "clamp(1.6rem, 3.2vw, 3.6rem)",
                fontWeight: 900,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                lineHeight: 1.05,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ 
                color: "#ffffff",
                filter: "drop-shadow(0 0 20px rgba(30,144,255,0.3))"
              }}>
                Hub de Soluções Financeiras
              </span>
            </span>
            <span
              className="hero-title-line2"
              style={{
                display: "block",
                fontSize: "clamp(1.1rem, 2.4vw, 2.7rem)",
                fontWeight: 900,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                lineHeight: 1.1,
                marginTop: "0.2em",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ 
                background: "linear-gradient(90deg, #1E90FF 0%, #00c8ff 45%, #1E90FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 15px rgba(30,144,255,0.2))"
              }}>
                Para Empresas que Querem Crescer
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              marginTop: "1.5rem",
              fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "750px",
              marginInline: "auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Conectamos sua empresa a diversos produtos financeiros em um único lugar, com as melhores condições entre os nossos parceiros.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hero-cta-wrapper"
            style={{ marginTop: "2.75rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.55rem",
                padding: "1.1rem 2.25rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#1E90FF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Falar com Especialista
              <ArrowRight size={16} className="cta-arrow" />
            </a>

            <a
              href="#produtos"
              className="hero-cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.55rem",
                padding: "1.1rem 2.25rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Conhecer Nossos Produtos
            </a>
          </motion.div>

          {/* Parceiros Removidos */}

        </div>

      </section>
    </>
  );
}

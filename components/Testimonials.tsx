"use client";

import { motion } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  { name: "Carlos Mendes", role: "CEO — Distribuidora Mendes", text: "Estava pagando taxas absurdas no meu banco há anos. A MB Finance encontrou uma taxa 40% menor em menos de 24 horas.", initials: "CM" },
  { name: "Fernanda Oliveira", role: "Proprietária — Clínica Estética Bella", text: "Precisava de capital de giro urgente para expandir. Processo 100% digital, recebi a aprovação no dia seguinte. Incrível!", initials: "FO" },
  { name: "Ricardo Souza", role: "Sócio — Transportadora RS", text: "A antecipação de recebíveis resolveu meu problema de fluxo de caixa. Processo simples, rápido e com as melhores taxas.", initials: "RS" },
  { name: "Juliana Costa", role: "Diretora — JC Serviços", text: "Já indiquei para mais de 10 empresários. O atendimento personalizado e a tecnologia fazem toda a diferença.", initials: "JC" },
  { name: "Marcelo Lima", role: "Fundador — ML Tech", text: "Abri minha Conta PJ e contratei o capital de giro no mesmo dia. Tudo digital, sem burocracia. A melhor parceria financeira.", initials: "ML" },
  { name: "Patrícia Barros", role: "MEI — Studio PB", text: "Como MEI, sempre tive dificuldade em conseguir crédito. A MB Finance entendeu meu negócio e conseguiu condições que eu jamais teria sozinha.", initials: "PB" },
];

export default function Testimonials() {
  const firstCol = testimonials.slice(0, 2);
  const secondCol = testimonials.slice(2, 4);
  const thirdCol = testimonials.slice(4, 6);

  return (
    <section id="depoimentos" className="py-14 md:py-28 bg-white relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,153,221,0.2), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="border border-brand-secondary/20 py-1 px-4 rounded-full bg-brand-secondary/5 text-brand-secondary text-xs font-semibold tracking-widest uppercase">
              Depoimentos
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight">
            +130.000 empresários{" "}
            <span className="text-brand-secondary">confiam na MB Finance</span>
          </h2>
          <p className="max-w-xl mx-auto mt-6 text-gray-500 font-medium">
            Veja o que os nossos clientes dizem sobre as soluções financeiras que transformam o dia a dia dos seus negócios.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[480px] md:max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstCol} duration={15} />
          <TestimonialsColumn testimonials={secondCol} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdCol} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}

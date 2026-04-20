import { MessageCircle, Mail, MapPin } from "lucide-react";

function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

import { WHATSAPP_NUMBER, WHATSAPP_MSG } from "@/lib/constants";

const products = [
  { label: "Conta PJ", href: "#produtos" },
  { label: "Máquina de Cartão", href: "#produtos" },
  { label: "Capital de Giro", href: "#produtos" },
  { label: "Antecipação de Recebíveis", href: "#produtos" },
];

const company = [
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Trabalhe Conosco", href: "https://mbfinance.inhire.app/vagas" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#04080d" }} className="text-white border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-xl font-black mb-4">
              <span className="text-white">mb</span>
              <span className="text-brand-secondary">finance.</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Hub de produtos financeiros para empresas. Conectamos seu negócio às melhores condições do mercado desde 2013.
            </p>
            <div className="flex gap-2">
              {[
                { label: "Instagram", Icon: IconInstagram },
                { label: "LinkedIn", Icon: IconLinkedin },
                { label: "Facebook", Icon: IconFacebook },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 bg-white/[0.05] hover:bg-brand-secondary/20 hover:text-brand-secondary border border-white/[0.06] rounded-lg flex items-center justify-center transition-all duration-200 text-white/40"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-xs text-white/40 uppercase tracking-widest mb-4">Produtos</h3>
            <ul className="space-y-2.5">
              {products.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-xs text-white/40 uppercase tracking-widest mb-4">Empresa</h3>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xs text-white/40 uppercase tracking-widest mb-4">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <MessageCircle size={14} className="flex-shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:contato@mbfinance.com.br" className="flex items-center gap-2.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <Mail size={14} className="flex-shrink-0" />
                  contato@mbfinance.com.br
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                São Paulo, SP — Brasil
              </li>
            </ul>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-brand-secondary/10 hover:bg-brand-secondary text-brand-secondary hover:text-white border border-brand-secondary/25 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              <MessageCircle size={13} />
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} MB Finance. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 hover:text-white/40 text-xs transition-colors">Política de Privacidade</a>
            <a href="#" className="text-white/20 hover:text-white/40 text-xs transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

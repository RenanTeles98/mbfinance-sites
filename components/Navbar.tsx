"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { WHATSAPP_NUMBER, WHATSAPP_MSG } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "INÍCIO", href: "#inicio" },
    { 
      label: "NOSSOS PRODUTOS", 
      href: "#produtos",
      hasDropdown: true,
      dropdownType: 'products'
    },
    { 
      label: "SOBRE", 
      href: "#sobre",
      hasDropdown: true,
      dropdownType: 'simple',
      items: ["Quem Somos", "Nossa História", "Segurança"]
    },
    { 
      label: "PARCEIROS", 
      href: "#parceiros",
      hasDropdown: true,
      dropdownType: 'simple',
      items: ["Seja um Parceiro", "Portal do Parceiro"]
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-4" : "bg-white/90 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#inicio" className="flex items-center group">
            <span className="text-2xl font-black tracking-tight flex items-center">
              <span className="text-brand-primary">mb</span>
              <span className="text-brand-secondary">finance</span>
              <span className="text-brand-secondary">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative group py-2"
                onMouseEnter={() => item.hasDropdown && setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a 
                  href={item.href}
                  className={`flex items-center gap-1 text-[13px] font-extrabold tracking-wider transition-colors ${
                    activeMenu === item.label || item.label === "NOSSOS PRODUTOS" 
                      ? "text-brand-secondary" 
                      : "text-brand-primary"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === item.label ? 'rotate-180' : ''}`} />}
                </a>

                {/* Mega Menu / Dropdown */}
                <AnimatePresence>
                  {activeMenu === item.label && item.hasDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2"
                    >
                      {item.dropdownType === 'products' ? (
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex w-[650px] min-h-[380px]">
                          {/* Left Side: Links */}
                          <div className="w-1/2 p-8 border-r border-gray-50">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">SERVIÇOS BANCÁRIOS</h4>
                            <ul className="space-y-4">
                              {["Conta PJ", "Capital de Giro", "Adquirência", "Antecipação de Recebíveis", "Seguros", "Consórcios"].map(sub => (
                                <li key={sub}>
                                  <a href="#produtos" className="text-[14px] font-semibold text-gray-600 hover:text-brand-secondary transition-colors block">
                                    {sub}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Right Side: Featured */}
                          <div className="w-1/2 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center">
                            <div className="mb-4">
                              <span className="text-2xl font-black text-brand-primary italic">fomenta<span className="text-brand-secondary">+</span></span>
                              <div className="text-xl font-black text-brand-primary -mt-2">mais</div>
                            </div>
                            <h5 className="text-[11px] font-black text-brand-secondary uppercase tracking-widest mb-3">PLATAFORMA MULTIBANCO</h5>
                            <p className="text-xs text-gray-500 leading-relaxed mb-6 px-4">
                              Conectamos você a diversas linhas de crédito em um único lugar, com as melhores condições.
                            </p>
                            <a href="#" className="bg-brand-secondary text-white text-[13px] font-bold px-6 py-3 rounded-lg hover:bg-[#0088cc] transition-all shadow-lg shadow-brand-secondary/20 whitespace-nowrap">
                              Acessar Plataforma
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-4 w-56">
                          {item.items?.map(sub => (
                            <a key={sub} href="#" className="block px-6 py-3 text-sm font-semibold text-gray-600 hover:text-brand-secondary hover:bg-gray-50 transition-colors">
                              {sub}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-brand-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-[60] lg:hidden p-6 pt-24"
          >
            <div className="space-y-6">
              {navItems.map(item => (
                <div key={item.label} className="border-b border-gray-50 pb-4">
                  <a href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-xl font-black text-brand-primary block mb-2">{item.label}</a>
                  {item.items && (
                    <div className="pl-4 space-y-2 mt-2">
                       {item.items.map(sub => (
                         <a key={sub} href="#" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 text-sm block">{sub}</a>
                       ))}
                    </div>
                  )}
                </div>
              ))}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} className="block w-full bg-brand-secondary text-white font-bold py-4 rounded-xl text-center text-lg">
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

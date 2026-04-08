const fs = require('fs');

let html = fs.readFileSync('mb-finance-completo.html', 'utf8');

// The following sections need to be reverted:
// - Parceiros
html = html.replace(/<section id="parceiros" class="py-32 bg-\[#040f1a\] relative overflow-hidden">/g, '<section id="parceiros" class="py-32 bg-slate-50 relative overflow-hidden">');
html = html.replace(/<span class="text-white font-light text-\[11px\] uppercase tracking-\[4px\] mb-4 block">Parceiros<\/span>/g, '<span class="text-brand-secondary font-light text-[11px] uppercase tracking-[4px] mb-4 block">Parceiros</span>');
html = html.replace(/<h2 class="text-4xl sm:text-6xl font-sans font-light text-white tracking-tight mb-8">/g, '<h2 class="text-4xl sm:text-6xl font-sans font-light text-brand-primary tracking-tight mb-8">');
html = html.replace(/Os Bancos Certos para <span class="text-white">o Seu Negócio<\/span>/g, 'Os Bancos Certos para <span class="text-brand-secondary">o Seu Negócio</span>');

// - Convite Final (CTA) - "O próximo passo"
html = html.replace(/<section class="relative overflow-hidden bg-\[#040f1a\]" style="padding-top:64px; padding-bottom:160px;">/g, '<section class="relative overflow-hidden bg-white" style="padding-top:64px; padding-bottom:160px;">');
html = html.replace(/<span class="text-white font-light text-\[11px\] uppercase tracking-\[4px\] mb-4 block">O Próximo Passo<\/span>/g, '<span class="text-brand-secondary font-light text-[11px] uppercase tracking-[4px] mb-4 block">O Próximo Passo</span>');
html = html.replace(/<h2 class="text-3xl sm:text-5xl lg:text-7xl font-sans font-light text-white mb-8 sm:mb-10 leading-\[1\.1\]">/g, '<h2 class="text-3xl sm:text-5xl lg:text-7xl font-sans font-light text-brand-primary mb-8 sm:mb-10 leading-[1.1]">');
html = html.replace(/ajudar sua empresa<\/span>/g, 'ajudar sua empresa</span>');
html = html.replace(/<span class="text-white">ajudar sua empresa/g, '<span class="text-brand-secondary">ajudar sua empresa');
html = html.replace(/<p class="text-white\/40 text-lg sm:text-2xl font-light mb-12 sm:mb-16 leading-relaxed">/g, '<p class="text-slate-400 text-lg sm:text-2xl font-light mb-12 sm:mb-16 leading-relaxed">');
html = html.replace(/<form action="#" class="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 relative z-10 hidden">/g, '<form action="#" class="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 relative z-10 hidden">');
html = html.replace(/<button class="bg-brand-secondary text-white font-light px-10 py-5 rounded-2xl hover:bg-slate-50 hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl cursor-pointer" onclick="openLeadModal\('https:\/\/wa.me\/552139008295'\)">/g, '<button class="bg-brand-secondary text-white font-light px-10 py-5 rounded-2xl hover:bg-[#003956] hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl cursor-pointer" onclick="openLeadModal(\'https://wa.me/552139008295\')">');

// - FAQ and Inteligência
html = html.replace(/<section id="faq" class="py-32 bg-\[#040f1a\] relative" style="display:none;">/g, '<section id="faq" class="py-32 bg-slate-50 relative" style="display:none;">');
html = html.replace(/FAQ & Inteligência<\/span>/g, 'FAQ & Inteligência</span>');
html = html.replace(/<span class="text-white font-light text-\[11px\] uppercase tracking-\[4px\] mb-4 block">FAQ & Inteligência<\/span>/g, '<span class="text-brand-secondary font-light text-[11px] uppercase tracking-[4px] mb-4 block">FAQ & Inteligência</span>');
html = html.replace(/Perguntas <span class="text-white">estratégicas<\/span>/g, 'Perguntas <span class="text-brand-secondary">estratégicas</span>');
html = html.replace(/span class="text-lg font-light text-white group-hover:text-white/g, 'span class="text-lg font-light text-brand-primary group-hover:text-brand-secondary');

// Fix FAQ rounded button
html = html.replace(/bg-\[#040f1a\] border border-gray-100 flex items-center justify-center text-slate-400 group-hover:text-white/g, 'bg-white border border-gray-200 flex items-center justify-center text-brand-primary group-hover:text-white group-hover:bg-brand-secondary');
html = html.replace(/bg-\[#040f1a\] border border-white\/5/g, 'bg-white border border-gray-100');
html = html.replace(/text-2xl font-light text-white/g, 'text-2xl font-light text-brand-primary');


// Depoimentos (just in case they display it eventually)
html = html.replace(/<section id="depoimentos" class="py-32 bg-\[#040f1a\] relative overflow-hidden" style="display:none;">/g, '<section id="depoimentos" class="py-32 bg-slate-50 relative overflow-hidden" style="display:none;">');

// Save back
fs.writeFileSync('mb-finance-completo.html', html);
console.log("Reverted Parceiros, FAQ, Convite Final.");

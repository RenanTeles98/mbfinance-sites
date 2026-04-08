const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\Users\\MB NEGOCIOS\\Mb finance- Sites\\mb-finance-completo.html';
const content = fs.readFileSync(targetFile, 'utf8');

const newSectionHtml = `
    <!-- ── Como Funciona (Animated Timeline) ── -->
    <section id="como-funciona" class="py-32 relative bg-[#040f1a] overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-[#040f1a] via-[#040f1a]/95 to-[#040f1a] z-10"></div>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="City Background" class="w-full h-full object-cover opacity-[0.15] filter mix-blend-overlay">
        </div>

        <div class="max-w-7xl mx-auto px-6 sm:px-12 relative z-20">
            <div class="text-center mb-20">
                <span class="text-brand-secondary font-black text-[11px] uppercase tracking-[4px] mb-4 block">Como Funciona</span>
                <h2 class="text-4xl sm:text-5xl font-serif font-black text-white leading-tight tracking-tight mb-4">
                    Processo simples e rápido
                </h2>
                <div class="mt-4 flex items-center justify-center gap-2 mb-6">
                    <div class="w-12 h-[1px] bg-brand-secondary/40"></div>
                    <span class="text-[10px] uppercase tracking-[4px] text-gray-400 font-bold">100% Digital e Seguro</span>
                    <div class="w-12 h-[1px] bg-brand-secondary/40"></div>
                </div>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">Da análise à aprovação, cuidamos de tudo para você.</p>
            </div>

            <!-- Animated Stepper Container -->
            <div class="relative max-w-5xl mx-auto mt-24">
                
                <!-- Timeline Line (Background) -->
                <div class="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2"></div>
                
                <!-- Animated Progress Line -->
                <div id="timeline-progress" class="absolute left-[39px] md:left-1/2 top-0 w-[2px] bg-brand-secondary md:-translate-x-1/2 transition-all duration-1000 ease-out h-0 shadow-[0_0_10px_rgba(0,153,221,0.6)]"></div>

                <div class="space-y-16 relative">
                    
                    <!-- Step 1 -->
                    <div class="timeline-step opacity-0 translate-y-8 transition-all duration-700 ease-out relative flex flex-col md:flex-row justify-between items-center w-full" data-step="1">
                        <div class="hidden md:block w-5/12 text-right pr-12">
                            <h3 class="text-2xl font-bold text-white mb-2">Entendemos sua Necessidade</h3>
                            <p class="text-gray-400 text-sm leading-relaxed">Analisamos seu perfil e mapeamos as melhores soluções para seu negócio.</p>
                        </div>
                        <!-- Indicator -->
                        <div class="absolute left-[40px] md:left-1/2 w-8 h-8 rounded-full bg-[#040f1a] border-2 border-brand-secondary flex items-center justify-center transform -translate-x-1/2 md:translate-x-[-50%] z-10 shadow-[0_0_15px_rgba(0,153,221,0.5)] transition-transform duration-300 hover:scale-110 step-circle">
                            <div class="w-3 h-3 bg-brand-secondary rounded-full animate-pulse step-dot"></div>
                        </div>
                        <!-- Mobile Text / Asset -->
                        <div class="w-full md:w-5/12 pl-24 md:pl-12 text-left mt-0">
                            <div class="md:hidden">
                                <h3 class="text-xl font-bold text-white mb-2">Entendemos sua Necessidade</h3>
                                <p class="text-gray-400 text-sm leading-relaxed mb-4">Analisamos seu perfil e mapeamos as melhores soluções para seu negócio.</p>
                            </div>
                            <div class="flex p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/10 transition-colors duration-300">
                                <svg class="w-12 h-12 text-brand-secondary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="timeline-step opacity-0 translate-y-8 transition-all duration-700 ease-out relative flex flex-col md:flex-row justify-between items-center w-full" data-step="2" style="transition-delay: 100ms;">
                        <div class="w-full md:w-5/12 pl-24 md:pr-12 md:pl-0 text-left md:text-right mt-0 md:order-1">
                            <h3 class="text-xl md:text-2xl font-bold text-white mb-2">Buscamos as Melhores Taxas</h3>
                            <p class="text-gray-400 text-sm leading-relaxed mb-4 md:mb-0">Consultamos 40+ parceiros para encontrar as condições ideais.</p>
                        </div>
                        <!-- Indicator -->
                        <div class="absolute left-[40px] md:left-1/2 w-8 h-8 rounded-full bg-[#040f1a] border-2 border-white/20 flex items-center justify-center transform -translate-x-1/2 md:translate-x-[-50%] z-10 step-circle transition-all duration-500">
                            <div class="w-3 h-3 bg-white/20 rounded-full step-dot transition-all duration-500"></div>
                        </div>
                        <!-- Asset -->
                        <div class="flex w-full md:w-5/12 pl-24 md:pl-12 text-left md:order-2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/10 transition-colors duration-300">
                            <svg class="w-12 h-12 text-brand-secondary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="timeline-step opacity-0 translate-y-8 transition-all duration-700 ease-out relative flex flex-col md:flex-row justify-between items-center w-full" data-step="3" style="transition-delay: 100ms;">
                        <div class="hidden md:block w-5/12 text-right pr-12">
                            <h3 class="text-2xl font-bold text-white mb-2">Você Escolhe a Proposta</h3>
                            <p class="text-gray-400 text-sm leading-relaxed">Apresentamos opções comparadas para você decidir com segurança.</p>
                        </div>
                        <!-- Indicator -->
                        <div class="absolute left-[40px] md:left-1/2 w-8 h-8 rounded-full bg-[#040f1a] border-2 border-white/20 flex items-center justify-center transform -translate-x-1/2 md:translate-x-[-50%] z-10 step-circle transition-all duration-500">
                            <div class="w-3 h-3 bg-white/20 rounded-full step-dot transition-all duration-500"></div>
                        </div>
                        <!-- Mobile Text / Asset -->
                        <div class="w-full md:w-5/12 pl-24 md:pl-12 text-left mt-0">
                            <div class="md:hidden">
                                <h3 class="text-xl font-bold text-white mb-2">Você Escolhe a Proposta</h3>
                                <p class="text-gray-400 text-sm leading-relaxed mb-4">Apresentamos opções comparadas para você decidir com segurança.</p>
                            </div>
                            <div class="flex p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/10 transition-colors duration-300">
                                <svg class="w-12 h-12 text-brand-secondary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4 -->
                    <div class="timeline-step opacity-0 translate-y-8 transition-all duration-700 ease-out relative flex flex-col md:flex-row justify-between items-center w-full" data-step="4" style="transition-delay: 100ms;">
                        <div class="w-full md:w-5/12 pl-24 md:pr-12 md:pl-0 text-left md:text-right mt-0 md:order-1">
                            <h3 class="text-xl md:text-2xl font-bold text-white mb-2">Acompanhamos até a Liberação</h3>
                            <p class="text-gray-400 text-sm leading-relaxed mb-4 md:mb-0">Cuidamos de toda burocracia até o dinheiro na sua conta.</p>
                        </div>
                        <!-- Indicator -->
                        <div class="absolute left-[40px] md:left-1/2 w-8 h-8 rounded-full bg-[#040f1a] border-2 border-white/20 flex items-center justify-center transform -translate-x-1/2 md:translate-x-[-50%] z-10 step-circle transition-all duration-500">
                            <div class="w-3 h-3 bg-white/20 rounded-full step-dot transition-all duration-500"></div>
                        </div>
                        <!-- Asset -->
                        <div class="flex w-full md:w-5/12 pl-24 md:pl-12 text-left md:order-2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/10 transition-colors duration-300">
                            <svg class="w-12 h-12 text-brand-secondary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- Intersection Observer Script for Timeline -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const steps = document.querySelectorAll('.timeline-step');
            const progressLine = document.getElementById('timeline-progress');
            
            if(!steps.length || !progressLine) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -25% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const stepEl = entry.target;
                        const stepNum = parseInt(stepEl.getAttribute('data-step'));
                        
                        // Animate step container in
                        stepEl.classList.remove('opacity-0', 'translate-y-8');
                        stepEl.classList.add('opacity-100', 'translate-y-0');

                        // Highlight the circle
                        const circle = stepEl.querySelector('.step-circle');
                        const dot = stepEl.querySelector('.step-dot');
                        if (circle && dot) {
                            circle.classList.remove('border-white/20');
                            circle.classList.add('border-brand-secondary', 'shadow-[0_0_15px_rgba(0,153,221,0.5)]');
                            dot.classList.remove('bg-white/20');
                            dot.classList.add('bg-brand-secondary', 'animate-pulse');
                        }

                        // Calculate progress line height
                        const heights = {
                            1: '0%',
                            2: '33%',
                            3: '66%',
                            4: '100%'
                        };
                        progressLine.style.height = heights[stepNum];
                    }
                });
            }, observerOptions);

            steps.forEach(step => observer.observe(step));
        });
    </script>
`;

if (content.includes('id="como-funciona"')) {
    // Replace existing section if it already existed somewhere accidentally
    const existingRegex = /<!-- ── Como Funciona \(Animated Timeline\) ── -->[\s\S]*?<\/script>/;
    fs.writeFileSync(targetFile, content.replace(existingRegex, newSectionHtml.trim()), 'utf8');
} else {
    // Prepend right before FAQ section
    const faqSectionSplitter = '<section id="faq"';
    const parts = content.split(faqSectionSplitter);
    if(parts.length === 2) {
        fs.writeFileSync(targetFile, parts[0] + newSectionHtml.trim() + '\\n    ' + faqSectionSplitter + parts[1], 'utf8');
    }
}
console.log('Successfully added Como Funciona section!');

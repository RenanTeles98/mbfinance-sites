const fs = require('fs');
const path = 'c:\\Users\\MB NEGOCIOS\\Mb finance- Sites\\mb-finance-completo.html';
let content = fs.readFileSync(path, 'utf8');

const sectionDepoimentosRegex = /<section id="depoimentos"[\s\S]*?<\/section>/;
const newSection = `
    <!-- ── Boardroom Testimonials ── -->
    <section id="depoimentos" class="py-32 bg-[#f8fafc] relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
            <div class="text-center mb-24">
                <span class="text-brand-secondary font-black text-[11px] uppercase tracking-[4px] mb-4 block">Sobre Nós — Experiência Institucional</span>
                <h2 class="text-4xl sm:text-6xl font-serif font-black text-[#040f1a] leading-tight tracking-tight">
                    A voz de quem <span class="text-brand-secondary">move o país</span>
                </h2>
                <div class="mt-4 flex items-center justify-center gap-2">
                    <div class="w-12 h-[1px] bg-brand-secondary/40"></div>
                    <span class="text-[10px] uppercase tracking-[4px] text-gray-400 font-bold">+300.000 clientes satisfeitos</span>
                    <div class="w-12 h-[1px] bg-brand-secondary/40"></div>
                </div>
            </div>
            
            <div class="flex flex-col lg:flex-row justify-center gap-8 h-[800px] overflow-hidden scroll-mask no-scrollbar relative items-start">
                
                <!-- Col 1: Up -->
                <div class="flex flex-col gap-8 animate-scroll-vertical flex-shrink-0" style="--duration: 50s">
                    <div class="flex flex-col gap-8">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-full lg:w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Meu banco travou meu limite por burocracia. Na MB, em 4 horas o consultor resolveu e liberou o dobro. Salvaram meu mês."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_1_1774452713699.png'); background-position: 0% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Marcos Vinícius</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">CEO — Vinícius Transp.</div></div>
                            </div>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-full lg:w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Mudei pra MB e economizei quase 3 mil reais em taxas de maquininha no primeiro mês. Suporte humano e real."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_1_1774452713699.png'); background-position: 100% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Juliana Prata</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Socia — Prata Varejo</div></div>
                            </div>
                        </div>
                    </div>
                    <!-- Duplicate for loop -->
                    <div class="flex flex-col gap-8">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-full lg:w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Meu banco travou meu limite por burocracia..."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_1_1774452713699.png'); background-position: 0% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Marcos Vinícius</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">CEO — Vinícius Transp.</div></div>
                            </div>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-full lg:w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Mudei pra MB e economizei quase 3 mil reais..."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_1_1774452713699.png'); background-position: 100% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Juliana Prata</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Socia — Prata Varejo</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Col 2: Down -->
                <div class="hidden md:flex flex-col gap-8 animate-scroll-vertical-reverse flex-shrink-0" style="--duration: 45s">
                    <div class="flex flex-col gap-8">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"No plantio, o custeio agrícola saiu no tempo exato. A MB foi cirúrgica. Ganharam um cliente fiel pro resto da vida."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_2_1774452759827.png'); background-position: 0% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Sérgio Machado</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Fazenda Machado</div></div>
                            </div>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Antecipação de notas na MB é muito ágil. Subo o arquivo e o saldo cai rápido. Foco na obra, zero estresse."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_2_1774452759827.png'); background-position: 0% 100%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Fernando Souza</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Souza Construtora</div></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8">
                        <!-- Duplicate Cards -->
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"No plantio, o custeio agrícola saiu no tempo exato..."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_2_1774452759827.png'); background-position: 0% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Sérgio Machado</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Fazenda Machado</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Col 3: Up -->
                <div class="hidden lg:flex flex-col gap-8 animate-scroll-vertical flex-shrink-0" style="--duration: 60s">
                    <div class="flex flex-col gap-8">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Leasing de equipamentos hospitalares prático e sem frescura. Aprovamos o crédito pra nova clínica em tempo recorde."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_2_1774452759827.png'); background-position: 100% 100%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Dra. Monica</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Clínica Costa</div></div>
                            </div>
                        </div>
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"A MB desenhou um plano de capital de giro sazonal pra minha agência. Foi a salvação da nossa temporada de eventos."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_1_1774452713699.png'); background-position: 100% 0%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Victor Hugo</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Agência Impacto</div></div>
                            </div>
                        </div>
                    </div>
                    <!-- Duplicate -->
                    <div class="flex flex-col gap-8">
                        <div class="p-8 bg-white border border-gray-100 rounded-[32px] w-[350px] shadow-[0_10px_40px_rgba(4,15,26,0.03)] flex-shrink-0">
                            <div class="flex gap-1 mb-6 text-brand-secondary text-[10px]">★★★★★</div>
                            <p class="text-[#040f1a]/70 text-[14px] leading-relaxed mb-8 font-medium italic">"Leasing de equipamentos hospitalares..."</p>
                            <div class="flex items-center gap-4 pt-6 border-t border-gray-50 uppercase">
                                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url('brazilian_entrepreneurs_set_2_1774452759827.png'); background-position: 100% 100%;"></div>
                                <div><div class="text-[#040f1a] font-bold text-sm">Dra. Monica</div><div class="text-gray-400 text-[10px] font-bold tracking-widest">Clínica Costa</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

content = content.replace(sectionDepoimentosRegex, newSection);
fs.writeFileSync(path, content, 'utf8');
console.log('Final Testimonials Wall structure corrected and finalized.');

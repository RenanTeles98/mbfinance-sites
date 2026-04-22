import os, re

pages_dir = r'c:/Users/MB NEGOCIOS/Mb finance- Sites/public/pages'

FOOTER = '''    <footer class="text-white" style="background:#040f1a; padding: 120px 0;">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">

                <!-- Col 1: Brand & Bio -->
                <div class="lg:col-span-4 space-y-8">
                    <div class="mb-8">
                        <a href="../mb-finance-completo.html" class="inline-block hover:opacity-80 transition-opacity">
                            <img src="../images/logo-horizontal-logo.branca.png" alt="mb finance" style="height: 36px; width: auto;">
                        </a>
                    </div>
                    <p class="font-medium text-[15px] leading-relaxed max-w-sm" style="color: rgba(255,255,255,0.45);">
                        H\u00e1 mais de 10 anos conectando empresas \u00e0s melhores solu\u00e7\u00f5es financeiras do mercado. Seu elo estrat\u00e9gico com as principais institui\u00e7\u00f5es banc\u00e1rias do Brasil.
                    </p>
                    <div class="flex gap-4">
                        <a href="https://www.linkedin.com/company/mbfassessoria/?viewAsMember=true" target="_blank" rel="noopener" class="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/15 hover:scale-110 transition-all group">
                            <svg class="w-5 h-5 text-slate-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/mbfassessoria/" target="_blank" rel="noopener" class="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/15 hover:scale-110 transition-all group">
                            <svg class="w-5 h-5 text-slate-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Col 2: Solu\u00e7\u00f5es -->
                <div class="lg:col-span-2">
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-10" style="color: #ffffff !important;">Solu\u00e7\u00f5es</h4>
                    <ul class="space-y-4 font-medium text-sm" style="color: rgba(255,255,255,0.4);">
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Conta Corrente Empresarial</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">M\u00e1quina de Cart\u00e3o</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Seguros e Cons\u00f3rcios</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Cr\u00e9dito R\u00e1pido</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Solu\u00e7\u00f5es Tribut\u00e1rias</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Telemedicina</a></li>
                        <li><a href="../mb-finance-completo.html#produtos" class="hover:text-[#0099dd] transition-colors">Solu\u00e7\u00f5es Personalizadas</a></li>
                    </ul>
                </div>

                <!-- Col 3: Empresa & Legal -->
                <div class="lg:col-span-2 flex flex-col gap-12">
                    <div>
                        <h4 class="font-bold text-sm uppercase tracking-widest mb-10" style="color: #ffffff !important;">Empresa</h4>
                        <ul class="space-y-4 font-medium text-sm" style="color: rgba(255,255,255,0.4);">
                            <li><a href="../mb-finance-completo.html#como-funciona" class="hover:text-[#0099dd] transition-colors">Como Funciona</a></li>
                            <li><a href="https://mbfinance.inhire.app/vagas" target="_blank" class="hover:text-[#0099dd] transition-colors">Trabalhe Conosco</a></li>
                            <li><a href="../mb-finance-completo.html" class="hover:text-[#0099dd] transition-colors">Seja um Parceiro</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-sm uppercase tracking-widest mb-8" style="color: #ffffff !important;">Legal</h4>
                        <ul class="space-y-4 font-medium text-sm" style="color: rgba(255,255,255,0.4);">
                            <li><a href="politica-de-privacidade.html" class="hover:text-[#0099dd] transition-colors">Pol\u00edtica de Privacidade</a></li>
                            <li><a href="termos-de-uso.html" class="hover:text-[#0099dd] transition-colors">Termos de Uso</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Col 4: Ecossistema MB -->
                <div class="lg:col-span-2">
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-10" style="color: #ffffff !important;">Ecossistema MB</h4>
                    <ul class="space-y-4 font-medium text-sm" style="color: rgba(255,255,255,0.4);">
                        <li><a href="https://mbnegocios.com.br/" target="_blank" rel="noopener" class="hover:text-[#0099dd] transition-colors">MB Neg\u00f3cios</a></li>
                        <li><a href="https://fomentamais.com.br/" target="_blank" rel="noopener" class="hover:text-[#0099dd] transition-colors">Fomenta Mais</a></li>
                        <li><a href="mb-tributos.html" class="hover:text-[#0099dd] transition-colors">MB Tributos</a></li>
                    </ul>
                </div>

                <!-- Col 5: Contato -->
                <div class="lg:col-span-2">
                    <h4 class="font-bold text-sm uppercase tracking-widest mb-10" style="color: #ffffff !important;">Contato</h4>
                    <div class="space-y-8 text-white/40 text-sm">
                        <div class="flex flex-col gap-1">
                            <span class="text-white font-bold text-xl">(21) 3900-8295</span>
                            <span class="text-[10px] uppercase tracking-wider text-white/20">Seg - Sex: 9h \u00e0s 18h</span>
                        </div>
                        <div>
                            <a href="mailto:atendimento@mbfinance.com.br" class="text-white/60 hover:text-white transition-colors">atendimento@mbfinance.com.br</a>
                        </div>
                        <div class="text-[13px] leading-relaxed text-white/30 max-w-[200px]">
                            Av. Rio Branco, 110 - 30\u00ba andar<br>
                            Centro, Rio de Janeiro - RJ<br>
                            CEP: 20040-006
                        </div>
                    </div>
                </div>
            </div>

            <!-- Static Bottom Bar -->
            <div class="pt-12 border-t border-white/5">
                <p class="text-[10px] sm:text-[11px] uppercase tracking-[2px] text-center leading-relaxed" style="color: rgba(255,255,255,0.6) !important;">
                    \u00a9 2026 MB ASSESSORIA E ESTRUTURA\u00c7\u00c3O DE NEG\u00d3CIOS LTDA. CNPJ: 26.388.817/0001-72. TODOS OS DIREITOS RESERVADOS.
                </p>
            </div>
        </div>
    </footer>'''

files = [
    'sobre.html',
    'blog.html',
    'politica-de-privacidade.html',
    'termos-de-uso.html',
    'artigo-antecipacao-de-recebiveis-quando-vale-a-pena.html',
    'artigo-capital-de-giro-melhores-taxas.html',
    'artigo-conta-pj-o-que-sua-empresa-precisa-saber.html',
    'artigo-fluxo-de-caixa-como-evitar-surpresas.html',
    'artigo-reforma-tributaria-o-que-muda-para-sua-empresa.html',
]

for fname in files:
    path = os.path.join(pages_dir, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(r'<footer[\s\S]*?</footer>', FOOTER, content, count=1)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'OK: {fname}')
    else:
        print(f'SEM MATCH: {fname}')

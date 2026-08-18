/**
 * Admin Dashboard - AI Idea Generator & Smart Writing
 */

async function generateIdeas() {
    const loading = document.getElementById('ai-loading-state');
    const results = document.getElementById('gen-results');
    if (!loading || !results) return;

    loading.style.display = 'block';
    results.style.opacity = '0.3';

    // Simula inteligÃªncia artificial com delay
    await new Promise(r => setTimeout(r, 2000));

    const topics = [
        {
            title: "CrÃ©dito Rural vs. Comercial: Como o agronegÃ³cio pode financiar a expansÃ£o urbana",
            desc: "AnÃ¡lise sobre linhas de crÃ©dito hÃ­bridas para empresas que operam na transiÃ§Ã£o agro-industrial.",
            pilar: "CrÃ©dito",
            time: "8 min",
            type: "Trend"
        },
        {
            title: "Planejamento TributÃ¡rio para 2026: O que muda para o Simples Nacional",
            desc: "Quais sÃ£o as novas faixas e como preparar o caixa para as atualizaÃ§Ãµes da reforma.",
            pilar: "GestÃ£o",
            time: "10 min",
            type: "Evergreen"
        },
        {
            title: "O impacto da tecnologia na anÃ¡lise de risco de crÃ©dito para PMEs",
            desc: "Como algoritmos e Open Finance estÃ£o democratizando o acesso a capital.",
            pilar: "Mercado",
            time: "6 min",
            type: "Pillar"
        }
    ];

    results.innerHTML = topics.map(t => `
        <div class="gen-card premium" onclick="applyIdea('${t.title.replace(/'/g,"\\'")}', '${t.desc.replace(/'/g,"\\'")}')">
            <span class="gen-badge ${t.type === 'Trend' ? 'badge-trend' : 'badge-evergreen'}">${t.type === 'Trend' ? 'TendÃªncia' : 'EstratÃ©gico'}</span>
            <h3 class="gen-title">${t.title}</h3>
            <p class="gen-desc">${t.desc}</p>
            <div class="gen-meta">
                <span>Pilar: ${t.pilar}</span>
                <span>Tempo: ${t.time}</span>
                <span style="color: #0099dd;">â†’ Criar Rascunho IA</span>
            </div>
        </div>
    `).join('');

    loading.style.display = 'none';
    results.style.opacity = '1';
}

function applyIdea(title, excerpt) {
    if (typeof newPost === 'function') {
        newPost();
        const titleInput = document.getElementById('f-title');
        const excerptInput = document.getElementById('f-excerpt');
        if (titleInput) titleInput.value = title;
        if (excerptInput) excerptInput.value = excerpt;
        
        if (typeof slugify === 'function') {
            const slugInput = document.getElementById('f-slug');
            if (slugInput) slugInput.value = slugify(title);
        }
        document.querySelector('.admin-main').scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function writeWithAI() {
    const title = document.getElementById('f-title').value;
    const editor = document.getElementById('editor-content');
    
    if (!title) return alert("Por favor, preencha o tÃ­tulo primeiro para que a IA saiba sobre o que escrever.");
    
    editor.innerHTML = "Gerando rascunho inteligente...";
    editor.style.opacity = '0.5';
    
    // SimulaÃ§Ã£o de escrita baseada no nicho
    await new Promise(r => setTimeout(r, 3000));
    
    const article = `<h2>1. IntroduÃ§Ã£o ao tema: ${title}</h2>
<p>No atual cenÃ¡rio econÃ´mico brasileiro, empresÃ¡rios enfrentam desafios constantes para manter a saÃºde financeira de seus negÃ³cios. Compreender ${title.toLowerCase()} nÃ£o Ã© apenas um diferencial, mas uma necessidade de sobrevivÃªncia e crescimento.</p>

<h2>2. O contexto do setor</h2>
<p>A gestÃ£o eficiente dos recursos permite que a empresa aproveite oportunidades de mercado sem comprometer sua liquidez. Ã‰ fundamental analisar como as tendÃªncias de crÃ©dito e tecnologia impactam diretamente o dia a dia da operaÃ§Ã£o.</p>

<h2>3. Passo a passo para implementaÃ§Ã£o</h2>
<ul>
    <li>AnÃ¡lise de mÃ©tricas internas;</li>
    <li>AvaliaÃ§Ã£o de parceiros financeiros estratÃ©gicos;</li>
    <li>RevisÃ£o periÃ³dica de taxas e custos ocultos;</li>
    <li>Foco em automaÃ§Ã£o de processos.</li>
</ul>

<h2>4. ConclusÃ£o</h2>
<p>Em resumo, focar em ${title.toLowerCase()} permite uma visÃ£o mais clara do futuro do negÃ³cio. Na Mb Finance, acreditamos que a informaÃ§Ã£o Ã© a melhor ferramenta para o sucesso empresarial.</p>`;

    editor.innerHTML = article;
    editor.style.opacity = '1';
    if (typeof showToast === 'function') showToast("Rascunho gerado com sucesso!");
}

// Export to window
window.generateIdeas = generateIdeas;
window.applyIdea = applyIdea;
window.writeWithAI = writeWithAI;

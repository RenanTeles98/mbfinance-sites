/**
 * Admin Dashboard - AI Idea Generator & Smart Writing
 */

async function generateIdeas() {
    const loading = document.getElementById('ai-loading-state');
    const results = document.getElementById('gen-results');
    if (!loading || !results) return;

    loading.style.display = 'block';
    results.style.opacity = '0.3';

    // Simula inteligência artificial com delay
    await new Promise(r => setTimeout(r, 2000));

    const topics = [
        {
            title: "Crédito Rural vs. Comercial: Como o agronegócio pode financiar a expansão urbana",
            desc: "Análise sobre linhas de crédito híbridas para empresas que operam na transição agro-industrial.",
            pilar: "Crédito",
            time: "8 min",
            type: "Trend"
        },
        {
            title: "Planejamento Tributário para 2026: O que muda para o Simples Nacional",
            desc: "Quais são as novas faixas e como preparar o caixa para as atualizações da reforma.",
            pilar: "Gestão",
            time: "10 min",
            type: "Evergreen"
        },
        {
            title: "O impacto da tecnologia na análise de risco de crédito para PMEs",
            desc: "Como algoritmos e Open Finance estão democratizando o acesso a capital.",
            pilar: "Mercado",
            time: "6 min",
            type: "Pillar"
        }
    ];

    results.innerHTML = topics.map(t => `
        <div class="gen-card premium" onclick="applyIdea('${t.title.replace(/'/g,"\\'")}', '${t.desc.replace(/'/g,"\\'")}')">
            <span class="gen-badge ${t.type === 'Trend' ? 'badge-trend' : 'badge-evergreen'}">${t.type === 'Trend' ? 'Tendência' : 'Estratégico'}</span>
            <h3 class="gen-title">${t.title}</h3>
            <p class="gen-desc">${t.desc}</p>
            <div class="gen-meta">
                <span>Pilar: ${t.pilar}</span>
                <span>Tempo: ${t.time}</span>
                <span style="color: #0099dd;">→ Criar Rascunho IA</span>
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
    
    if (!title) return alert("Por favor, preencha o título primeiro para que a IA saiba sobre o que escrever.");
    
    editor.innerHTML = "Gerando rascunho inteligente...";
    editor.style.opacity = '0.5';
    
    // Simulação de escrita baseada no nicho
    await new Promise(r => setTimeout(r, 3000));
    
    const article = `<h2>1. Introdução ao tema: ${title}</h2>
<p>No atual cenário econômico brasileiro, empresários enfrentam desafios constantes para manter a saúde financeira de seus negócios. Compreender ${title.toLowerCase()} não é apenas um diferencial, mas uma necessidade de sobrevivência e crescimento.</p>

<h2>2. O contexto do setor</h2>
<p>A gestão eficiente dos recursos permite que a empresa aproveite oportunidades de mercado sem comprometer sua liquidez. É fundamental analisar como as tendências de crédito e tecnologia impactam diretamente o dia a dia da operação.</p>

<h2>3. Passo a passo para implementação</h2>
<ul>
    <li>Análise de métricas internas;</li>
    <li>Avaliação de parceiros financeiros estratégicos;</li>
    <li>Revisão periódica de taxas e custos ocultos;</li>
    <li>Foco em automação de processos.</li>
</ul>

<h2>4. Conclusão</h2>
<p>Em resumo, focar em ${title.toLowerCase()} permite uma visão mais clara do futuro do negócio. Na MB Finance, acreditamos que a informação é a melhor ferramenta para o sucesso empresarial.</p>`;

    editor.innerHTML = article;
    editor.style.opacity = '1';
    if (typeof showToast === 'function') showToast("Rascunho gerado com sucesso!");
}

// Export to window
window.generateIdeas = generateIdeas;
window.applyIdea = applyIdea;
window.writeWithAI = writeWithAI;

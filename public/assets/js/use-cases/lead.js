// Use Case: Lead capture and WhatsApp routing
// Depends on: sheets.js (enviarParaPlanilha), storage.js (LeadStorage)

let _leadWaUrl = 'https://wa.me/552139008295';
let _leadProduto = '';
let _leadConvertido = false;

function updateLeadProgress() {
    const nome = document.getElementById('lead-nome').value.trim();
    const tel = document.getElementById('lead-telefone').value.trim();
    const nomeOk = nome.length >= 2;
    const telOk = tel.length >= 14;
    const steps = (nomeOk ? 1 : 0) + (telOk ? 1 : 0);
    const pct = steps === 0 ? 0 : steps === 1 ? 50 : 100;
    document.getElementById('lead-progress-bar').style.width = pct + '%';
    const labels = ['0 de 2 etapas', 'Quase lá! Falta só o WhatsApp', 'Tudo certo! Clique para falar agora'];
    document.getElementById('lead-progress-label').textContent = labels[steps];
    if (steps === 2) {
        document.getElementById('lead-progress-label').style.color = '#0099dd';
        document.getElementById('lead-progress-label').style.fontWeight = '700';
    } else {
        document.getElementById('lead-progress-label').style.color = '#94a3b8';
        document.getElementById('lead-progress-label').style.fontWeight = '400';
    }
}

function openLeadModal(waUrl, produto) {
    _leadWaUrl = waUrl || 'https://wa.me/552139008295';
    _leadProduto = produto || '';
    const modal = document.getElementById('lead-modal');
    modal.style.removeProperty('display');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Reset progresso
    document.getElementById('lead-progress-bar').style.width = '0%';
    document.getElementById('lead-progress-label').textContent = '0 de 2 etapas';
    document.getElementById('lead-progress-label').style.color = '#94a3b8';
    document.getElementById('lead-progress-label').style.fontWeight = '400';
    // Produto: badge ou select (elemento pode não existir em outras pages)
    const sel = document.getElementById('lead-produto-select');
    if (sel) {
        sel.style.display = 'none';
        sel.value = _leadProduto || '';
    }
}

function closeLeadModal() {
    const modal = document.getElementById('lead-modal');
    if (!_leadConvertido) {
        const nome = document.getElementById('lead-nome').value.trim();
        const telefone = document.getElementById('lead-telefone').value.trim();
        if (nome || telefone) {
            const selEl = document.getElementById('lead-produto-select');
            enviarParaPlanilha({
                data: new Date().toLocaleString('pt-BR'),
                nome: nome,
                telefone: telefone,
                produto: _leadProduto || (selEl ? selEl.value : '') || '',
                status: 'Parcial — não enviou'
            });
        }
    }
    _leadConvertido = false;
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function submitLead(e) {
    e.preventDefault();
    const nome = document.getElementById('lead-nome').value.trim();
    const telefone = document.getElementById('lead-telefone').value.trim();
    const newsletterEl = document.getElementById('lead-newsletter');
    const newsletter = newsletterEl && newsletterEl.checked ? 'Sim' : 'Não';
    const selEl = document.getElementById('lead-produto-select');
    const produtoSelecionado = _leadProduto || (selEl ? selEl.value : '') || '';

    // Envia para a planilha Google Sheets
    enviarParaPlanilha({
        data: new Date().toLocaleString('pt-BR'),
        nome: nome,
        telefone: telefone,
        produto: produtoSelecionado,
        status: 'Convertido — foi pro WhatsApp'
    });

    // Salva localmente como backup
    LeadStorage.save({ nome, telefone, newsletter, produto: produtoSelecionado, data: new Date().toISOString() });

    // Monta mensagem personalizada pro WhatsApp
    const msgsPorProduto = {
        'Conta Corrente Empresarial': `Olá! Gostaria de abrir uma Conta Corrente Empresarial para minha empresa pela mb finance. Podem me ajudar?`,
        'Máquina de Cartão': `Olá! Tenho interesse nas soluções de maquininha e gateway de pagamento da mb finance. Podem me passar mais informações?`,
        'Seguros e Consórcios': `Olá! Gostaria de conhecer as opções de Seguros e Consórcios da mb finance. Podem me ajudar?`,
        'Crédito Rápido': `Olá! Preciso de crédito rápido para minha empresa. Gostaria de saber as condições disponíveis.`,
        'Soluções Tributárias': `Olá! Tenho interesse nas Soluções Tributárias da mb finance. Podem me passar mais detalhes?`,
        'Soluções Personalizadas': `Olá! Gostaria de uma proposta de Solução Personalizada para minha empresa. Podem me ajudar?`,
        'Telemedicina': `Olá! Gostaria de conhecer os planos de Telemedicina da mb finance. Podem me passar mais informações?`,
    };
    let msg = msgsPorProduto[produtoSelecionado] || `Olá! Gostaria de falar com um especialista da mb finance.`;

    const baseUrl = _leadWaUrl.split('?')[0];
    const waLink = `${baseUrl}?text=${encodeURIComponent(msg)}`;

    _leadConvertido = true;
    closeLeadModal();
    document.getElementById('lead-form').reset();
    window.open(waLink, '_blank');
}

function toggleNewsletter() {
    const cb = document.getElementById('lead-newsletter');
    const box = document.getElementById('newsletter-box');
    const icon = document.getElementById('newsletter-icon');
    if (!cb || !box || !icon) return; // elements may not exist on all pages
    cb.checked = !cb.checked;
    if (cb.checked) {
        box.style.borderColor = '#0099dd';
        box.style.background = '#0099dd';
        icon.style.display = 'block';
    } else {
        box.style.borderColor = '#d1d5db';
        box.style.background = '#fff';
        icon.style.display = 'none';
    }
}

// Counter animation (IntersectionObserver for data-counter elements)
(function() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-counter'));
            const isDecimal = target % 1 !== 0;
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 1.5);
                const raw = progress >= 0.99 ? target : ease * target;
                const value = isDecimal ? raw.toFixed(1) : Math.floor(raw);
                el.textContent = prefix + value + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { observer.observe(c); });
})();

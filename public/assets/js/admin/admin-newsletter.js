/**
 * Admin Dashboard - Newsletter & Subscriptions
 */

function updateNewsletterList() {
    const list = document.getElementById('nl-sub-list');
    if (!list) return;
    
    // Lista simulada de inscritos
    const mockEmails = [
        { email: 'contato@techsolutions.com.br', date: '2026-04-20', status: 'Ativo' },
        { email: 'financeiro@viverebem.me', date: '2026-04-19', status: 'Ativo' },
        { email: 'socio_diretor@industria.com', date: '2026-04-18', status: 'Pendente' },
        { email: 'analista@bcom.ind.br', date: '2026-04-15', status: 'Ativo' }
    ];

    list.innerHTML = mockEmails.map(e => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid #f1f5f9;">
            <div>
                <div style="font-size:13px;font-weight:600;color:#003956;">${e.email}</div>
                <div style="font-size:11px;color:#94a3b8;">${e.date} • ${e.status}</div>
            </div>
            <button style="border:none;background:none;color:#ef4444;font-size:11px;cursor:pointer;">Remover</button>
        </div>
    `).join('');
    
    document.getElementById('nl-count-total').textContent = mockEmails.length;
    document.getElementById('nl-count-active').textContent = mockEmails.filter(x => x.status === 'Ativo').length;
}

function nlSwitchSubTab(tabId) {
    // Esconde todos os painéis internos
    ['send', 'history', 'config', 'stats'].forEach(id => {
        const panel = document.getElementById('nl-panel-' + id);
        const btn = document.getElementById('nl-tab-' + id + '-btn');
        if (panel) panel.style.display = 'none';
        if (btn) {
            btn.style.background = 'transparent';
            btn.style.color = '#64748b';
            btn.style.boxShadow = 'none';
        }
    });

    // Mostra o selecionado
    const target = document.getElementById('nl-panel-' + tabId);
    const targetBtn = document.getElementById('nl-tab-' + tabId + '-btn');
    if (target) target.style.display = 'block';
    if (targetBtn) {
        targetBtn.style.background = '#fff';
        targetBtn.style.color = '#003956';
        targetBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }
}

// Funções de compatibilidade para evitar erros no console
function nlAddSubscriber() { alert('Funcionalidade de adição manual ativa na versão Pro.'); }
function nlFilterSubs(val) { console.log('Filtrando inscritos por:', val); }
function nlUpdateRecipientCount() { console.log('Atualizando contagem de destinatários'); }
function nlAddBlock(type) { console.log('Adicionando bloco de newsletter:', type); }
function nlSendCampaign() { alert('Simulação: Campanha enviada com sucesso!'); }
function nlSaveConfig() { 
    document.getElementById('nl-cfg-save-msg').style.display = 'block';
    setTimeout(() => { document.getElementById('nl-cfg-save-msg').style.display = 'none'; }, 3000);
}

// Export to window
window.updateNewsletterList = updateNewsletterList;
window.nlSwitchSubTab = nlSwitchSubTab;
window.nlAddSubscriber = nlAddSubscriber;
window.nlFilterSubs = nlFilterSubs;
window.nlUpdateRecipientCount = nlUpdateRecipientCount;
window.nlAddBlock = nlAddBlock;
window.nlSendCampaign = nlSendCampaign;
window.nlSaveConfig = nlSaveConfig;

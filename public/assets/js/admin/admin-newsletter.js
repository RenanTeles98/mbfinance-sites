/**
 * Admin Dashboard - Newsletter & Subscriptions
 */

function updateNewsletterList() {
    const list = document.getElementById('nl-list');
    if (!list) return;
    
    // Simula lista de inscritos (normalmente viria de um DB/API)
    const mockEmails = [
        { email: 'contato@techsolutions.com.br', date: '2026-04-20', origin: 'Landing Page' },
        { email: 'financeiro@viverebem.me', date: '2026-04-19', origin: 'Pop-up Blog' },
        { email: 'socio_diretor@industria.com', date: '2026-04-18', origin: 'Rodapé Site' },
        { email: 'analista@bcom.ind.br', date: '2026-04-15', origin: 'Blog' }
    ];

    list.innerHTML = mockEmails.map(e => `
        <div class="nl-item">
            <div class="nl-item-info">
                <div class="nl-item-email">${esc(e.email)}</div>
                <div class="nl-item-meta">Inscrito em ${fmtDate(e.date)} via ${e.origin}</div>
            </div>
            <button class="nl-item-del" onclick="alert('Funcionalidade indisponível nesta versão demo.')">Remover</button>
        </div>
    `).join('');
    
    document.getElementById('nl-count').textContent = mockEmails.length;
}

function sendNewsletter() {
    const subject = document.getElementById('nl-subject').value;
    const msg = document.getElementById('nl-message').value;
    
    if (!subject || !msg) return alert('Por favor, preencha o assunto e a mensagem.');
    
    alert('Simulação: Newsletter enviada para 4 inscritos!\nNo sistema real, isso dispararia via SMTP ou Mailchimp/Sendgrid.');
    
    document.getElementById('nl-subject').value = '';
    document.getElementById('nl-message').value = '';
}

// Export to window
window.updateNewsletterList = updateNewsletterList;
window.sendNewsletter = sendNewsletter;

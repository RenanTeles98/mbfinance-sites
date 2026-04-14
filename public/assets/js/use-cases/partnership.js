// Use Case: Partnership modal

function openParceriaModal() {
    const m = document.getElementById('parceria-modal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeParceriaModal() {
    document.getElementById('parceria-modal').style.display = 'none';
    document.body.style.overflow = '';
}

function enviarParceria() {
    const nome     = document.getElementById('parc-nome').value.trim();
    const tel      = document.getElementById('parc-tel').value.trim();
    const segmento = document.getElementById('parc-segmento').value;
    const msg      = document.getElementById('parc-msg').value.trim();
    if (!nome) { alert('Por favor, informe seu nome.'); return; }
    if (!tel)  { alert('Por favor, informe seu WhatsApp.'); return; }
    const texto = `Olá! Meu nome é ${nome} e tenho interesse em me tornar parceiro da mb finance.` +
        (segmento ? `\n\nSegmento: ${segmento}.` : '') +
        (msg ? `\n\n${msg}` : '') +
        `\n\nWhatsApp para contato: ${tel}`;
    window.open('https://wa.me/552139008295?text=' + encodeURIComponent(texto), '_blank');
    closeParceriaModal();
}

document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeParceriaModal(); });

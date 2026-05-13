// Infrastructure: Google Sheets API integration
const _s = ['aHR0cHM6Ly9zY3JpcHQu','Z29vZ2xlLmNvbS9tYWNy','b3MvcC9BS2Z5Y2J4UXNo','TDVrUjc0eHV6bzZiVGEt','Mk00V3dXRW5hQXdEN3hz','bFlJMGlub29uZk1lZ0g5','WWNiSVVCRTVnbW1BMzRw','ODV0QS9leGVj'];
const SHEETS_URL = atob(_s.join(''));
function enviarParaPlanilha(payload) {
const params = new URLSearchParams(payload).toString();
fetch(SHEETS_URL + '?' + params, { method: 'GET', mode: 'no-cors' }).catch(() => {});
}
// Infrastructure: Local storage persistence for leads
const LeadStorage = {
save(lead) {
const leads = JSON.parse(localStorage.getItem('mb_leads') || '[]');
leads.push(lead);
localStorage.setItem('mb_leads', JSON.stringify(leads));
}
};
// UI: Smooth scroll utilities (native CSS scroll-behavior handles global smooth scroll)
function smoothScrollTo(id, duration) {
const target = document.getElementById(id);
if (!target) return;
const start = window.scrollY;
const end = target.getBoundingClientRect().top + start;
const startTime = performance.now();
function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function step(now) {
const elapsed = now - startTime;
const progress = Math.min(elapsed / duration, 1);
window.scrollTo(0, start + (end - start) * ease(progress));
if (progress < 1) requestAnimationFrame(step);
}
requestAnimationFrame(step);
}
// UI: Navbar scroll effect, mobile menu, products dropdowndocument.addEventListener('DOMContentLoaded', function() {// ── Navbar scroll effect (logo change + scrolled class) ──────────────const navbar = document.getElementById('navbar');if (navbar) {let isHovered = false;function updateNav() {const isScrolled = window.scrollY > 80;const shouldBeScrolled = isScrolled || isHovered;navbar.classList.toggle('scrolled', shouldBeScrolled);const logoImg = document.getElementById('logo-img');
if (logoImg) {
const logoNormal   = logoImg.dataset.logoNormal   || '/images/logo-branca.webp';
const logoScrolled = logoImg.dataset.logoScrolled || '/images/logo.webp';
const nextLogo = shouldBeScrolled ? logoScrolled : logoNormal;
if (logoImg.getAttribute('src') !== nextLogo) {
logoImg.src = nextLogo;
}
}
}
navbar.addEventListener('mouseenter', () => {isHovered = true;updateNav();});navbar.addEventListener('mouseleave', () => {isHovered = false;updateNav();});window.addEventListener('scroll', updateNav, { passive: true });updateNav();}// ── Mobile menu ───────────────────────────────────────────────────────const mobileMenu = document.getElementById('mobile-menu');const mobileOverlay = document.getElementById('mobile-overlay');const whatsappFloat = document.getElementById('whatsapp-float');function openMobileMenu() {mobileMenu.classList.add('open');mobileOverlay.classList.add('open');document.body.style.overflow = 'hidden';if (whatsappFloat) whatsappFloat.classList.add('is-hidden');}function closeMobileMenu() {mobileMenu.classList.remove('open');mobileOverlay.classList.remove('open');document.body.style.overflow = '';if (whatsappFloat) whatsappFloat.classList.remove('is-hidden');}// Expose globally — called from inline onclick in anchorswindow.closeMobileMenu = closeMobileMenu;const mobileMenuToggle = document.getElementById('mobile-menu-toggle');if (mobileMenuToggle) {mobileMenuToggle.addEventListener('click', () => {if (mobileMenu.classList.contains('open')) {closeMobileMenu();} else {openMobileMenu();}});}// ── Products dropdown ─────────────────────────────────────────────────const dropdown        = document.getElementById('produtos-dropdown');const megaMenuWrapper = document.getElementById('mega-menu-wrapper');const megaChevron     = document.getElementById('mega-menu-chevron');let ddHideTimer       = null;function showDropdown() {clearTimeout(ddHideTimer);if (dropdown) dropdown.classList.add('open');if (megaChevron) megaChevron.style.transform = 'rotate(180deg)';}function hideDropdown() {ddHideTimer = setTimeout(() => {if (dropdown) dropdown.classList.remove('open');if (megaChevron) megaChevron.style.transform = '';}, 120);}if (megaMenuWrapper) {megaMenuWrapper.addEventListener('mouseenter', showDropdown);megaMenuWrapper.addEventListener('mouseleave', hideDropdown);}if (dropdown) {dropdown.addEventListener('mouseenter', showDropdown);dropdown.addEventListener('mouseleave', hideDropdown);}// Expose globally — called from inline onclick (closeProdDropdown)window.closeProdDropdown = function() {if (dropdown) dropdown.classList.remove('open');if (megaChevron) megaChevron.style.transform = '';};});
// UI: Product accordion and FAQ toggle
function toggleAcc(btn) {
var item = btn.closest('.acc-item');
var isOpen = item.classList.contains('open');
document.querySelectorAll('.acc-item.open').forEach(function(el) { el.classList.remove('open'); });
if (!isOpen) item.classList.add('open');
}
function openProduct(accId) {
var section = document.getElementById('produtos');
var item = document.getElementById(accId);
if (!section || !item) return;
document.querySelectorAll('.acc-item.open').forEach(function(el){ el.classList.remove('open'); });
item.classList.add('open');
setTimeout(function(){
item.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, 50);
}
function toggleFAQ(button) {
const content = button.nextElementSibling;
const icon = button.querySelector('.faq-icon');
// Close other items
document.querySelectorAll('.faq-content').forEach(item => {
if (item !== content) {
item.style.height = '0';
item.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
}
});
// Toggle current item
if (content.style.height === '0px' || content.style.height === '') {
content.style.height = content.scrollHeight + 'px';
icon.style.transform = 'rotate(180deg)';
} else {
content.style.height = '0';
icon.style.transform = 'rotate(0deg)';
}
}
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
function trackGA4(eventName, params) {
if (typeof gtag === 'function') {
gtag('event', eventName, Object.assign({ send_to: 'G-XS7HTFJKD6' }, params || {}));
}
}
var _productSlugs = {
'Conta Corrente Empresarial': 'conta_corrente',
'Máquina de Cartão': 'maquina_cartao',
'Seguros e Consórcios': 'seguros',
'Crédito Rápido': 'credito_rapido',
'Soluções Tributárias': 'tributarias',
'Soluções Personalizadas': 'personalizadas',
'Telemedicina': 'telemedicina',
};
function openLeadModal(waUrl, produto) {
_leadWaUrl = waUrl || 'https://wa.me/552139008295';
_leadProduto = produto || '';
trackGA4('lead_modal_open', { source_area: produto || 'main_site', product: produto || '' });
if (produto && _productSlugs[produto]) {
trackGA4('product_click_' + _productSlugs[produto], { source_area: 'main_site' });
}
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
trackGA4('generate_lead', { product: produtoSelecionado, source_area: 'lead_modal', form_name: 'main_site_lead_form' });
trackGA4('conta_pj_lead_click', { product: produtoSelecionado, source_area: 'lead_modal' });
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
// Deferred to idle time — not needed for initial render
(function() {
var idle = window.requestIdleCallback || function(cb) { setTimeout(cb, 200); };
idle(function() {
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
}); // end idle
})();
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
// UI: Visual animations - parallax, scroll-triggered steps, marquee carousel// Deferred to idle time so it doesn't block initial render(window.requestIdleCallback || function(cb) { setTimeout(cb, 300); })(function() {// ── Parallax ────────────────────────────────────────────────────────────────function updateParallax() {const windowH = window.innerHeight;// Hero backgroundconst hero = document.getElementById('parallax-hero');if (hero) {const scrollY = window.scrollY;hero.style.transform = `translateY(${scrollY * 0.22}px) scale(1.5)`;}// Cidade / Rio (Como Funciona)const cidade = document.getElementById('parallax-cidade');if (cidade) {const rect = cidade.closest('section').getBoundingClientRect();const centerOffset = (rect.top + rect.height / 2) - windowH / 2;cidade.style.transform = `translateY(${centerOffset * 0.22}px) scale(1.5)`;}}window.addEventListener('scroll', updateParallax, { passive: true });updateParallax();// ── Como Funciona: step animation ───────────────────────────────────────────(function(){var line = document.querySelector('.cf-line');var grid = document.querySelector('#como-funciona .grid');var section = document.getElementById('como-funciona');var currentStep = 0;var stepAnchors = [0.5, 0.34, 0.18, 0.04];function applySteps(n) {currentStep = Math.max(0, Math.min(4, n));if (line) line.classList.toggle('visible', currentStep > 0);[1,2,3,4].forEach(function(i){var step = document.getElementById('cf-step-' + i);if (!step) return;var on = i <= currentStep;step.classList.toggle('visible', on);var dot = step.querySelector('.cf-dot');if (dot) dot.classList.toggle('visible', on);});}function getStepFromScroll() {var rect = section.getBoundingClientRect();var windowH = window.innerHeight;var step = 0;stepAnchors.forEach(function(anchor, index){if (rect.top <= windowH * anchor) step = index + 1;});return step;}// Scroll normal da páginafunction checkScroll() {applySteps(getStepFromScroll());}// Scroll do mouse sobre a seção: página trava, etapas avançam/regridemfunction onWheel(e) {var now = Date.now();var goingDown = e.deltaY > 0;var goingUp   = e.deltaY < 0;// Se chegou no fim e quer descer, ou no início e quer subir → libera a páginaif ((goingDown && currentStep >= 4) || (goingUp && currentStep <= 0)) {isHovering = false;window.removeEventListener('wheel', onWheel);return; // não chama preventDefault → página rola normalmente}e.preventDefault();if (now - lastWheelStepAt < wheelStepCooldown) return;if ((wheelDeltaAccumulator > 0 && goingUp) || (wheelDeltaAccumulator < 0 && goingDown)) {wheelDeltaAccumulator = 0;}wheelDeltaAccumulator += e.deltaY;if (Math.abs(wheelDeltaAccumulator) < wheelStepThreshold) return;applySteps(currentStep + (wheelDeltaAccumulator > 0 ? 1 : -1));lastWheelStepAt = now;wheelDeltaAccumulator = 0;}// Só ativa o wheel interativo em desktop (sem touch)if (false) {section.addEventListener('mouseenter', function(){isHovering = true;currentStep = getStepFromScroll();wheelDeltaAccumulator = 0;lastWheelStepAt = 0;window.addEventListener('wheel', onWheel, { passive: false });});section.addEventListener('mouseleave', function(){isHovering = false;wheelDeltaAccumulator = 0;lastWheelStepAt = 0;window.removeEventListener('wheel', onWheel);});}window.addEventListener('scroll', checkScroll, { passive: true });checkScroll();})();// ── Marquee carousel — handled entirely by CSS @keyframes (see main.css) ──────// JS not needed: animation runs on browser compositor thread (smoother, no rAF).}); // end requestIdleCallback
// Seamless hero video loop: crossfade between two video elements
(function () {
var va = document.getElementById('hero-video-a');
var vb = document.getElementById('hero-video-b');
if (!va || !vb) return;
var fadeDuration = 1.2; // seconds for crossfade overlap
var active = va;
var inactive = vb;
var crossing = false;
function crossfade() {
if (crossing) return;
crossing = true;
inactive.currentTime = 0;
inactive.play();
inactive.style.opacity = '0.35';
active.style.opacity = '0';
var prev = active;
active = inactive;
inactive = prev;
setTimeout(function () { crossing = false; }, (fadeDuration + 0.3) * 1000);
}
function checkTime() {
if (!active.duration || crossing) return;
if (active.duration - active.currentTime <= fadeDuration) {
crossfade();
}
}
va.addEventListener('timeupdate', checkTime);
vb.addEventListener('timeupdate', checkTime);
})();
// UI: LGPD cookie consent banner
// Consent persisted in localStorage. Marketing tags are managed in Google Tag Manager.
(function () {
var CONSENT_KEY = 'mb_cookie_consent';
function pushConsent(status) {
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: 'cookie_consent_update', cookie_consent: status });
}
var existing = localStorage.getItem(CONSENT_KEY);
if (existing === 'accepted') {
pushConsent('accepted');
return;
}
if (existing === 'rejected') {
pushConsent('rejected');
return;
}
function buildBanner() {
var banner = document.createElement('div');
banner.id = 'cookie-banner';
banner.setAttribute('role', 'dialog');
banner.setAttribute('aria-label', 'Aviso de cookies');
banner.innerHTML = [
'<div class="cookie-inner">',
'  <div class="cookie-text">',
'    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:#0099dd"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
'    <p>Usamos cookies para analisar o tráfego e melhorar sua experiência. Ao continuar, você concorda com nossa <a href="/pages/politica-de-privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</p>',
'  </div>',
'  <div class="cookie-actions">',
'    <button id="cookie-reject" class="cookie-btn cookie-btn-outline">Recusar</button>',
'    <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Aceitar</button>',
'  </div>',
'</div>',
].join('');
document.body.appendChild(banner);
setTimeout(function () { banner.classList.add('cookie-visible'); }, 80);
document.getElementById('cookie-accept').addEventListener('click', function () {
localStorage.setItem(CONSENT_KEY, 'accepted');
pushConsent('accepted');
hideBanner(banner);
});
document.getElementById('cookie-reject').addEventListener('click', function () {
localStorage.setItem(CONSENT_KEY, 'rejected');
pushConsent('rejected');
hideBanner(banner);
});
}
function hideBanner(banner) {
banner.classList.remove('cookie-visible');
setTimeout(function () {
if (banner.parentNode) banner.parentNode.removeChild(banner);
}, 350);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', buildBanner);
} else {
setTimeout(buildBanner, 600);
}
})();
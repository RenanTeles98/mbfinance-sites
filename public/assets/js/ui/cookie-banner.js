// UI: LGPD cookie consent banner
// Consent persisted in localStorage. Marketing tags are managed in Google Tag Manager.

(function () {
    var CONSENT_KEY = 'mb_cookie_consent';

    function pushConsent(status) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'cookie_consent_update',
            cookie_consent: status
        });
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
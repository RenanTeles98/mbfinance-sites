// UI: LGPD cookie consent banner
// Blocks GA4 until user gives consent. Consent persisted in localStorage.

(function () {
    var CONSENT_KEY = 'mb_cookie_consent';
    var GA4_ID = window._ga4_id || 'G-16ZB759EFL';

    // ── GA4 initialization (called only after consent) ───────────────────────
    function initGA4() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
        document.head.appendChild(s);
        s.onload = function () {
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA4_ID);
        };
    }

    // ── Check existing consent ───────────────────────────────────────────────
    var existing = localStorage.getItem(CONSENT_KEY);
    if (existing === 'accepted') {
        initGA4();
        return; // no banner needed
    }
    if (existing === 'rejected') {
        return; // user already rejected — don't show banner again
    }

    // ── Build banner DOM ─────────────────────────────────────────────────────
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

        // Animate in after a tiny delay so CSS transition fires
        setTimeout(function () { banner.classList.add('cookie-visible'); }, 80);

        document.getElementById('cookie-accept').addEventListener('click', function () {
            localStorage.setItem(CONSENT_KEY, 'accepted');
            hideBanner(banner);
            initGA4();
        });

        document.getElementById('cookie-reject').addEventListener('click', function () {
            localStorage.setItem(CONSENT_KEY, 'rejected');
            hideBanner(banner);
        });
    }

    function hideBanner(banner) {
        banner.classList.remove('cookie-visible');
        setTimeout(function () {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 350);
    }

    // Show banner after page is interactive
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
        setTimeout(buildBanner, 600); // small delay so it doesn't flash on first paint
    }
})();

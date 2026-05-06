// Infrastructure: Google Ads tag — already loaded in <head>, this is a no-op guard
(function () {
    if (window._adsTagLoaded) return;
    // Fallback: carrega se o tag do <head> não estiver presente (ex: outras páginas)
    var GOOGLE_ADS_ID = 'AW-18112641661';
    var loaded = false;

    function loadAds() {
        if (loaded || window._adsTagLoaded) return;
        loaded = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
        document.head.appendChild(script);
        script.onload = function () {
            window.gtag('js', new Date());
            window.gtag('config', GOOGLE_ADS_ID);
        };
    }

    ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(function (e) {
        window.addEventListener(e, loadAds, { once: true, passive: true });
    });
    setTimeout(loadAds, 6000);
})();

// Infrastructure: Google Ads tag.
(function () {
    var GOOGLE_ADS_ID = 'AW-18112641661';
    var SCRIPT_ID = 'google-ads-tag-loader';

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    if (!document.getElementById(SCRIPT_ID)) {
        var script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
        document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ADS_ID);
})();

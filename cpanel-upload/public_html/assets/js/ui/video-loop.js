// Seamless hero video loop: crossfade between two video elements
(function () {
    var va = document.getElementById('hero-video-a');
    var vb = document.getElementById('hero-video-b');
    if (!va || !vb) return;

    var fadeDuration = 1.2;
    var active = va;
    var inactive = vb;
    var crossing = false;
    var useCrossfade = true;

    function startPlay(video) {
        var p = video.play();
        if (p && p.catch) {
            p.catch(function () {
                // Autoplay blocked — disable crossfade, rely on loop attribute
                useCrossfade = false;
            });
        }
    }

    function crossfade() {
        if (!useCrossfade || crossing) return;
        crossing = true;

        inactive.currentTime = 0;
        startPlay(inactive);
        inactive.style.opacity = '0.35';
        active.style.opacity = '0';

        var prev = active;
        active = inactive;
        inactive = prev;

        setTimeout(function () { crossing = false; }, (fadeDuration + 0.3) * 1000);
    }

    function checkTime() {
        if (!useCrossfade || !active.duration || crossing) return;
        if (active.duration - active.currentTime <= fadeDuration) {
            crossfade();
        }
    }

    // Try to play on load; if blocked (iOS Low Power Mode, etc.) fall back to loop attr
    startPlay(va);

    // On first touch, try again in case autoplay was blocked on mobile
    document.addEventListener('touchstart', function () {
        if (va.paused) startPlay(va);
    }, { once: true });

    va.addEventListener('timeupdate', checkTime);
    vb.addEventListener('timeupdate', checkTime);
})();

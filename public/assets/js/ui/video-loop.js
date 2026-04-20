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

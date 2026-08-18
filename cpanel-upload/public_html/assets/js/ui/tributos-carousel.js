(function () {
    var track    = document.getElementById('tribTrack');
    var dotsWrap = document.getElementById('tribDots');
    var btnPrev  = document.getElementById('tribPrev');
    var btnNext  = document.getElementById('tribNext');
    if (!track || !btnPrev || !btnNext) return;

    var cards   = track.querySelectorAll('article');
    var current = 0;

    function getVisible() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 980) return 2;
        return 3;
    }

    function maxIndex() {
        return Math.max(0, cards.length - getVisible());
    }

    function cardWidth() {
        return cards[0] ? cards[0].offsetWidth + 20 : 0;
    }

    function goTo(n) {
        current = Math.max(0, Math.min(n, maxIndex()));
        track.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
        track.style.transform  = 'translateX(-' + (current * cardWidth()) + 'px)';
        dotsWrap.querySelectorAll('.trib-car-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
        btnPrev.disabled = current === 0;
        btnNext.disabled = current >= maxIndex();
    }

    function buildDots() {
        dotsWrap.innerHTML = '';
        for (var i = 0; i <= maxIndex(); i++) {
            var dot = document.createElement('button');
            dot.className = 'trib-car-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            (function (idx) {
                dot.addEventListener('click', function () { goTo(idx); });
            })(i);
            dotsWrap.appendChild(dot);
        }
    }

    buildDots();
    goTo(0);

    btnPrev.addEventListener('click', function () { goTo(current - 1); });
    btnNext.addEventListener('click', function () { goTo(current + 1); });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            buildDots();
            goTo(Math.min(current, maxIndex()));
        }, 150);
    });
})();

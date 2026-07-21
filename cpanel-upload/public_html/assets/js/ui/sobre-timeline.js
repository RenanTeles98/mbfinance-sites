// UI: Timeline animation — sobre.html
// ── Timeline: sticky stacking + zigzag SVG rail ──
(function() {
    var section = document.getElementById('timeline-section');
    var slides  = Array.from(document.querySelectorAll('.tl-slide'));
    var pathFg      = document.getElementById('tl-zigzag-fg');
    var dotEl       = document.getElementById('tl-dot');
    var mobileLineEl = document.getElementById('tl-mobile-line');

    if (!section || !slides.length) return;

    var totalLen = 0;
    var railMetrics = null;

    // ── Scroll lock (time-based only — position release caused inertia skipping) ──
    var lockActive = false;
    var lockTimer  = null;

    function releaseLock() {
        lockActive = false;
    }

    function lockToSlide(targetIndex) {
        if (lockTimer) clearTimeout(lockTimer);
        lockActive = true;
        window.scrollTo({ top: getSlideTop(targetIndex), behavior: 'smooth' });
        // Hold lock for long enough: smooth scroll (~400ms) + content animations (~700ms)
        lockTimer = setTimeout(releaseLock, 1100);
    }

    // ── Path building ────────────────────────────────────────────────────────
    function buildPath() {
        var svgW    = section.offsetWidth;
        var svgH    = section.offsetHeight;
        var header  = section.querySelector('.tl-header');
        var headerH = header ? header.offsetHeight : 0;
        var svgEl   = document.getElementById('tl-rail-svg');
        if (svgEl) svgEl.style.height = svgH + 'px';

        var isMobile = svgW <= 768;
        var dotX   = isMobile ? 29 : 73;
        var startX = isMobile ? Math.round(svgW * 0.55) : Math.round(svgW * 0.5);
        var zigY   = Math.round(headerH * 0.82);
        var d = '';

        if (isMobile) {
            d = 'M ' + dotX + ',' + headerH
              + ' L ' + dotX + ',' + svgH;
            railMetrics = { mode: 'single', zigY: headerH };
        } else {
            var pivotSlide = document.getElementById('tl-3');
            var pivotIndex = slides.findIndex(function(s) { return s.id === 'tl-3'; });
            var leftX  = 73;
            var rightX = svgW - 112;
            // Use offsetTop (natural position) instead of getBoundingClientRect
            // so the pivot is correct even after scrolling
            var pivotY = pivotIndex >= 0 && pivotSlide
                ? Math.max(zigY + 48, Math.round(pivotSlide.offsetTop + pivotSlide.offsetHeight * 0.12))
                : Math.round(svgH * 0.4);
            var topHookW = Math.abs(startX - leftX);
            var crossLen = Math.abs(rightX - leftX);

            d = 'M ' + startX + ',0'
              + ' L ' + startX + ',' + zigY
              + ' L ' + leftX  + ',' + zigY
              + ' L ' + leftX  + ',' + pivotY
              + ' L ' + rightX + ',' + pivotY
              + ' L ' + rightX + ',' + svgH;

            railMetrics = { mode: 'zig', zigY: zigY, pivotY: pivotY, topHookW: topHookW, crossLen: crossLen };
        }

        if (pathFg) {
            pathFg.setAttribute('d', d);
            totalLen = pathFg.getTotalLength();
            pathFg.style.strokeDasharray  = totalLen;
            pathFg.style.strokeDashoffset = totalLen;
        }
    }

    // ── Lerp state ───────────────────────────────────────────────────────────
    var currentLen = 0;
    var targetLen  = 0;
    var rafId      = null;
    var MIN_ACTIVE_MS = 350;
    var activeSince   = new Array(slides.length).fill(0);
    var checkpointLens = [];

    var pivotIndex = slides.findIndex(function(s) { return s.id === 'tl-2'; });

    function yToLen(y) {
        if (!railMetrics || totalLen === 0) return 0;
        var len = 0;
        if (railMetrics.mode === 'zig') {
            var bendLen = railMetrics.zigY + railMetrics.topHookW
                + (railMetrics.pivotY - railMetrics.zigY) + railMetrics.crossLen;
            if (y <= railMetrics.zigY) {
                len = Math.max(0, y);
            } else if (y <= railMetrics.pivotY) {
                len = railMetrics.zigY + railMetrics.topHookW + (y - railMetrics.zigY);
            } else {
                len = bendLen + (y - railMetrics.pivotY);
            }
        } else {
            len = Math.max(0, y - railMetrics.zigY);
        }
        return Math.min(totalLen, Math.max(0, len));
    }

    function computeCheckpoints() {
        var sectionTopAbs = section.getBoundingClientRect().top + window.scrollY;
        checkpointLens = slides.map(function(slide) {
            var dotDiv = slide.querySelector('.tl-dot');
            var dotY;
            if (dotDiv) {
                var r = dotDiv.getBoundingClientRect();
                dotY = r.top + window.scrollY + r.height * 0.5 - sectionTopAbs;
            } else {
                dotY = (slide.getBoundingClientRect().top + window.scrollY)
                    + slide.offsetHeight * 0.5 - sectionTopAbs;
            }
            return yToLen(dotY);
        });
    }

    function computeTargetLen() {
        if (!pathFg || totalLen === 0) return 0;
        var isMobile  = window.innerWidth <= 768;
        var vpFactor  = isMobile ? 0.72 : 0.5; // mobile: ativa checkpoints mais cedo
        var secTopAbs = section.getBoundingClientRect().top + window.scrollY;
        var scrollY   = window.scrollY - secTopAbs + window.innerHeight * vpFactor;
        var len = yToLen(scrollY);

        if (railMetrics && railMetrics.mode === 'zig') {
            var bendLen = railMetrics.zigY + railMetrics.topHookW
                + (railMetrics.pivotY - railMetrics.zigY) + railMetrics.crossLen;
            var ci = -1;
            slides.forEach(function(slide, i) {
                if (slide.getBoundingClientRect().top <= 2) ci = i;
            });
            if (pivotIndex >= 0 && ci >= pivotIndex) len = Math.max(len, bendLen);
        }

        return Math.min(totalLen, Math.max(0, len));
    }

    function renderLine() {
        var LERP = 0.09;
        currentLen += (targetLen - currentLen) * LERP;
        var diff = Math.abs(targetLen - currentLen);
        if (diff < 0.4) currentLen = targetLen;

        var lastCheckLen = checkpointLens.length > 0 ? checkpointLens[checkpointLens.length - 1] : totalLen;
        if (pathFg) pathFg.style.strokeDashoffset = totalLen - Math.min(currentLen, lastCheckLen);

        if (mobileLineEl && railMetrics) {
            var headerH  = railMetrics.zigY || 0;
            var lastLen  = checkpointLens.length > 0
                ? checkpointLens[checkpointLens.length - 1]
                : totalLen;
            var lineLen  = Math.min(currentLen, lastLen);
            mobileLineEl.style.top    = headerH + 'px';
            mobileLineEl.style.height = lineLen + 'px';
        }

        if (dotEl && pathFg && window.innerWidth > 768) {
            if (currentLen > 2) {
                var pt = pathFg.getPointAtLength(currentLen);
                dotEl.setAttribute('cx', pt.x);
                dotEl.setAttribute('cy', pt.y);
                dotEl.style.display = '';
            } else {
                dotEl.style.display = 'none';
            }
        }

        var now = Date.now();
        var currentIndex = -1;
        slides.forEach(function(slide, i) {
            var reached = checkpointLens[i] !== undefined && currentLen >= checkpointLens[i];
            if (reached) {
                if (!slide.classList.contains('active')) activeSince[i] = now;
                slide.classList.add('active');
                currentIndex = i;
            } else {
                slide.classList.remove('active');
                slide.classList.remove('covered');
                activeSince[i] = 0;
            }
        });

        slides.forEach(function(slide, i) {
            if (i < currentIndex) {
                if (now - (activeSince[i] || now) >= MIN_ACTIVE_MS) slide.classList.add('covered');
            } else if (i === currentIndex) {
                slide.classList.remove('covered');
            }
        });

        if (diff > 0.4) {
            rafId = requestAnimationFrame(renderLine);
        } else {
            rafId = null;
        }
    }

    // ── Scroll-snap helpers ──────────────────────────────────────────────────
    function isDesktopLockEnabled() {
        return window.innerWidth > 1024
            && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getSectionTop() {
        return window.scrollY + section.getBoundingClientRect().top;
    }

    function getSlideTop(index) {
        return getSectionTop() + slides[index].offsetTop;
    }

    function getNearestSlideIndex() {
        var anchor = window.scrollY + window.innerHeight * 0.38;
        var best = 0;
        var bestDist = Infinity;
        slides.forEach(function(slide, i) {
            var dist = Math.abs((getSectionTop() + slide.offsetTop) - anchor);
            if (dist < bestDist) { bestDist = dist; best = i; }
        });
        return best;
    }

    function isInsideTimelineLockZone() {
        var top    = getSectionTop();
        var bottom = top + section.offsetHeight;
        var y = window.scrollY;
        return y >= (top - 80) && y <= (bottom - window.innerHeight + 80);
    }

    // ── Wheel handler — accumulates delta to prevent inertia skipping ────────
    var accumDelta   = 0;
    var lastWheelTime = 0;
    var DELTA_THRESHOLD = 40; // accumulated px before advancing a slide

    function handleTimelineWheel(event) {
        if (!isDesktopLockEnabled()) return;
        if (!isInsideTimelineLockZone()) return;

        var currentIndex = getNearestSlideIndex();
        var direction    = event.deltaY > 0 ? 1 : -1;

        // Allow natural exit at section boundaries
        if (direction < 0 && currentIndex === 0
            && window.scrollY <= getSlideTop(0) + 12) return;
        if (direction > 0 && currentIndex === slides.length - 1
            && window.scrollY >= getSlideTop(slides.length - 1) - 12) return;

        // We are in the lock zone and not at a boundary — take over scroll
        event.preventDefault();

        // While locked, absorb all events (prevents inertia from skipping slides)
        if (lockActive) return;

        // Accumulate delta — trackpad fires many small events; mouse fires one large one
        var now = Date.now();
        if (now - lastWheelTime > 300) accumDelta = 0; // reset on idle
        lastWheelTime = now;
        accumDelta += event.deltaY;

        if (Math.abs(accumDelta) < DELTA_THRESHOLD) return; // wait for enough intent

        var dir = accumDelta > 0 ? 1 : -1;
        accumDelta = 0; // reset after acting

        var currentTop = getSlideTop(currentIndex);
        var isAligned  = Math.abs(window.scrollY - currentTop) < 12;
        var targetIndex = isAligned
            ? currentIndex + dir
            : (dir > 0 ? currentIndex : Math.max(0, currentIndex - 1));
        targetIndex = Math.max(0, Math.min(slides.length - 1, targetIndex));

        lockToSlide(targetIndex);
    }

    // ── Settle-snap (keyboard / programmatic scroll) ─────────────────────────
    var settleTimer = null;

    function scheduleSettleSnap() {
        if (!isDesktopLockEnabled()) return;
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(function() {
            if (lockActive || !isInsideTimelineLockZone()) return;
            var nearestIndex = getNearestSlideIndex();
            var nearestTop   = getSlideTop(nearestIndex);
            if (Math.abs(window.scrollY - nearestTop) > 14) {
                lockToSlide(nearestIndex);
            }
        }, 200);
    }

    // ── Update ───────────────────────────────────────────────────────────────
    function update() {
        targetLen = computeTargetLen();
        if (!rafId) rafId = requestAnimationFrame(renderLine);
    }

    function initTimeline() {
        buildPath();
        computeCheckpoints();
        update();
        // Re-run after layout settles (fonts, images)
        setTimeout(function() { buildPath(); computeCheckpoints(); update(); }, 300);
    }

    if (document.readyState === 'complete') {
        initTimeline();
    } else {
        window.addEventListener('load', initTimeline);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', scheduleSettleSnap, { passive: true });
    window.addEventListener('resize', function() { buildPath(); computeCheckpoints(); update(); });
    window.addEventListener('wheel', handleTimelineWheel, { passive: false });
})();

// UI: Timeline animation — sobre.html
// â”€â”€ Timeline: sticky stacking + zigzag SVG rail â”€â”€
(function() {
    var section = document.getElementById('timeline-section');
    var slides  = Array.from(document.querySelectorAll('.tl-slide'));
    var pathFg      = document.getElementById('tl-zigzag-fg');
    var dotEl       = document.getElementById('tl-dot');
    var mobileLineEl = document.getElementById('tl-mobile-line');

    if (!section || !slides.length) return;

    // z-index não necessário sem sticky stacking

    var totalLen = 0;
    var railMetrics = null;
    var scrollLock = {
        active: false,
        targetY: 0,
        releaseAt: 0
    };
    var scrollSettleTimer = null;

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
            var hookW = startX - dotX;
            d = 'M ' + dotX + ',' + headerH
              + ' L ' + dotX + ',' + svgH;

            railMetrics = {
                mode: 'single',
                zigY: headerH,
                hookW: hookW
            };
        } else {
            var pivotSlide = document.getElementById('tl-3');
            var pivotIndex = slides.findIndex(function(slide) { return slide.id === 'tl-3'; });
            var pivotYear = pivotSlide ? pivotSlide.querySelector('.tl-year') : null;
            var sectionRect = section.getBoundingClientRect();
            var leftX = 73;
            var rightX = svgW - 112;
            var slideH = pivotSlide ? pivotSlide.offsetHeight : window.innerHeight;
            var pivotY = pivotIndex >= 0
                ? (
                    pivotYear
                        ? Math.max(
                            zigY + 48,
                            Math.round(pivotYear.getBoundingClientRect().top - sectionRect.top - 156)
                        )
                        : Math.round(headerH + (pivotIndex * slideH) + (slideH * 0.12))
                  )
                : Math.round(svgH * 0.4);
            var topHookW = Math.abs(startX - leftX);
            var crossLen = Math.abs(rightX - leftX);

            d = 'M ' + startX + ',0'
              + ' L ' + startX + ',' + zigY
              + ' L ' + leftX  + ',' + zigY
              + ' L ' + leftX  + ',' + pivotY
              + ' L ' + rightX + ',' + pivotY
              + ' L ' + rightX + ',' + svgH;

            railMetrics = {
                mode: 'zig',
                zigY: zigY,
                pivotY: pivotY,
                topHookW: topHookW,
                crossLen: crossLen
            };
        }

        if (pathFg) {
            pathFg.setAttribute('d', d);
            totalLen = pathFg.getTotalLength();
            pathFg.style.strokeDasharray  = totalLen;
            pathFg.style.strokeDashoffset = totalLen;
        }
    }

    var MIN_ACTIVE_MS = 350;
    var activeSince   = new Array(slides.length).fill(0);

    // Lerp state
    var currentLen     = 0;
    var targetLen      = 0;
    var rafId          = null;
    var checkpointLens = []; // path length at each slide's dot

    var pivotIndex = slides.findIndex(function(slide) { return slide.id === 'tl-2'; });

    // Convert a Y position (relative to section top) to path length
    function yToLen(y) {
        if (!railMetrics || totalLen === 0) return 0;
        var len = 0;
        if (railMetrics.mode === 'zig') {
            var bendLen = railMetrics.zigY
                + railMetrics.topHookW
                + (railMetrics.pivotY - railMetrics.zigY)
                + railMetrics.crossLen;
            if (y <= railMetrics.zigY) {
                len = Math.max(0, y);
            } else if (y <= railMetrics.pivotY) {
                len = railMetrics.zigY + railMetrics.topHookW + (y - railMetrics.zigY);
            } else {
                len = bendLen + (y - railMetrics.pivotY);
            }
        } else if (railMetrics) {
            // Mobile: linha vertical começa em zigY (= headerH)
            len = Math.max(0, y - railMetrics.zigY);
        }
        return Math.min(totalLen, Math.max(0, len));
    }

    // Pre-compute path length using the actual .tl-dot element position
    function computeCheckpoints() {
        var sectionTopAbs = section.getBoundingClientRect().top + window.scrollY;
        checkpointLens = slides.map(function(slide) {
            var dotDiv = slide.querySelector('.tl-dot');
            var dotY;
            if (dotDiv) {
                var r = dotDiv.getBoundingClientRect();
                dotY = r.top + window.scrollY + r.height * 0.5 - sectionTopAbs;
            } else {
                dotY = (slide.getBoundingClientRect().top + window.scrollY) + slide.offsetHeight * 0.5 - sectionTopAbs;
            }
            return yToLen(dotY);
        });
    }

    function computeTargetLen() {
        if (!pathFg || totalLen === 0) return 0;
        var secTopAbs = section.getBoundingClientRect().top + window.scrollY;
        var scrollY   = window.scrollY - secTopAbs + window.innerHeight * 0.5;
        var len = yToLen(scrollY);

        // Once past pivot slide, guarantee the bend is fully drawn
        if (railMetrics && railMetrics.mode === 'zig') {
            var bendLen = railMetrics.zigY
                + railMetrics.topHookW
                + (railMetrics.pivotY - railMetrics.zigY)
                + railMetrics.crossLen;
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

        // Draw line (desktop SVG)
        if (pathFg) pathFg.style.strokeDashoffset = totalLen - currentLen;

        // Draw line (mobile div)
        if (mobileLineEl && railMetrics) {
            var headerH = railMetrics.zigY || 0;
            mobileLineEl.style.height = (headerH + currentLen) + 'px';
        }

        // Move dot circle (desktop only)
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

        // Activate slides when dot reaches their checkpoint
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

    function isDesktopTimelineLockEnabled() {
        return window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getSectionTop() {
        return window.scrollY + section.getBoundingClientRect().top;
    }

    function getSectionBottom() {
        return getSectionTop() + section.offsetHeight;
    }

    function getSlideTop(index) {
        return getSectionTop() + slides[index].offsetTop;
    }

    function getNearestSlideIndex() {
        var anchor = window.scrollY + (window.innerHeight * 0.38);
        var bestIndex = 0;
        var bestDistance = Infinity;
        slides.forEach(function(slide, index) {
            var distance = Math.abs((getSectionTop() + slide.offsetTop) - anchor);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = index;
            }
        });
        return bestIndex;
    }

    function isInsideTimelineLockZone() {
        var top = getSectionTop();
        var bottom = getSectionBottom();
        var y = window.scrollY;
        return y >= (top - 80) && y <= (bottom - window.innerHeight + 80);
    }

    function releaseScrollLockIfReached() {
        if (!scrollLock.active) return;
        var closeEnough = Math.abs(window.scrollY - scrollLock.targetY) < 6;
        var timedOut = Date.now() >= scrollLock.releaseAt;
        if (closeEnough || timedOut) scrollLock.active = false;
    }

    function lockToSlide(targetIndex) {
        scrollLock.active = true;
        scrollLock.targetY = getSlideTop(targetIndex);
        scrollLock.releaseAt = Date.now() + 950;
        window.scrollTo({ top: scrollLock.targetY, behavior: 'smooth' });
    }

    function scheduleScrollSnap() {
        if (!isDesktopTimelineLockEnabled()) return;
        if (scrollSettleTimer) clearTimeout(scrollSettleTimer);

        scrollSettleTimer = setTimeout(function() {
            releaseScrollLockIfReached();
            if (scrollLock.active || !isInsideTimelineLockZone()) return;

            var nearestIndex = getNearestSlideIndex();
            var nearestTop = getSlideTop(nearestIndex);
            if (Math.abs(window.scrollY - nearestTop) > 14) {
                lockToSlide(nearestIndex);
            }
        }, 90);
    }

    function handleTimelineWheel(event) {
        if (!isDesktopTimelineLockEnabled()) return;

        releaseScrollLockIfReached();
        if (scrollLock.active) {
            event.preventDefault();
            return;
        }

        if (!isInsideTimelineLockZone()) return;

        var delta = event.deltaY;
        if (Math.abs(delta) < 8) return;

        var currentIndex = getNearestSlideIndex();
        var currentTop = getSlideTop(currentIndex);
        var direction = delta > 0 ? 1 : -1;
        var isAligned = Math.abs(window.scrollY - currentTop) < 10;
        var targetIndex = isAligned ? currentIndex + direction : (direction > 0 ? currentIndex : Math.max(0, currentIndex - 1));
        targetIndex = Math.max(0, Math.min(slides.length - 1, targetIndex));

        if ((currentIndex === 0 && direction < 0 && window.scrollY <= currentTop + 4) ||
            (currentIndex === slides.length - 1 && direction > 0 && window.scrollY >= currentTop - 4)) {
            return;
        }

        event.preventDefault();
        lockToSlide(targetIndex);
    }

    function update() {
        targetLen = computeTargetLen();
        if (!rafId) rafId = requestAnimationFrame(renderLine);
    }

    function initTimeline() {
        buildPath(); computeCheckpoints(); update();
        // Re-executa após 300ms para garantir layout correto no mobile
        setTimeout(function() { buildPath(); computeCheckpoints(); update(); }, 300);
    }
    if (document.readyState === 'complete') {
        initTimeline();
    } else {
        window.addEventListener('load', initTimeline);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', releaseScrollLockIfReached, { passive: true });
    window.addEventListener('scroll', scheduleScrollSnap, { passive: true });
    window.addEventListener('resize', function() { buildPath(); computeCheckpoints(); update(); });
    window.addEventListener('wheel', handleTimelineWheel, { passive: false });
})();

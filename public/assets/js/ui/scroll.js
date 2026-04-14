// UI: Smooth scroll utilities and Lenis initialization

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

// Initialize Lenis (the CDN script loads before this file)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

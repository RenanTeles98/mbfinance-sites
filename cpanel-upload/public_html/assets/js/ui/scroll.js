// UI: Smooth scroll utilities (native CSS scroll-behavior handles global smooth scroll)

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

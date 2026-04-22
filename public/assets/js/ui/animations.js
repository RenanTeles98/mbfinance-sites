// UI: Visual animations - parallax, scroll-triggered steps, marquee carousel

// ── Parallax ────────────────────────────────────────────────────────────────
function updateParallax() {
    const windowH = window.innerHeight;

    // Hero background
    const hero = document.getElementById('parallax-hero');
    if (hero) {
        const scrollY = window.scrollY;
        hero.style.transform = `translateY(${scrollY * 0.22}px) scale(1.5)`;
    }

    // Cidade / Rio (Como Funciona)
    const cidade = document.getElementById('parallax-cidade');
    if (cidade) {
        const rect = cidade.closest('section').getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2) - windowH / 2;
        cidade.style.transform = `translateY(${centerOffset * 0.22}px) scale(1.5)`;
    }
}
window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

// ── Como Funciona: step animation ───────────────────────────────────────────
(function(){
    var line = document.querySelector('.cf-line');
    var section = document.getElementById('como-funciona');
    var triggered = false;
    var stepDelay = 500; // ms entre cada step

    function showStep(i) {
        var step = document.getElementById('cf-step-' + i);
        if (!step) return;
        step.classList.add('visible');
        var dot = step.querySelector('.cf-dot');
        if (dot) dot.classList.add('visible');
    }

    function runSequence() {
        if (triggered) return;
        triggered = true;
        if (line) line.classList.add('visible');
        showStep(1);
        setTimeout(function(){ showStep(2); }, stepDelay);
        setTimeout(function(){ showStep(3); }, stepDelay * 2);
        setTimeout(function(){ showStep(4); }, stepDelay * 3);
    }

    function checkScroll() {
        if (triggered) return;
        var rect = section.getBoundingClientRect();
        // Dispara quando o topo da seção entra na metade inferior do viewport
        if (rect.top <= window.innerHeight * 0.75) {
            runSequence();
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
})();

// ── Marquee carousel — handled entirely by CSS @keyframes (see main.css) ──────
// JS not needed: animation runs on browser compositor thread (smoother, no rAF).

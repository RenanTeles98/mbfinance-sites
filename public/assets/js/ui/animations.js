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
    var grid = document.querySelector('#como-funciona .grid');
    var section = document.getElementById('como-funciona');
    var currentStep = 0;
    var stepAnchors = [0.5, 0.34, 0.18, 0.04];

    function applySteps(n) {
        currentStep = Math.max(0, Math.min(4, n));
        if (line) line.classList.toggle('visible', currentStep > 0);
        [1,2,3,4].forEach(function(i){
            var step = document.getElementById('cf-step-' + i);
            if (!step) return;
            var on = i <= currentStep;
            step.classList.toggle('visible', on);
            var dot = step.querySelector('.cf-dot');
            if (dot) dot.classList.toggle('visible', on);
        });
    }

    function getStepFromScroll() {
        var rect = section.getBoundingClientRect();
        var windowH = window.innerHeight;
        var step = 0;

        stepAnchors.forEach(function(anchor, index){
            if (rect.top <= windowH * anchor) step = index + 1;
        });

        return step;
    }

    // Scroll normal da página
    function checkScroll() {
        applySteps(getStepFromScroll());
    }

    // Scroll do mouse sobre a seção: página trava, etapas avançam/regridem
    function onWheel(e) {
        var now = Date.now();
        var goingDown = e.deltaY > 0;
        var goingUp   = e.deltaY < 0;

        // Se chegou no fim e quer descer, ou no início e quer subir → libera a página
        if ((goingDown && currentStep >= 4) || (goingUp && currentStep <= 0)) {
            isHovering = false;
            window.removeEventListener('wheel', onWheel);
            return; // não chama preventDefault → página rola normalmente
        }

        e.preventDefault();
        if (now - lastWheelStepAt < wheelStepCooldown) return;

        if ((wheelDeltaAccumulator > 0 && goingUp) || (wheelDeltaAccumulator < 0 && goingDown)) {
            wheelDeltaAccumulator = 0;
        }

        wheelDeltaAccumulator += e.deltaY;

        if (Math.abs(wheelDeltaAccumulator) < wheelStepThreshold) return;

        applySteps(currentStep + (wheelDeltaAccumulator > 0 ? 1 : -1));
        lastWheelStepAt = now;
        wheelDeltaAccumulator = 0;
    }

    // Só ativa o wheel interativo em desktop (sem touch)
    if (false) {
        section.addEventListener('mouseenter', function(){
            isHovering = true;
            currentStep = getStepFromScroll();
            wheelDeltaAccumulator = 0;
            lastWheelStepAt = 0;
            window.addEventListener('wheel', onWheel, { passive: false });
        });
        section.addEventListener('mouseleave', function(){
            isHovering = false;
            wheelDeltaAccumulator = 0;
            lastWheelStepAt = 0;
            window.removeEventListener('wheel', onWheel);
        });
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
})();

// ── Marquee carousel — handled entirely by CSS @keyframes (see main.css) ──────
// JS not needed: animation runs on browser compositor thread (smoother, no rAF).

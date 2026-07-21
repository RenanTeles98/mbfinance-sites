// UI: Fade-up on scroll + counter animation — sobre.html

const _fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.fade-up').forEach(function(el) { _fadeObserver.observe(el); });

window.addEventListener('load', function() {
    var vH = window.innerHeight;
    document.querySelectorAll('.fade-up').forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top < vH && r.bottom > 0) el.classList.add('visible');
    });
});

function animateCounter(el) {
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var duration = 2000;
    var steps = 60;
    var increment = target / steps;
    var count = 0;
    var timer = setInterval(function() {
        count += increment;
        if (count >= target) { count = target; clearInterval(timer); }
        var display = target >= 1000 ? Math.floor(count).toLocaleString('pt-BR') : Math.floor(count);
        el.textContent = display + suffix;
    }, duration / steps);
}

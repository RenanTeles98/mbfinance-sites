// Landing produto — fade-up IntersectionObserver + FAQ toggle

// ── Fade-up ─────────────────────────────────────────────────────────────────
(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
        observer.observe(el);
    });
})();

// ── FAQ toggle ──────────────────────────────────────────────────────────────
window.toggleFaq = function (btn) {
    var item = btn.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
};

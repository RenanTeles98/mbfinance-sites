// UI: Navbar scroll effect, mobile menu, products dropdown

document.addEventListener('DOMContentLoaded', function() {

    // ── Navbar scroll effect (logo change + scrolled class) ──────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let isHovered = false;

        function updateNav() {
            const isScrolled = window.scrollY > 80;
            const shouldBeScrolled = isScrolled || isHovered;

            navbar.classList.toggle('scrolled', shouldBeScrolled);
            
            const logoImg = document.getElementById('logo-img');
            if (logoImg) {
                const logoNormal   = logoImg.dataset.logoNormal   || 'images/logo-horizontal-logo.branca.png';
                const logoScrolled = logoImg.dataset.logoScrolled || 'images/logo-horizontal-logo.png.png';
                logoImg.src = shouldBeScrolled ? logoScrolled : logoNormal;
            }
        }

        navbar.addEventListener('mouseenter', () => {
            isHovered = true;
            updateNav();
        });

        navbar.addEventListener('mouseleave', () => {
            isHovered = false;
            updateNav();
        });

        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav();
    }

    // ── Mobile menu ───────────────────────────────────────────────────────
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const whatsappFloat = document.getElementById('whatsapp-float');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (whatsappFloat) whatsappFloat.classList.add('is-hidden');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        if (whatsappFloat) whatsappFloat.classList.remove('is-hidden');
    }

    // Expose globally — called from inline onclick in anchors
    window.closeMobileMenu = closeMobileMenu;

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // ── Products dropdown ─────────────────────────────────────────────────
    const dropdown        = document.getElementById('produtos-dropdown');
    const megaMenuWrapper = document.getElementById('mega-menu-wrapper');
    const megaChevron     = document.getElementById('mega-menu-chevron');
    let ddHideTimer       = null;

    function showDropdown() {
        clearTimeout(ddHideTimer);
        if (dropdown) dropdown.classList.add('open');
        if (megaChevron) megaChevron.style.transform = 'rotate(180deg)';
    }

    function hideDropdown() {
        ddHideTimer = setTimeout(() => {
            if (dropdown) dropdown.classList.remove('open');
            if (megaChevron) megaChevron.style.transform = '';
        }, 120);
    }

    if (megaMenuWrapper) {
        megaMenuWrapper.addEventListener('mouseenter', showDropdown);
        megaMenuWrapper.addEventListener('mouseleave', hideDropdown);
    }
    if (dropdown) {
        dropdown.addEventListener('mouseenter', showDropdown);
        dropdown.addEventListener('mouseleave', hideDropdown);
    }

    // Expose globally — called from inline onclick (closeProdDropdown)
    window.closeProdDropdown = function() {
        if (dropdown) dropdown.classList.remove('open');
        if (megaChevron) megaChevron.style.transform = '';
    };

});

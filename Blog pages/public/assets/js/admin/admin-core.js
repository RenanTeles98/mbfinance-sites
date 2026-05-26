/**
 * Admin Dashboard - Core Orchestrator
 */

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function login() {
    const pass = document.getElementById('auth-pass').value;
    const error = document.getElementById('auth-error');
    const hash = await sha256(pass);

    if (hash === window.PASSWORD_HASH) {
        localStorage.setItem('mb_admin_auth', 'true');
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('admin-app').style.display = 'flex';
        init(); // Re-run init to load data
    } else {
        error.style.display = 'block';
    }
}

function init() {
    const authStatus = localStorage.getItem('mb_admin_auth');
    
    // Se não estiver logado, garante que a tela de auth está visível e o app escondido
    if (!authStatus) {
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('admin-app').style.display = 'none';
        return;
    }

    // Se estiver logado, esconde auth e mostra app
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    initSidebarResize();

    // Carregar posts (do admin-blog.js)
    if (typeof loadPosts === 'function') loadPosts();
    
    // Atualizar UI do link oficial
    if (typeof updateOfficialBlogUi === 'function') updateOfficialBlogUi();

    // Como métricas é o padrão (tela ativa no HTML), renderiza agora
    if (typeof renderAnalytics === 'function') renderAnalytics();
}

function initSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');
    const screen = document.getElementById('screen-posts');
    if (!sidebar || !resizer || !screen || resizer.dataset.ready === 'true') return;

    const storageKey = 'mb_admin_posts_sidebar_width';
    const minWidth = 300;
    const maxWidth = 560;

    function getMaxWidth() {
        return Math.min(maxWidth, Math.max(minWidth, Math.floor(window.innerWidth * 0.45)));
    }

    function applyWidth(width) {
        const nextWidth = Math.max(minWidth, Math.min(getMaxWidth(), Math.round(width)));
        sidebar.style.width = nextWidth + 'px';
        resizer.setAttribute('aria-valuenow', String(nextWidth));
        return nextWidth;
    }

    resizer.setAttribute('aria-valuemin', String(minWidth));
    resizer.setAttribute('aria-valuemax', String(maxWidth));

    const savedWidth = Number(localStorage.getItem(storageKey));
    if (window.innerWidth > 980) {
        applyWidth(savedWidth || sidebar.getBoundingClientRect().width);
    }

    resizer.addEventListener('pointerdown', function(event) {
        if (window.innerWidth <= 980) return;
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = sidebar.getBoundingClientRect().width;
        document.body.classList.add('resizing-sidebar');

        function onPointerMove(moveEvent) {
            const nextWidth = applyWidth(startWidth + moveEvent.clientX - startX);
            localStorage.setItem(storageKey, String(nextWidth));
        }

        function stopResize() {
            document.body.classList.remove('resizing-sidebar');
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', stopResize);
            document.removeEventListener('pointercancel', stopResize);
        }

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', stopResize);
        document.addEventListener('pointercancel', stopResize);
    });

    resizer.addEventListener('keydown', function(event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const currentWidth = sidebar.getBoundingClientRect().width;
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextWidth = applyWidth(currentWidth + direction * 24);
        localStorage.setItem(storageKey, String(nextWidth));
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 980) {
            const savedWidth = Number(localStorage.getItem(storageKey));
            applyWidth(savedWidth || sidebar.getBoundingClientRect().width);
        } else {
            sidebar.style.width = '';
        }
    });

    resizer.dataset.ready = 'true';
}

function switchTab(id) {
    // Esconder todas as telas
    document.querySelectorAll('.admin-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(l => l.classList.remove('active'));

    // Mostrar alvo
    let target = document.getElementById('screen-' + id);
    let btn = document.getElementById('tabBtn-' + id);

    if (!target) {
        id = 'analytics';
        target = document.getElementById('screen-analytics');
        btn = document.getElementById('tabBtn-analytics');
    }
    
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');

    // Inicialização específica de cada aba
    if (id === 'calendar' && typeof renderCalendar === 'function') renderCalendar();
    if (id === 'analytics' && typeof renderAnalytics === 'function') renderAnalytics();
    if (id === 'campaigns' && typeof renderCampaigns === 'function') renderCampaigns();
    if (id === 'newsletter' && typeof updateNewsletterList === 'function') updateNewsletterList();
    if (id === 'banners' && typeof loadBanners === 'function') loadBanners();
}

function logout() {
    if (confirm('Deseja sair do painel administrativo?')) {
        localStorage.removeItem('mb_admin_auth');
        window.location.href = '../mb-finance-completo.html';
    }
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', init);

// Export to window
window.login = login;
window.switchTab = switchTab;
window.logout = logout;

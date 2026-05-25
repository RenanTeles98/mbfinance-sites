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

const ADMIN_TAB_STORAGE_KEY = 'mb_admin_active_tab';
const ADMIN_TABS = ['analytics', 'campaigns', 'posts', 'newsletter', 'banners'];

function getInitialTab() {
    const hashTab = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
    if (ADMIN_TABS.indexOf(hashTab) !== -1) return hashTab;

    const savedTab = localStorage.getItem(ADMIN_TAB_STORAGE_KEY);
    if (ADMIN_TABS.indexOf(savedTab) !== -1) return savedTab;

    return 'analytics';
}

function persistActiveTab(id) {
    if (ADMIN_TABS.indexOf(id) === -1) return;
    localStorage.setItem(ADMIN_TAB_STORAGE_KEY, id);

    const nextHash = '#' + id;
    if (window.location.hash !== nextHash && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', nextHash);
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

    // Carregar posts e métricas do blog
    if (typeof loadPosts === 'function') loadPosts();
    if (typeof renderEditorialAnalytics === 'function') renderEditorialAnalytics();
    
    // Atualizar UI do link oficial
    if (typeof updateOfficialBlogUi === 'function') updateOfficialBlogUi();

    // Como métricas é o padrão (tela ativa no HTML), renderiza agora
    switchTab(getInitialTab());
}

function switchTab(id) {
    if (ADMIN_TABS.indexOf(id) === -1) id = 'analytics';

    // Esconder todas as telas
    document.querySelectorAll('.admin-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(l => l.classList.remove('active'));

    // Mostrar alvo
    const target = document.getElementById('screen-' + id);
    const btn = document.getElementById('tabBtn-' + id);
    
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');
    persistActiveTab(id);

    // Inicialização específica de cada aba
    if (id === 'calendar' && typeof renderCalendar === 'function') renderCalendar();
    if (id === 'analytics' && typeof renderAnalytics === 'function') renderAnalytics();
    if (id === 'posts' && typeof renderEditorialAnalytics === 'function') renderEditorialAnalytics();
    if (id === 'newsletter' && typeof updateNewsletterList === 'function') updateNewsletterList();
    if (id === 'banners' && typeof loadBanners === 'function') loadBanners();
    if (id === 'campaigns' && typeof initCampaigns === 'function') initCampaigns();
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

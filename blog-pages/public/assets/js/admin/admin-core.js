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

    // Carregar posts (do admin-blog.js)
    if (typeof loadPosts === 'function') loadPosts();
    
    // Atualizar UI do link oficial
    if (typeof updateOfficialBlogUi === 'function') updateOfficialBlogUi();

    // Como métricas é o padrão (tela ativa no HTML), renderiza agora
    if (typeof renderAnalytics === 'function') renderAnalytics();
}

function switchTab(id) {
    // Esconder todas as telas
    document.querySelectorAll('.admin-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(l => l.classList.remove('active'));

    // Mostrar alvo
    const target = document.getElementById('screen-' + id);
    const btn = document.getElementById('tabBtn-' + id);
    
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');

    // Inicialização específica de cada aba
    if (id === 'calendar' && typeof renderCalendar === 'function') renderCalendar();
    if (id === 'analytics' && typeof renderAnalytics === 'function') renderAnalytics();
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

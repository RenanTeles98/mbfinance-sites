/**
 * Admin Dashboard - Core Orchestrator
 */

function init() {
    // Authenticaion check
    const authStatus = localStorage.getItem('mb_admin_auth');
    if (!authStatus) {
        window.location.href = '../mb-finance-completo.html';
        return;
    }

    // Carregar posts (do admin-blog.js)
    if (typeof loadPosts === 'function') loadPosts();
    
    // Atualizar UI do link oficial
    if (typeof updateOfficialBlogUi === 'function') updateOfficialBlogUi();

    // Setup de abas
    setupTabs();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });
}

function switchTab(id) {
    // Esconder todas as telas
    document.querySelectorAll('.admin-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Mostrar alvo
    const target = document.getElementById('screen-' + id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    
    if (target) target.classList.add('active');
    if (link) link.classList.add('active');

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
window.switchTab = switchTab;
window.logout = logout;

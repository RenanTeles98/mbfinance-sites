/**
 * Admin Dashboard - Analytics (GA4 Integration)
 */

function getAnalyticsApiUrl() {
    const base = (localStorage.getItem('mb_site_domain') || '').replace(/\/$/, '');
    if (base) return base + '/api/analytics/overview';
    return '/api/analytics/overview';
}

async function renderTrafficAnalytics() {
    const totalUsersEl = document.getElementById('ga-total-users');
    if (!totalUsersEl) return;

    totalUsersEl.textContent = '--';
    document.getElementById('ga-active-users').textContent = '--';
    document.getElementById('ga-sessions').textContent = '--';
    document.getElementById('ga-pageviews').textContent = '--';
    document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">Carregando dados do Google Analytics...</div>';
    document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Carregando paginas mais acessadas...</div>';
    document.getElementById('ga-highlights').innerHTML = '<div class="analytics-empty">Carregando indicadores de trafego...</div>';
    document.getElementById('ga-top-countries').innerHTML = '<div class="analytics-empty">Carregando paises com mais acessos...</div>';
    document.getElementById('ga-top-regions').innerHTML = '<div class="analytics-empty">Carregando estados e regioes...</div>';
    document.getElementById('ga-gender-breakdown').innerHTML = '<div class="analytics-empty">Carregando genero...</div>';
    document.getElementById('ga-age-breakdown').innerHTML = '<div class="analytics-empty">Carregando faixa etaria...</div>';

    try {
        const response = await fetch(getAnalyticsApiUrl(), { cache: 'no-store' });
        const data = await response.json();
        window.analyticsData = data; // Global for renderSidebar to use

        if (!response.ok || !data || !data.configured || !data.summary) {
            const message = (data && data.error) ? data.error : 'GA4 nao configurado ou sem acesso liberado.';
            document.getElementById('analytics-last-update').textContent = 'GA4 indisponivel';
            document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">' + esc(message) + '</div>';
            document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Sem dados reais de trafego por enquanto.</div>';
            document.getElementById('ga-highlights').innerHTML = '<div class="analytics-empty">Configure as variaveis do GA4 no Vercel e confirme o acesso da service account na propriedade.</div>';
            document.getElementById('ga-top-countries').innerHTML = '<div class="analytics-empty">Sem dados geograficos disponiveis ainda.</div>';
            document.getElementById('ga-top-regions').innerHTML = '<div class="analytics-empty">Sem dados regionais disponiveis ainda.</div>';
            document.getElementById('ga-gender-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de genero disponiveis ainda.</div>';
            document.getElementById('ga-age-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de idade disponiveis ainda.</div>';
            return;
        }

        const summary = data.summary || {};
        if (typeof renderSidebar === 'function') renderSidebar(false);

        const trend = Array.isArray(data.trend) ? data.trend : [];
        const topPages = Array.isArray(data.topPages) ? data.topPages : [];
        const topCountries = Array.isArray(data.topCountries) ? data.topCountries : [];
        const topRegions = Array.isArray(data.topRegions) ? data.topRegions : [];
        const genderBreakdown = Array.isArray(data.genderBreakdown) ? data.genderBreakdown : [];
        const ageBreakdown = Array.isArray(data.ageBreakdown) ? data.ageBreakdown : [];
        const avgViewsPerSession = summary.sessions ? (summary.screenPageViews / summary.sessions).toFixed(2) : '0.00';

        totalUsersEl.textContent = formatInteger(summary.totalUsers);
        document.getElementById('ga-active-users').textContent = formatInteger(summary.activeUsers);
        document.getElementById('ga-sessions').textContent = formatInteger(summary.sessions);
        document.getElementById('ga-pageviews').textContent = formatInteger(summary.screenPageViews);
        document.getElementById('analytics-last-update').textContent = data.rangeLabel ? 'Dados reais: ' + data.rangeLabel : 'Dados reais do GA4';

        if (!trend.length) {
            document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">Ainda nao ha volume suficiente para montar a tendencia diaria.</div>';
        } else {
            const trendRows = trend.slice(-10).map(point =>
                '<div class="analytics-highlight-item">'
                + '<div class="analytics-highlight-label">' + esc(point.date) + '</div>'
                + '<div class="analytics-highlight-value">'
                + formatInteger(point.screenPageViews) + ' views<br>'
                + formatInteger(point.sessions) + ' sessoes · '
                + formatInteger(point.activeUsers) + ' ativos'
                + '</div></div>'
            ).join('');
            document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-highlight-list">' + trendRows + '</div>';
        }

        if (!topPages.length) {
            document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Nenhuma pagina acessada registrada ainda.</div>';
        } else {
            document.getElementById('ga-top-pages').innerHTML = '<table class="analytics-table"><thead><tr><th>Pagina</th><th>Views</th><th>Usuarios</th><th>Sessoes</th></tr></thead><tbody>'
                + topPages.map(page => '<tr>'
                    + '<td><div class="analytics-post-title">' + esc(page.pageTitle || 'Sem titulo') + '</div><div class="analytics-post-meta">' + esc(page.pagePath || '/') + '</div></td>'
                    + '<td>' + formatInteger(page.screenPageViews) + '</td>'
                    + '<td>' + formatInteger(page.activeUsers) + '</td>'
                    + '<td>' + formatInteger(page.sessions) + '</td>'
                    + '</tr>').join('')
                + '</tbody></table>';
        }

        document.getElementById('ga-highlights').innerHTML = ''
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Duracao media da sessao</div><div class="analytics-highlight-value">' + formatDuration(summary.averageSessionDuration) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Views por sessao</div><div class="analytics-highlight-value">' + esc(avgViewsPerSession) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Property GA4</div><div class="analytics-highlight-value">' + esc(data.propertyId || 'N/A') + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Status</div><div class="analytics-highlight-value">Coleta ativa no site</div></div>';

        renderGeoTable('ga-top-countries', topCountries, 'Ainda nao ha paises suficientes registrados no periodo.', false);
        renderGeoTable('ga-top-regions', topRegions, 'Ainda nao ha estados ou regioes suficientes registrados no periodo.', true);
        renderDemographicList('ga-gender-breakdown', genderBreakdown, 'O GA4 ainda nao disponibilizou genero para este periodo ou propriedade.');
        renderDemographicList('ga-age-breakdown', ageBreakdown, 'O GA4 ainda nao disponibilizou faixa etaria para este periodo ou propriedade.');

    } catch (error) {
        document.getElementById('analytics-last-update').textContent = 'Falha no GA4';
        document.querySelectorAll('.analytics-empty').forEach(el => el.textContent = 'Erro ao carregar dados.');
    }
}

function renderEditorialAnalytics() {
    const root = document.getElementById('analytics-categories');
    if (!root) return;

    const total = posts.length;
    const published = posts.filter(p => p.published !== false).length;
    const drafts = total - published;
    const featured = posts.filter(p => p.featured).length;
    const avgRead = total ? Math.round(posts.reduce((sum, p) => sum + parseReadTime(p.readTime), 0) / total) : 0;
    const latestDate = total ? posts.map(p => p.date).filter(Boolean).sort((a, b) => String(b).localeCompare(String(a)))[0] : '';

    const categoryMap = {};
    posts.forEach(post => {
        const key = post.categoryLabel || CAT_LABELS[post.category] || post.category || 'Sem categoria';
        categoryMap[key] = (categoryMap[key] || 0) + 1;
    });
    const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const topCategory = categories[0] || ['Sem categoria', 0];

    if (!total) {
        root.innerHTML = '<div class="analytics-empty">Nenhum post cadastrado ainda.</div>';
    } else {
        const max = Math.max(...categories.map(([, count]) => count));
        root.innerHTML = '<div class="category-list">' + categories.map(([name, count]) => {
            const width = Math.max(12, Math.round((count / max) * 100));
            return '<div class="category-row">'
                + '<div class="category-name">' + esc(name) + '</div>'
                + '<div class="category-bar"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '<div class="category-count">' + count + ' post' + (count > 1 ? 's' : '') + '</div>'
                + '</div>';
        }).join('') + '</div>';
    }

    document.getElementById('analytics-highlights').innerHTML = ''
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Categoria lider</div><div class="analytics-highlight-value">' + esc(topCategory[0]) + '<br>' + topCategory[1] + ' post' + (topCategory[1] === 1 ? '' : 's') + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Tempo medio de leitura</div><div class="analytics-highlight-value">' + (avgRead ? avgRead + ' min' : 'N/A') + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Taxa de publicacao</div><div class="analytics-highlight-value">' + (total ? Math.round((published / total) * 100) : 0) + '%</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Ultima atualizacao</div><div class="analytics-highlight-value">' + (latestDate ? formatAnalyticsDate(latestDate) : 'Sem data') + '</div></div>';

    const recentEl = document.getElementById('analytics-recent-posts');
    if (!total) {
        recentEl.innerHTML = '<div class="analytics-empty">Nenhum post para exibir.</div>';
        return;
    }

    const recentPosts = [...posts].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8);
    recentEl.innerHTML = '<table class="analytics-table"><thead><tr><th>Post</th><th>Categoria</th><th>Data</th><th>Status</th></tr></thead><tbody>'
        + recentPosts.map(post => '<tr>'
            + '<td><div class="analytics-post-title">' + esc(post.title || 'Sem titulo') + '</div><div class="analytics-post-meta">' + esc(post.readTime || 'Tempo nao informado') + '</div></td>'
            + '<td>' + esc(post.categoryLabel || CAT_LABELS[post.category] || post.category || 'Sem categoria') + '</td>'
            + '<td>' + formatAnalyticsDate(post.date) + '</td>'
            + '<td><span class="analytics-status-badge ' + (post.published !== false ? 'pub' : 'draft') + '">' + (post.published !== false ? 'Publicado' : 'Rascunho') + '</span></td>'
            + '</tr>').join('')
        + '</tbody></table>';
}

function renderAnalytics() {
    renderEditorialAnalytics();
    renderTrafficAnalytics();
}

function renderGeoTable(targetId, rows, emptyMessage, secondaryLabel) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">' + esc(emptyMessage) + '</div>';
        return;
    }

    target.innerHTML = '<table class="analytics-table"><thead><tr><th>' + esc(secondaryLabel ? 'Local' : 'Pais') + '</th><th>Usuarios</th><th>Sessoes</th></tr></thead><tbody>'
        + rows.map(row => '<tr>'
            + '<td><div class="analytics-post-title">' + esc(row.label || 'Nao informado') + '</div>'
            + (secondaryLabel && row.secondaryLabel ? '<div class="analytics-post-meta">' + esc(row.secondaryLabel) + '</div>' : '')
            + '</td>'
            + '<td>' + formatInteger(row.activeUsers) + '</td>'
            + '<td>' + formatInteger(row.sessions) + '</td>'
            + '</tr>').join('')
        + '</tbody></table>';
}

function renderDemographicList(targetId, rows, emptyMessage) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">' + esc(emptyMessage) + '</div>';
        return;
    }

    target.innerHTML = '<div class="analytics-highlight-list">'
        + rows.map(row => '<div class="analytics-highlight-item">'
            + '<div class="analytics-highlight-label">' + esc(row.label || 'Nao informado') + '</div>'
            + '<div class="analytics-highlight-value">' + formatInteger(row.activeUsers) + ' usuarios</div>'
            + '</div>').join('')
        + '</div>';
}

// Export to window
window.renderAnalytics = renderAnalytics;
window.renderTrafficAnalytics = renderTrafficAnalytics;
window.renderEditorialAnalytics = renderEditorialAnalytics;

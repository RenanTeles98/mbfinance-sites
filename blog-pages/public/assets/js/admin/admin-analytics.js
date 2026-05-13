/**
 * Admin Dashboard - Analytics (GA4 Integration)
 */

function getAnalyticsApiUrl() {
    const base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    const params = new URLSearchParams({ site: getSelectedAnalyticsSite() });
    const range = getSelectedAnalyticsRange();
    if (range.startDate && range.endDate) {
        params.set('startDate', range.startDate);
        params.set('endDate', range.endDate);
    }
    const path = '/api/analytics/overview?' + params.toString();
    return base ? base + path : path;
}

function getSelectedAnalyticsSite() {
    return (localStorage.getItem(ANALYTICS_SITE_KEY) || 'mb-finance').trim() || 'mb-finance';
}

function setSelectedAnalyticsSite(siteKey) {
    localStorage.setItem(ANALYTICS_SITE_KEY, siteKey || 'mb-finance');
    renderTrafficAnalytics();
}

function formatDateInput(date) {
    return date.toISOString().slice(0, 10);
}

function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - Math.max(0, Number(days || 1) - 1));
    return formatDateInput(date);
}

function getSelectedAnalyticsPeriod() {
    return localStorage.getItem('mb_analytics_period') || '30';
}

function getSelectedAnalyticsRange() {
    const period = getSelectedAnalyticsPeriod();
    if (period === 'custom') {
        return {
            startDate: localStorage.getItem('mb_analytics_start_date') || '',
            endDate: localStorage.getItem('mb_analytics_end_date') || ''
        };
    }

    return {
        startDate: getDateDaysAgo(Number(period || 30)),
        endDate: formatDateInput(new Date())
    };
}

function syncAnalyticsPeriodControls() {
    const select = document.getElementById('analytics-period-select');
    const rangeBox = document.getElementById('analytics-custom-range');
    const startInput = document.getElementById('analytics-start-date');
    const endInput = document.getElementById('analytics-end-date');
    if (!select || !rangeBox || !startInput || !endInput) return;

    const period = getSelectedAnalyticsPeriod();
    select.value = period;
    rangeBox.classList.toggle('active', period === 'custom');

    const range = getSelectedAnalyticsRange();
    startInput.value = range.startDate || getDateDaysAgo(30);
    endInput.value = range.endDate || formatDateInput(new Date());
}

function setSelectedAnalyticsPeriod(period) {
    localStorage.setItem('mb_analytics_period', period || '30');
    syncAnalyticsPeriodControls();
    if (period !== 'custom') renderTrafficAnalytics();
}

function applyCustomAnalyticsPeriod() {
    const startInput = document.getElementById('analytics-start-date');
    const endInput = document.getElementById('analytics-end-date');
    if (!startInput || !endInput) return;
    if (!startInput.value || !endInput.value) {
        alert('Selecione a data inicial e final.');
        return;
    }
    if (startInput.value > endInput.value) {
        alert('A data inicial precisa ser anterior ou igual a data final.');
        return;
    }

    localStorage.setItem('mb_analytics_period', 'custom');
    localStorage.setItem('mb_analytics_start_date', startInput.value);
    localStorage.setItem('mb_analytics_end_date', endInput.value);
    syncAnalyticsPeriodControls();
    renderTrafficAnalytics();
}

function renderAnalyticsSiteSelector(sites, selectedKey) {
    const select = document.getElementById('analytics-site-select');
    if (!select) return;

    const fallbackSites = [
        { key: 'mb-finance', name: 'MB Finance', configured: true },
        { key: 'mb-negocios', name: 'MB Negocios', configured: false },
        { key: 'fomenta', name: 'Fomenta', configured: false }
    ];
    const options = Array.isArray(sites) && sites.length ? sites : fallbackSites;
    analyticsSites = options;

    select.innerHTML = options.map(site => {
        const suffix = site.configured ? '' : ' (configurar GA4)';
        return '<option value="' + esc(site.key) + '">' + esc(site.name + suffix) + '</option>';
    }).join('');
    select.value = selectedKey || getSelectedAnalyticsSite();
}

function resetTrafficPanels(message) {
    document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">' + esc(message) + '</div>';
    document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Sem dados reais de tráfego por enquanto.</div>';
    document.getElementById('ga-highlights').innerHTML = '<div class="analytics-empty">Configure as variáveis do GA4 no Vercel e confirme o acesso da conta de serviço na propriedade.</div>';
    document.getElementById('ga-top-countries').innerHTML = '<div class="analytics-empty">Sem dados geográficos disponíveis ainda.</div>';
    document.getElementById('ga-top-regions').innerHTML = '<div class="analytics-empty">Sem dados regionais disponíveis ainda.</div>';
    document.getElementById('ga-gender-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de gênero disponíveis ainda.</div>';
    document.getElementById('ga-age-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de idade disponíveis ainda.</div>';
}

function pctChange(current, previous) {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
}

function renderTrendBadge(targetId, current, previous, invertGood) {
    var el = document.getElementById(targetId);
    if (!el || current === undefined || !previous) return;
    var pct = pctChange(current, previous);
    if (pct === null) return;
    var abs = Math.abs(pct).toFixed(1);
    var isPositive = pct > 0;
    var isGood = invertGood ? !isPositive : isPositive;
    var cls = Math.abs(pct) < 2 ? 'ga-trend-neutral' : (isGood ? 'ga-trend-up' : 'ga-trend-down');
    var arrow = pct > 1.9 ? '↑' : pct < -1.9 ? '↓' : '→';
    el.innerHTML = '<span class="ga-trend-badge ' + cls + '">' + arrow + ' ' + abs + '% vs mês ant.</span>';
}

function renderAlerts(data) {
    var el = document.getElementById('ga-alerts');
    if (!el) return;
    var alerts = [];
    var s = data.summary || {};
    var prev = data.previousPeriod || {};

    if (typeof data.generateLeadTotal === 'number' && data.generateLeadTotal === 0 && s.sessions > 20) {
        alerts.push({ type: 'warn', icon: '⚠️', msg: 'Nenhum lead registrado nos últimos 30 dias. Verifique se os botões do site estão funcionando corretamente.' });
    }
    if (s.bounceRate && s.bounceRate > 0.70) {
        alerts.push({ type: 'danger', icon: '🔴', msg: 'Taxa de rejeição em ' + (s.bounceRate * 100).toFixed(0) + '% — acima do limite saudável de 70%. Avalie o conteúdo e velocidade da homepage.' });
    }
    if (prev.activeUsers && s.activeUsers) {
        var drop = (s.activeUsers - prev.activeUsers) / prev.activeUsers;
        if (drop < -0.20) {
            alerts.push({ type: 'danger', icon: '📉', msg: 'Tráfego caiu ' + Math.abs(Math.round(drop * 100)) + '% em relação ao mês anterior (' + formatInteger(prev.activeUsers) + ' → ' + formatInteger(s.activeUsers) + ' usuários ativos).' });
        }
    }

    el.innerHTML = alerts.map(function(a) {
        return '<div class="ga-alert ga-alert-' + a.type + '">'
            + '<span class="ga-alert-icon">' + a.icon + '</span>'
            + '<span>' + esc(a.msg) + '</span>'
            + '</div>';
    }).join('');
}

function renderFunnel(data) {
    var el = document.getElementById('ga-funnel');
    if (!el) return;
    var s = data.summary || {};
    var sessions = s.sessions || 0;
    var modalOpens = s.pjLeadClicks || 0;
    var leadsSent = typeof data.generateLeadTotal === 'number' ? data.generateLeadTotal : 0;

    if (!sessions) {
        el.innerHTML = '<div class="analytics-empty">Sem dados suficientes para o funil ainda. O GA4 precisa acumular sessões no período.</div>';
        return;
    }

    var steps = [
        { label: 'Visitantes', count: sessions, pct: 100 },
        { label: 'Modal aberto', count: modalOpens, pct: sessions ? ((modalOpens / sessions) * 100) : 0 },
        { label: 'Lead enviado', count: leadsSent, pct: sessions ? ((leadsSent / sessions) * 100) : 0 },
    ];
    var maxCount = steps[0].count || 1;

    el.innerHTML = '<div style="display:flex;flex-direction:column;gap:18px;padding-top:4px;">'
        + steps.map(function(step) {
            var barW = Math.max(3, Math.round((step.count / maxCount) * 100));
            var pctLabel = step.pct === 100 ? '100%' : (step.pct > 0 ? step.pct.toFixed(1) + '%' : '0%');
            return '<div class="ga-funnel-row">'
                + '<div class="ga-funnel-label">' + esc(step.label) + '</div>'
                + '<div class="ga-funnel-bar-wrap"><div class="ga-funnel-bar" style="width:' + barW + '%"></div></div>'
                + '<div class="ga-funnel-count">' + formatInteger(step.count) + '</div>'
                + '<div class="ga-funnel-pct">' + pctLabel + '</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

async function renderTrafficAnalytics() {
    const totalUsersEl = document.getElementById('ga-total-users');
    if (!totalUsersEl) return;

    totalUsersEl.textContent = '--';
    document.getElementById('ga-pj-leads').textContent = '--';
    syncAnalyticsPeriodControls();
    document.getElementById('ga-active-users').textContent = '--';
    document.getElementById('ga-sessions').textContent = '--';
    document.getElementById('ga-pageviews').textContent = '--';
    var bounceEl = document.getElementById('ga-bounce-rate');
    if (bounceEl) bounceEl.textContent = '--';
    document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">Carregando dados do Google Analytics...</div>';
    document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Carregando páginas mais acessadas...</div>';
    document.getElementById('ga-highlights').innerHTML = '<div class="analytics-empty">Carregando indicadores de tráfego...</div>';
    document.getElementById('ga-top-countries').innerHTML = '<div class="analytics-empty">Carregando países com mais acessos...</div>';
    document.getElementById('ga-top-regions').innerHTML = '<div class="analytics-empty">Carregando estados e regiões...</div>';
    document.getElementById('ga-gender-breakdown').innerHTML = '<div class="analytics-empty">Carregando gênero...</div>';
    document.getElementById('ga-age-breakdown').innerHTML = '<div class="analytics-empty">Carregando faixa etária...</div>';

    try {
        const selectedSite = getSelectedAnalyticsSite();
        const response = await fetch(getAnalyticsApiUrl(), { cache: 'no-store' });
        const data = await response.json();
        analyticsData = data;
        window.analyticsData = data; // Global for renderSidebar to use
        renderAnalyticsSiteSelector(data.sites, data.siteKey || selectedSite);

        if (!response.ok || !data || !data.configured || !data.summary) {
            const siteName = data && data.siteName ? data.siteName : 'este site';
            const message = (data && data.error) ? data.error : 'GA4 não configurado ou sem acesso liberado para ' + siteName + '.';
            document.getElementById('analytics-last-update').textContent = 'GA4 indisponível';
            resetTrafficPanels(message);
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

        document.getElementById('ga-pj-leads').textContent = formatInteger(summary.pjLeadClicks);
        totalUsersEl.textContent = formatInteger(summary.totalUsers);
        document.getElementById('ga-active-users').textContent = formatInteger(summary.activeUsers);
        document.getElementById('ga-sessions').textContent = formatInteger(summary.sessions);
        document.getElementById('ga-pageviews').textContent = formatInteger(summary.screenPageViews);
        var bounceRateEl = document.getElementById('ga-bounce-rate');
        if (bounceRateEl) bounceRateEl.textContent = summary.bounceRate ? (summary.bounceRate * 100).toFixed(1) + '%' : '--';
        const siteLabel = data.siteName ? data.siteName + ' - ' : '';
        document.getElementById('analytics-last-update').textContent = data.rangeLabel ? siteLabel + 'Dados reais: ' + data.rangeLabel : siteLabel + 'Dados reais do GA4';

        var prev = data.previousPeriod || null;
        if (prev) {
            renderTrendBadge('ga-pj-leads-trend', summary.pjLeadClicks, prev.activeUsers, false);
            renderTrendBadge('ga-total-users-trend', summary.totalUsers, prev.totalUsers, false);
            renderTrendBadge('ga-active-users-trend', summary.activeUsers, prev.activeUsers, false);
            renderTrendBadge('ga-sessions-trend', summary.sessions, prev.sessions, false);
            renderTrendBadge('ga-pageviews-trend', summary.screenPageViews, prev.screenPageViews, false);
            renderTrendBadge('ga-bounce-rate-trend', summary.bounceRate, prev.bounceRate, true);
        }

        renderAlerts(data);
        renderFunnel(data);

        if (!trend.length) {
            document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">Ainda não há volume suficiente para montar a tendência diária.</div>';
        } else {
            const trendRows = trend.slice(-10).map(point =>
                '<div class="analytics-highlight-item">'
                + '<div class="analytics-highlight-label">' + esc(point.date) + '</div>'
                + '<div class="analytics-highlight-value">'
                + formatInteger(point.screenPageViews) + ' visualizações<br>'
                + formatInteger(point.sessions) + ' sessões · '
                + formatInteger(point.activeUsers) + ' ativos'
                + '</div></div>'
            ).join('');
            document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-highlight-list">' + trendRows + '</div>';
        }

        if (!topPages.length) {
            document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Nenhuma página acessada registrada ainda.</div>';
        } else {
            document.getElementById('ga-top-pages').innerHTML = '<table class="analytics-table"><thead><tr><th>Página</th><th>Visualizações</th><th>Usuários</th><th>Sessões</th></tr></thead><tbody>'
                + topPages.map(page => '<tr>'
                    + '<td><div class="analytics-post-title">' + esc(page.pageTitle || 'Sem título') + '</div><div class="analytics-post-meta">' + esc(page.pagePath || '/') + '</div></td>'
                    + '<td>' + formatInteger(page.screenPageViews) + '</td>'
                    + '<td>' + formatInteger(page.activeUsers) + '</td>'
                    + '<td>' + formatInteger(page.sessions) + '</td>'
                    + '</tr>').join('')
                + '</tbody></table>';
        }

        const engagementPct = summary.engagementRate ? (summary.engagementRate * 100).toFixed(1) + '%' : 'Não disponível';
        const whatsappClicks = typeof data.whatsappClicks === 'number' ? data.whatsappClicks : null;
        const generateLeadTotal = typeof data.generateLeadTotal === 'number' ? data.generateLeadTotal : null;

        document.getElementById('ga-highlights').innerHTML = ''
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Leads gerados</div><div class="analytics-highlight-value">' + formatInteger(summary.pjLeadClicks) + ' cliques para Conta PJ</div></div>'
            + (whatsappClicks !== null ? '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Cliques no WhatsApp</div><div class="analytics-highlight-value">' + formatInteger(whatsappClicks) + ' eventos</div></div>' : '')
            + (generateLeadTotal !== null ? '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Leads convertidos</div><div class="analytics-highlight-value">' + formatInteger(generateLeadTotal) + ' formulários enviados</div></div>' : '')
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Taxa de engajamento</div><div class="analytics-highlight-value">' + engagementPct + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Duração média da sessão</div><div class="analytics-highlight-value">' + formatDuration(summary.averageSessionDuration) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Visualizações por sessão</div><div class="analytics-highlight-value">' + esc(avgViewsPerSession) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Propriedade GA4</div><div class="analytics-highlight-value">' + esc(data.propertyId || 'Não disponível') + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Situação</div><div class="analytics-highlight-value">Coleta ativa no site</div></div>';

        renderTrafficSources('ga-traffic-sources', Array.isArray(data.trafficSources) ? data.trafficSources : []);
        renderProductClicks('ga-product-clicks', Array.isArray(data.productClicks) ? data.productClicks : []);

        renderGeoTable('ga-top-countries', topCountries, 'Ainda não há países suficientes registrados no período.', false);
        renderGeoTable('ga-top-regions', topRegions, 'Ainda não há estados ou regiões suficientes registrados no período.', true);
        renderDemographicList('ga-gender-breakdown', genderBreakdown, 'O GA4 ainda não disponibilizou gênero para este período ou propriedade.');
        renderDemographicList('ga-age-breakdown', ageBreakdown, 'O GA4 ainda não disponibilizou faixa etária para este período ou propriedade.');

    } catch (error) {
        renderAnalyticsSiteSelector(analyticsSites, getSelectedAnalyticsSite());
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
        root.innerHTML = '<div class="analytics-empty">Nenhuma publicação cadastrada ainda.</div>';
    } else {
        const max = Math.max(...categories.map(([, count]) => count));
        root.innerHTML = '<div class="category-list">' + categories.map(([name, count]) => {
            const width = Math.max(12, Math.round((count / max) * 100));
            return '<div class="category-row">'
                + '<div class="category-name">' + esc(name) + '</div>'
                + '<div class="category-bar"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '<div class="category-count">' + count + ' publicação' + (count > 1 ? 's' : '') + '</div>'
                + '</div>';
        }).join('') + '</div>';
    }

    document.getElementById('analytics-highlights').innerHTML = ''
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Categoria líder</div><div class="analytics-highlight-value">' + esc(topCategory[0]) + '<br>' + topCategory[1] + ' publicação' + (topCategory[1] === 1 ? '' : 's') + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Tempo médio de leitura</div><div class="analytics-highlight-value">' + (avgRead ? avgRead + ' min' : 'Não disponível') + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Taxa de publicação</div><div class="analytics-highlight-value">' + (total ? Math.round((published / total) * 100) : 0) + '%</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Última atualização</div><div class="analytics-highlight-value">' + (latestDate ? formatAnalyticsDate(latestDate) : 'Sem data') + '</div></div>';

    const recentEl = document.getElementById('analytics-recent-posts');
    if (!total) {
        recentEl.innerHTML = '<div class="analytics-empty">Nenhuma publicação para exibir.</div>';
        return;
    }

    const recentPosts = [...posts].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8);
    recentEl.innerHTML = '<table class="analytics-table"><thead><tr><th>Publicação</th><th>Categoria</th><th>Data</th><th>Situação</th></tr></thead><tbody>'
        + recentPosts.map(post => '<tr>'
            + '<td><div class="analytics-post-title">' + esc(post.title || 'Sem título') + '</div><div class="analytics-post-meta">' + esc(post.readTime || 'Tempo não informado') + '</div></td>'
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

var GEO_PT = {
    'State of Acre': 'Acre',
    'State of Alagoas': 'Alagoas',
    'State of Amapa': 'Amapá',
    'State of Amazonas': 'Amazonas',
    'State of Bahia': 'Bahia',
    'State of Ceara': 'Ceará',
    'State of Distrito Federal': 'Distrito Federal',
    'State of Espirito Santo': 'Espírito Santo',
    'State of Goias': 'Goiás',
    'State of Maranhao': 'Maranhão',
    'State of Mato Grosso': 'Mato Grosso',
    'State of Mato Grosso do Sul': 'Mato Grosso do Sul',
    'State of Minas Gerais': 'Minas Gerais',
    'State of Para': 'Pará',
    'State of Paraiba': 'Paraíba',
    'State of Parana': 'Paraná',
    'State of Pernambuco': 'Pernambuco',
    'State of Piaui': 'Piauí',
    'State of Rio de Janeiro': 'Rio de Janeiro',
    'State of Rio Grande do Norte': 'Rio Grande do Norte',
    'State of Rio Grande do Sul': 'Rio Grande do Sul',
    'State of Rondonia': 'Rondônia',
    'State of Roraima': 'Roraima',
    'State of Santa Catarina': 'Santa Catarina',
    'State of Sao Paulo': 'São Paulo',
    'State of Sergipe': 'Sergipe',
    'State of Tocantins': 'Tocantins',
    'Brazil': 'Brasil',
    'United States': 'Estados Unidos',
    'Portugal': 'Portugal',
    'Argentina': 'Argentina',
    'Colombia': 'Colômbia',
    'Mexico': 'México',
    'Germany': 'Alemanha',
    'France': 'França',
    'United Kingdom': 'Reino Unido',
    'Italy': 'Itália',
    'Spain': 'Espanha',
    'Japan': 'Japão',
    'China': 'China',
    'Canada': 'Canadá',
    'Australia': 'Austrália',
    'Netherlands': 'Países Baixos',
    'Switzerland': 'Suíça',
    'Belgium': 'Bélgica',
    'Sweden': 'Suécia',
    'Norway': 'Noruega',
    'Denmark': 'Dinamarca',
    'Finland': 'Finlândia',
    'Poland': 'Polônia',
    'Russia': 'Rússia',
    'India': 'Índia',
    'South Korea': 'Coreia do Sul',
    'South Africa': 'África do Sul',
    'Chile': 'Chile',
    'Peru': 'Peru',
    'Venezuela': 'Venezuela',
    'Ecuador': 'Equador',
    'Bolivia': 'Bolívia',
    'Paraguay': 'Paraguai',
    'Uruguay': 'Uruguai',
    'Angola': 'Angola',
    'Mozambique': 'Moçambique',
    'Cape Verde': 'Cabo Verde',
    'Guinea-Bissau': 'Guiné-Bissau',
    'Sao Tome and Principe': 'São Tomé e Príncipe',
    'Timor-Leste': 'Timor-Leste',
    'Macau': 'Macau',
};

function translateGeo(label) {
    if (!label) return label;
    return GEO_PT[label] || label;
}

function renderGeoTable(targetId, rows, emptyMessage, secondaryLabel) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">' + esc(emptyMessage) + '</div>';
        return;
    }

    target.innerHTML = '<table class="analytics-table"><thead><tr><th>' + esc(secondaryLabel ? 'Local' : 'País') + '</th><th>Usuários</th><th>Sessões</th></tr></thead><tbody>'
        + rows.map(row => '<tr>'
            + '<td><div class="analytics-post-title">' + esc(translateGeo(row.label) || 'Não informado') + '</div>'
            + (secondaryLabel && row.secondaryLabel ? '<div class="analytics-post-meta">' + esc(translateGeo(row.secondaryLabel)) + '</div>' : '')
            + '</td>'
            + '<td>' + formatInteger(row.activeUsers) + '</td>'
            + '<td>' + formatInteger(row.sessions) + '</td>'
            + '</tr>').join('')
        + '</tbody></table>';
}

function formatDemographicLabel(label) {
    const value = String(label || '').toLowerCase();
    if (value === 'male') return 'Masculino';
    if (value === 'female') return 'Feminino';
    if (value === 'unknown' || value === 'not set' || value === '(not set)') return 'Não identificado';
    return label || 'Não informado';
}

function renderDemographicList(targetId, rows, emptyMessage) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">' + esc('O GA4 ainda não liberou dados demográficos para esta propriedade. Ative os dados fornecidos pelo Google/Google Signals no GA4 e aguarde volume suficiente de usuários.') + '</div>';
        return;
    }

    const normalizedRows = rows.map(row => Object.assign({}, row, { label: formatDemographicLabel(row.label) }));
    target.innerHTML = '<div class="analytics-highlight-list">'
        + normalizedRows.map(row => '<div class="analytics-highlight-item">'
            + '<div class="analytics-highlight-label">' + esc(row.label || 'Não informado') + '</div>'
            + '<div class="analytics-highlight-value">' + formatInteger(row.activeUsers) + ' usuários</div>'
            + '</div>').join('')
        + '</div>';
}

function getTrafficChannelDetails(channel) {
    const normalized = String(channel || '').trim().toLowerCase();
    const details = {
        'direct': { label: 'Direto', help: 'Acesso sem origem identificada. Normalmente acontece quando a pessoa digita o endereço do site, usa favorito ou vem de um link sem rastreamento.' },
        'referral': { label: 'Referência', help: 'Visitantes que chegaram por links em outros sites, portais, blogs ou parceiros.' },
        'organic social': { label: 'Social orgânico', help: 'Acessos vindos de redes sociais sem anúncio pago, como Instagram, Facebook, LinkedIn ou outras redes.' },
        'organic search': { label: 'Busca orgânica', help: 'Visitantes que encontraram o site em resultados gratuitos de buscadores, como Google ou Bing.' },
        'unassigned': { label: 'Não classificado', help: 'O GA4 recebeu a visita, mas não conseguiu encaixar a origem em um canal padrão.' },
        'cross-network': { label: 'Rede cruzada', help: 'Tráfego de campanhas do Google que aparecem em várias redes ao mesmo tempo, como Pesquisa, Display, YouTube e Discover.' },
        'paid search': { label: 'Busca paga', help: 'Visitantes vindos de anúncios pagos em buscadores, como campanhas de Google Ads na pesquisa.' },
        'paid social': { label: 'Social pago', help: 'Visitantes vindos de anúncios pagos em redes sociais.' },
        'paid shopping': { label: 'Shopping pago', help: 'Visitantes vindos de anúncios pagos em vitrines de produtos, como campanhas de Shopping.' },
        'paid video': { label: 'Vídeo pago', help: 'Visitantes vindos de anúncios pagos em vídeo, como YouTube Ads.' },
        'organic video': { label: 'Vídeo orgânico', help: 'Visitantes vindos de vídeos sem mídia paga, como resultados orgânicos do YouTube.' },
        'organic shopping': { label: 'Shopping orgânico', help: 'Visitantes vindos de resultados gratuitos de produtos em buscadores ou vitrines.' },
        'display': { label: 'Display', help: 'Visitantes vindos de banners e anúncios gráficos em sites, aplicativos ou redes de display.' },
        'email': { label: 'E-mail', help: 'Visitantes que chegaram por links de campanhas de e-mail ou newsletter.' },
        'sms': { label: 'SMS', help: 'Visitantes que chegaram por links enviados por mensagem SMS.' },
        'mobile push notifications': { label: 'Notificações push', help: 'Visitantes que chegaram por notificações enviadas para celular ou navegador.' },
        'affiliates': { label: 'Afiliados', help: 'Visitantes vindos de parceiros ou afiliados rastreados pelo GA4.' },
        'audio': { label: 'Áudio', help: 'Visitantes vindos de campanhas ou links associados a mídia de áudio.' }
    };
    return details[normalized] || {
        label: channel || 'Desconhecido',
        help: 'Canal de tráfego retornado pelo GA4 para esta origem de visitantes.'
    };
}

function renderTrafficSources(targetId, rows) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">Dados de origem de tráfego indisponíveis ainda. O GA4 precisa acumular sessões suficientes no período.</div>';
        return;
    }
    const max = Math.max(...rows.map(r => r.activeUsers || 0), 1);
    target.innerHTML = '<div class="category-list">'
        + rows.map(function(row) {
            const width = Math.max(8, Math.round(((row.activeUsers || 0) / max) * 100));
            const channel = getTrafficChannelDetails(row.channel);
            return '<div class="category-row">'
                + '<div class="category-name"><span class="category-name-text">' + esc(channel.label) + '</span><button class="analytics-info-icon" type="button" aria-label="Explicação sobre ' + esc(channel.label) + '" title="' + esc(channel.help) + '">i</button></div>'
                + '<div class="category-bar"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '<div class="category-count">' + formatInteger(row.activeUsers) + ' usuários</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

function renderProductClicks(targetId, rows) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">Nenhum clique por produto registrado ainda. Os eventos serão exibidos aqui assim que houver volume suficiente no GA4.</div>';
        return;
    }
    const max = Math.max(...rows.map(r => r.clicks || 0), 1);
    target.innerHTML = '<div class="category-list">'
        + rows.map(function(row) {
            const width = Math.max(8, Math.round(((row.clicks || 0) / max) * 100));
            return '<div class="category-row">'
                + '<div class="category-name">' + esc(row.product || 'Produto desconhecido') + '</div>'
                + '<div class="category-bar"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '<div class="category-count">' + formatInteger(row.clicks) + ' clique' + (row.clicks !== 1 ? 's' : '') + '</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

// Export to window
window.renderAnalytics = renderAnalytics;
window.renderTrafficAnalytics = renderTrafficAnalytics;
window.renderEditorialAnalytics = renderEditorialAnalytics;
window.setSelectedAnalyticsSite = setSelectedAnalyticsSite;
window.setSelectedAnalyticsPeriod = setSelectedAnalyticsPeriod;
window.applyCustomAnalyticsPeriod = applyCustomAnalyticsPeriod;

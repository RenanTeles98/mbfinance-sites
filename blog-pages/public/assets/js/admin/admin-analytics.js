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
    if (period === 'today') {
        const today = formatDateInput(new Date());
        return { startDate: today, endDate: today };
    }
    if (period === 'yesterday') {
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const y = formatDateInput(yest);
        return { startDate: y, endDate: y };
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

function setAnalyticsPanelHtml(targetId, html) {
    var target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
}

function resetTrafficPanels(message) {
    document.getElementById('ga-traffic-trend').innerHTML = '<div class="analytics-empty">' + esc(message) + '</div>';
    document.getElementById('ga-top-pages').innerHTML = '<div class="analytics-empty">Sem dados reais de tráfego por enquanto.</div>';
    document.getElementById('ga-highlights').innerHTML = '<div class="analytics-empty">Configure as variáveis do GA4 no Vercel e confirme o acesso da conta de serviço na propriedade.</div>';
    document.getElementById('ga-top-countries').innerHTML = '<div class="analytics-empty">Sem dados geográficos disponíveis ainda.</div>';
    document.getElementById('ga-top-regions').innerHTML = '<div class="analytics-empty">Sem dados regionais disponíveis ainda.</div>';
    document.getElementById('ga-gender-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de gênero disponíveis ainda.</div>';
    document.getElementById('ga-age-breakdown').innerHTML = '<div class="analytics-empty">Sem dados de idade disponíveis ainda.</div>';
    setAnalyticsPanelHtml('ga-strategic-quality', '<div class="analytics-empty">Sem dados estrategicos disponiveis ainda.</div>');
    setAnalyticsPanelHtml('ga-channel-conversions', '<div class="analytics-empty">Sem dados de conversao por canal ainda.</div>');
    setAnalyticsPanelHtml('ga-campaign-conversions', '<div class="analytics-empty">Sem dados de conversao por campanha ainda.</div>');
    setAnalyticsPanelHtml('ga-device-breakdown', '<div class="analytics-empty">Sem dados por dispositivo ainda.</div>');
    setAnalyticsPanelHtml('ga-landing-pages', '<div class="analytics-empty">Sem landing pages registradas ainda.</div>');
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
    var modalOpens = typeof data.modalOpenTotal === 'number' ? data.modalOpenTotal : 0;
    var leadsSent = typeof data.generateLeadTotal === 'number' ? data.generateLeadTotal : 0;
    var c6Clicks = typeof data.c6AppClickTotal === 'number' ? data.c6AppClickTotal : 0;

    if (!sessions) {
        el.innerHTML = '<div class="analytics-empty">Sem dados suficientes para o funil ainda. O GA4 precisa acumular sessões no período.</div>';
        return;
    }

    var steps = [
        { label: 'Visitantes', count: sessions, pct: 100 },
        { label: 'Formulário aberto', count: modalOpens, pct: sessions ? ((modalOpens / sessions) * 100) : 0 },
        { label: 'Lead enviado', count: leadsSent, pct: sessions ? ((leadsSent / sessions) * 100) : 0 },
        { label: 'Baixou app C6 Bank', count: c6Clicks, pct: sessions ? ((c6Clicks / sessions) * 100) : 0 },
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

    setAnalyticsPanelHtml('ga-strategic-quality', '<div class="analytics-empty">Carregando leitura estrategica...</div>');
    setAnalyticsPanelHtml('ga-channel-conversions', '<div class="analytics-empty">Carregando conversoes por canal...</div>');
    setAnalyticsPanelHtml('ga-campaign-conversions', '<div class="analytics-empty">Carregando conversoes por campanha...</div>');
    setAnalyticsPanelHtml('ga-device-breakdown', '<div class="analytics-empty">Carregando dispositivos...</div>');
    setAnalyticsPanelHtml('ga-landing-pages', '<div class="analytics-empty">Carregando paginas de entrada...</div>');

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
        const eventCount = typeof summary.eventCount === 'number' ? summary.eventCount : summary.screenPageViews;

        document.getElementById('ga-pj-leads').textContent = formatInteger(summary.pjLeadClicks);
        totalUsersEl.textContent = formatInteger(summary.totalUsers);
        document.getElementById('ga-active-users').textContent = formatInteger(summary.activeUsers);
        document.getElementById('ga-sessions').textContent = formatInteger(summary.sessions);
        document.getElementById('ga-pageviews').textContent = formatInteger(eventCount);
        var bounceRateEl = document.getElementById('ga-bounce-rate');
        if (bounceRateEl) bounceRateEl.textContent = summary.bounceRate ? (summary.bounceRate * 100).toFixed(1) + '%' : '--';

        // Taxa de conversão
        var convRateEl = document.getElementById('ga-conversion-rate');
        if (convRateEl) {
            var convRate = summary.sessions ? ((summary.pjLeadClicks / summary.sessions) * 100) : 0;
            convRateEl.textContent = convRate > 0 ? convRate.toFixed(1) + '%' : '--';
        }

        // Novos vs Recorrentes
        var userTypes = Array.isArray(data.userTypes) ? data.userTypes : [];
        var newRow = userTypes.find(function(r) { return String(r.label || '').toLowerCase().indexOf('nov') >= 0; });
        var retRow = userTypes.find(function(r) { return String(r.label || '').toLowerCase().indexOf('recorr') >= 0; });
        if (newRow || retRow) {
            var newUsers = newRow ? (newRow.users || 0) : 0;
            var retUsers = retRow ? (retRow.users || 0) : 0;
            var newPct   = newRow ? (newRow.share || 0) : 0;
            var retPct   = retRow ? (retRow.share || 0) : 0;
            var newValEl = document.getElementById('ga-new-users-val');
            var retValEl = document.getElementById('ga-ret-users-val');
            var newPctEl = document.getElementById('ga-new-users-pct');
            var retPctEl = document.getElementById('ga-ret-users-pct');
            var barEl    = document.getElementById('ga-new-users-bar');
            if (newValEl) newValEl.textContent = formatInteger(newUsers);
            if (retValEl) retValEl.textContent = formatInteger(retUsers);
            if (newPctEl) newPctEl.textContent = (newPct * 100).toFixed(1) + '%';
            if (retPctEl) retPctEl.textContent = (retPct * 100).toFixed(1) + '%';
            if (barEl)    barEl.style.width = Math.round(newPct * 100) + '%';
        }
        const siteLabel = data.siteName ? data.siteName + ' - ' : '';
        document.getElementById('analytics-last-update').textContent = data.rangeLabel ? siteLabel + 'Dados reais: ' + data.rangeLabel : siteLabel + 'Dados reais do GA4';

        var prev = data.previousPeriod || null;
        if (prev) {
            renderTrendBadge('ga-pj-leads-trend', summary.pjLeadClicks, prev.activeUsers, false);
            renderTrendBadge('ga-total-users-trend', summary.totalUsers, prev.totalUsers, false);
            renderTrendBadge('ga-active-users-trend', summary.activeUsers, prev.activeUsers, false);
            renderTrendBadge('ga-sessions-trend', summary.sessions, prev.sessions, false);
            renderTrendBadge('ga-pageviews-trend', eventCount, prev.eventCount || prev.screenPageViews, false);
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
                + formatInteger(point.eventCount || point.screenPageViews) + ' eventos<br>'
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
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Visualizações de página</div><div class="analytics-highlight-value">' + formatInteger(summary.screenPageViews) + ' visualizações</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Taxa de engajamento</div><div class="analytics-highlight-value">' + engagementPct + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Duração média da sessão</div><div class="analytics-highlight-value">' + formatDuration(summary.averageSessionDuration) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Visualizações por sessão</div><div class="analytics-highlight-value">' + esc(avgViewsPerSession) + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Propriedade GA4</div><div class="analytics-highlight-value">' + esc(data.propertyId || 'Não disponível') + '</div></div>'
            + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Situação</div><div class="analytics-highlight-value">Coleta ativa no site</div></div>';

        renderProductClicks('ga-product-clicks', Array.isArray(data.productClicks) ? data.productClicks : []);
        renderConversionTable('ga-channel-conversions', Array.isArray(data.channelConversions) ? data.channelConversions : [], 'channel');
        renderConversionTable('ga-device-breakdown', Array.isArray(data.deviceBreakdown) ? data.deviceBreakdown : [], 'device');
        renderConversionTable('ga-landing-pages', Array.isArray(data.landingPages) ? data.landingPages : [], 'landing');

        renderGeoTable('ga-top-countries', topCountries, 'Ainda não há países suficientes registrados no período.', false);
        renderGeoTable('ga-top-regions', topRegions, 'Ainda não há estados ou regiões suficientes registrados no período.', true);
        renderDemographicList('ga-gender-breakdown', genderBreakdown, 'O GA4 ainda não disponibilizou gênero para este período ou propriedade.');
        renderDemographicList('ga-age-breakdown', ageBreakdown, 'O GA4 ainda não disponibilizou faixa etária para este período ou propriedade.');

        ['ga-traffic-trend','ga-top-pages','ga-highlights','ga-top-countries','ga-top-regions',
         'ga-gender-breakdown','ga-age-breakdown',
         'ga-channel-conversions',
         'ga-device-breakdown','ga-landing-pages'].forEach(function(id) { applyCollapse(id); });

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

    if (!total) return;

    ['analytics-categories', 'analytics-highlights'].forEach(function(id) { applyCollapse(id); });
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

function formatTrafficSourceValue(value, fallback) {
    const raw = String(value || '').trim();
    const normalized = raw.toLowerCase();
    if (!raw || normalized === '(not set)' || normalized === 'not set' || normalized === 'unknown') return fallback;
    if (normalized === '(direct)' || normalized === 'direct') return 'Direto';
    if (normalized === '(none)' || normalized === 'none') return 'Nenhuma';
    if (normalized === 'organic') return 'Orgânico';
    if (normalized === 'cpc' || normalized === 'ppc' || normalized === 'paid') return 'Pago';
    if (normalized === 'referral') return 'Referência';
    if (normalized === 'google') return 'Google';
    if (normalized === 'whatsapp') return 'WhatsApp';
    if (normalized === 'sms') return 'SMS';
    return raw;
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

function renderTrafficSourceCampaigns(targetId, rows) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">Dados de origem, mídia e campanha indisponíveis ainda. O GA4 precisa acumular sessões suficientes no período.</div>';
        return;
    }

    const max = Math.max(...rows.map(r => r.sessions || r.activeUsers || 0), 1);
    target.innerHTML = '<table class="analytics-table"><thead><tr><th>Origem / mídia / campanha</th><th>Sessões</th><th>Usuários</th><th>Eventos</th></tr></thead><tbody>'
        + rows.map(function(row) {
            const width = Math.max(8, Math.round(((row.sessions || row.activeUsers || 0) / max) * 100));
            const channel = getTrafficChannelDetails(row.channel);
            const source = formatTrafficSourceValue(row.source, 'Direto');
            const medium = formatTrafficSourceValue(row.medium, 'Nenhuma');
            const campaign = formatTrafficSourceValue(row.campaign, 'Sem campanha');

            return '<tr>'
                + '<td>'
                + '<div class="analytics-post-title">' + esc(source) + ' / ' + esc(medium) + '</div>'
                + '<div class="analytics-post-meta">' + esc(campaign) + ' - ' + esc(channel.label) + ' <button class="analytics-info-icon" type="button" aria-label="Explicação sobre ' + esc(channel.label) + '" title="' + esc(channel.help) + '">i</button></div>'
                + '<div class="category-bar" style="margin-top:8px;"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '</td>'
                + '<td>' + formatInteger(row.sessions) + '</td>'
                + '<td>' + formatInteger(row.activeUsers) + '</td>'
                + '<td>' + formatInteger(row.eventCount) + '</td>'
                + '</tr>';
        }).join('')
        + '</tbody></table>';
}

function formatPercent(value) {
    var number = Number(value || 0);
    if (!Number.isFinite(number)) number = 0;
    return (number * 100).toFixed(1) + '%';
}

function translateDevice(device) {
    var normalized = String(device || '').toLowerCase();
    if (normalized === 'mobile') return 'Mobile';
    if (normalized === 'desktop') return 'Desktop';
    if (normalized === 'tablet') return 'Tablet';
    if (normalized === 'smart tv') return 'Smart TV';
    return device || 'Nao informado';
}

function renderStrategicQuality(data) {
    var summary = data.summary || {};
    var userTypes = Array.isArray(data.userTypes) ? data.userTypes : [];
    var newUsers = userTypes.find(function(row) { return String(row.label || '').toLowerCase().indexOf('novos') >= 0; });
    var returning = userTypes.find(function(row) { return String(row.label || '').toLowerCase().indexOf('recorr') >= 0; });
    var funnelRate = summary.funnelConversionRate || 0;
    var pagesPerSession = summary.pagesPerSession || (summary.sessions ? summary.screenPageViews / summary.sessions : 0);

    setAnalyticsPanelHtml('ga-strategic-quality', ''
        + '<div class="analytics-highlight-list">'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Paginas por sessao</div><div class="analytics-highlight-value">' + pagesPerSession.toFixed(2) + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Taxa de conversao do funil</div><div class="analytics-highlight-value">' + formatPercent(funnelRate) + '</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Novos usuarios</div><div class="analytics-highlight-value">' + formatInteger(newUsers ? newUsers.users : summary.newUsers) + ' (' + formatPercent(newUsers ? newUsers.share : 0) + ')</div></div>'
        + '<div class="analytics-highlight-item"><div class="analytics-highlight-label">Recorrentes</div><div class="analytics-highlight-value">' + formatInteger(returning ? returning.users : 0) + ' (' + formatPercent(returning ? returning.share : 0) + ')</div></div>'
        + '</div>');
}

function renderConversionTable(targetId, rows, type) {
    var target = document.getElementById(targetId);
    if (!target) return;
    if (!Array.isArray(rows) || !rows.length) {
        target.innerHTML = '<div class="analytics-empty">Sem dados suficientes para esta leitura no periodo.</div>';
        return;
    }

    var max = Math.max(...rows.map(function(row) { return row.leads || row.sessions || row.activeUsers || 0; }), 1);
    var LANDING_NAMES = {
        '/':                        'Página inicial',
        '/index.html':              'Página inicial',
        '/mb-finance-completo.html':'Página inicial',
        '/pages/sobre.html':        'Sobre nós',
        '/pages/blog.html':         'Blog',
        '/pages/blog-admin.html':   'Admin do blog',
        '/pages/mb-tributos.html':  'MB Tributos',
        '/pages/credito-rapido.html':'Crédito Rápido',
        '/pages/capital-de-giro.html':'Capital de Giro',
        '/pages/conta-pj-c6.html':  'Conta PJ — C6 Bank',
        '/pages/politica-de-privacidade.html': 'Política de Privacidade',
        '/pages/termos-de-uso.html':'Termos de Uso',
    };
    var friendlyLanding = function(path) {
        if (!path) return 'Página inicial';
        var clean = path.split('?')[0].split('#')[0];
        if (LANDING_NAMES[clean]) return LANDING_NAMES[clean];
        if (clean.startsWith('/blog/')) return 'Blog: ' + clean.replace('/blog/', '').replace(/-/g, ' ');
        return clean;
    };
    var titleFor = function(row) {
        if (type === 'campaign') return formatTrafficSourceValue(row.source, 'Direto') + ' / ' + formatTrafficSourceValue(row.medium, 'Nenhuma');
        if (type === 'device') return translateDevice(row.device);
        if (type === 'landing') return friendlyLanding(row.landingPage);
        return getTrafficChannelDetails(row.channel).label;
    };
    var metaFor = function(row) {
        if (type === 'campaign') return formatTrafficSourceValue(row.campaign, 'Sem campanha');
        if (type === 'device') return 'Experiencia por dispositivo';
        if (type === 'landing') return 'Primeira pagina da sessao';
        return 'Canal de aquisicao';
    };

    target.innerHTML = '<table class="analytics-table"><thead><tr><th>Dimensao</th><th>Leads</th><th>Taxa</th><th>Usuarios</th><th>Sessoes</th></tr></thead><tbody>'
        + rows.map(function(row) {
            var width = Math.max(8, Math.round(((row.leads || row.sessions || row.activeUsers || 0) / max) * 100));
            return '<tr>'
                + '<td><div class="analytics-post-title">' + esc(titleFor(row)) + '</div><div class="analytics-post-meta">' + esc(metaFor(row)) + '</div><div class="category-bar" style="margin-top:8px;"><div class="category-fill" style="width:' + width + '%"></div></div></td>'
                + '<td>' + formatInteger(row.leads) + '</td>'
                + '<td>' + formatPercent(row.conversionRate) + '</td>'
                + '<td>' + formatInteger(row.activeUsers) + '</td>'
                + '<td>' + formatInteger(row.sessions) + '</td>'
                + '</tr>';
        }).join('')
        + '</tbody></table>';
}

var ALL_PRODUCTS = [
    'Conta PJ Digital',
    'C6 Pay',
    'C6 Business',
    'Crédito PJ',
    'C6 Conta Global',
    'C6 Tag',
];

function renderProductClicks(targetId, rows) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Merge GA4 data with full product list (products with no clicks default to 0)
    const gaMap = {};
    if (Array.isArray(rows)) {
        rows.forEach(function(r) { if (r.product) gaMap[r.product] = r.clicks || 0; });
    }
    const merged = ALL_PRODUCTS.map(function(name) {
        return { product: name, clicks: gaMap[name] || 0 };
    }).sort(function(a, b) { return b.clicks - a.clicks; });

    const hasAnyData = merged.some(function(r) { return r.clicks > 0; });
    const max = Math.max(...merged.map(function(r) { return r.clicks; }), 1);

    target.innerHTML = '<div class="category-list">'
        + (hasAnyData ? '' : '<div style="font-size:12px;color:#94a3b8;margin-bottom:14px;padding:10px 14px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;text-align:center;">Aguardando dados do GA4 — os cliques aparecerão aqui assim que o desenvolvedor subir o site atualizado.</div>')
        + merged.map(function(row) {
            const width = hasAnyData ? Math.max(4, Math.round((row.clicks / max) * 100)) : 0;
            const countLabel = hasAnyData ? (formatInteger(row.clicks) + ' clique' + (row.clicks !== 1 ? 's' : '')) : '— aguardando';
            return '<div class="category-row">'
                + '<div class="category-name">' + esc(row.product) + '</div>'
                + '<div class="category-bar"><div class="category-fill" style="width:' + width + '%"></div></div>'
                + '<div class="category-count" style="' + (row.clicks === 0 && hasAnyData ? 'color:#cbd5e1' : '') + '">' + countLabel + '</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

function applyCollapse(targetId, limit) {
    limit = limit || 5;
    var container = document.getElementById(targetId);
    if (!container) return;
    // Remove any existing toggle button before re-applying (e.g. on refresh)
    var existing = container.querySelector('.collapse-toggle-btn');
    if (existing) existing.remove();
    var rows = Array.prototype.slice.call(container.querySelectorAll('tbody tr, .category-row, .analytics-highlight-item'));
    if (rows.length <= limit) return;
    for (var i = limit; i < rows.length; i++) rows[i].style.display = 'none';
    var hidden = rows.length - limit;
    var btn = document.createElement('button');
    btn.className = 'collapse-toggle-btn';
    btn.textContent = 'Ver mais ' + hidden + (hidden === 1 ? ' item' : ' itens');
    btn.setAttribute('data-expanded', 'false');
    btn.onclick = (function(id, lim) {
        return function() {
            var expanded = this.getAttribute('data-expanded') === 'true';
            var c = document.getElementById(id);
            if (!c) return;
            var allRows = Array.prototype.slice.call(c.querySelectorAll('tbody tr, .category-row, .analytics-highlight-item'));
            var hiddenCount = allRows.length - lim;
            if (expanded) {
                for (var i = lim; i < allRows.length; i++) allRows[i].style.display = 'none';
                this.textContent = 'Ver mais ' + hiddenCount + (hiddenCount === 1 ? ' item' : ' itens');
                this.setAttribute('data-expanded', 'false');
            } else {
                for (var i = 0; i < allRows.length; i++) allRows[i].style.display = '';
                this.textContent = 'Ver menos';
                this.setAttribute('data-expanded', 'true');
            }
        };
    })(targetId, limit);
    container.appendChild(btn);
}

// Export to window
window.renderAnalytics = renderAnalytics;
window.applyCollapse = applyCollapse;
window.renderTrafficAnalytics = renderTrafficAnalytics;
window.renderEditorialAnalytics = renderEditorialAnalytics;
window.setSelectedAnalyticsSite = setSelectedAnalyticsSite;
window.setSelectedAnalyticsPeriod = setSelectedAnalyticsPeriod;
window.applyCustomAnalyticsPeriod = applyCustomAnalyticsPeriod;

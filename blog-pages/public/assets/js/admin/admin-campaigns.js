/**
 * Admin Dashboard - Campanhas e UTM Builder
 */

var CAMP_STORAGE_KEY = 'mb_campaigns_v1';
var _pendingDeleteCampaignId = null;
var _pendingDeleteTimer = null;

var CAMP_ICONS = {
    copy: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    save: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path></svg>',
    close: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    duplicate: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
};

var CAMP_OBJECTIVES = {
    leads: 'Leads',
    whatsapp: 'WhatsApp',
    'conta-pj': 'Conta PJ',
    trafego: 'Tráfego',
    cadastro: 'Cadastro'
};

var CAMP_STATUSES = {
    active: 'Ativo',
    paused: 'Pausado',
    expired: 'Expirado'
};

function campButtonHtml(icon, label) {
    var text = label ? '<span>' + cesc(label) + '</span>' : '';
    return (CAMP_ICONS[icon] || '') + text;
}

function setCampButton(btn, icon, label) {
    if (!btn) return;
    btn.innerHTML = campButtonHtml(icon, label);
}

var CHANNEL_PRESETS = [
    { value: 'sms',               label: 'SMS',                    source: 'sms',       medium: 'sms'      },
    { value: 'email',             label: 'E-mail',                 source: 'email',     medium: 'email'    },
    { value: 'whatsapp',          label: 'WhatsApp',               source: 'whatsapp',  medium: 'social'   },
    { value: 'google-cpc',        label: 'Google Ads',             source: 'google',    medium: 'cpc'      },
    { value: 'meta-cpc',          label: 'Meta Ads (Facebook/IG)', source: 'facebook',  medium: 'cpc'      },
    { value: 'tiktok-cpc',        label: 'TikTok Ads',             source: 'tiktok',    medium: 'cpc'      },
    { value: 'linkedin-cpc',      label: 'LinkedIn Ads',           source: 'linkedin',  medium: 'cpc'      },
    { value: 'parceiros',         label: 'Parceiros',              source: 'parceiros', medium: 'referral' },
    { value: 'instagram-organic', label: 'Instagram Organico',     source: 'instagram', medium: 'social'   },
    { value: 'manual',            label: 'Personalizado',          source: '',          medium: ''         },
];

function loadCampaigns() {
    try { return JSON.parse(localStorage.getItem(CAMP_STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
}

function saveCampaigns(list) {
    localStorage.setItem(CAMP_STORAGE_KEY, JSON.stringify(list));
}

function cesc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function extractShortCode(url) {
    try {
        var parts = new URL(url).pathname.split('/').filter(Boolean);
        if (parts.length >= 2 && parts[0] === 'c') return parts[1];
    } catch (e) {
        var match = String(url || '').match(/\/c\/([a-z0-9]+)/i);
        if (match) return match[1];
    }
    return '';
}

function getCampaignShareUrl(item) {
    return item.shortUrl || item.url || '';
}

function formatCampClicks(n) {
    var value = Number(n || 0);
    if (typeof formatInteger === 'function') return formatInteger(value);
    return value.toLocaleString('pt-BR');
}

function normalizeCampStatus(status) {
    return CAMP_STATUSES[status] ? status : 'active';
}

function getCampObjectiveLabel(value) {
    return CAMP_OBJECTIVES[value] || 'Leads';
}

function getCampStatusLabel(value) {
    return CAMP_STATUSES[normalizeCampStatus(value)];
}

function getCampaignBaseUrl(url) {
    try {
        var parsed = new URL(url);
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString();
    } catch (e) {
        return String(url || '').split('?')[0].split('#')[0];
    }
}

function inferChannelValue(label) {
    for (var i = 0; i < CHANNEL_PRESETS.length; i++) {
        if (CHANNEL_PRESETS[i].label === label) return CHANNEL_PRESETS[i].value;
    }
    return 'manual';
}

function matchesCampaignFilters(item) {
    var search = (document.getElementById('camp-search')?.value || '').toLowerCase().trim();
    var channel = document.getElementById('camp-filter-channel')?.value || '';
    var status = document.getElementById('camp-filter-status')?.value || '';
    var haystack = [item.name, item.channel, item.source, item.medium, item.notes, getCampObjectiveLabel(item.objective)].join(' ').toLowerCase();
    if (search && haystack.indexOf(search) === -1) return false;
    if (channel && String(item.channelValue || inferChannelValue(item.channel)) !== channel) return false;
    if (status && normalizeCampStatus(item.status) !== status) return false;
    return true;
}

function sortCampaigns(list) {
    var sort = document.getElementById('camp-sort')?.value || 'recent';
    return list.slice().sort(function(a, b) {
        if (sort === 'clicks') return Number(b.clicks || 0) - Number(a.clicks || 0);
        if (sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR');
        return Number(b.id || 0) - Number(a.id || 0);
    });
}

function renderCampaignSummary() {
    var el = document.getElementById('camp-summary');
    if (!el) return;
    var list = loadCampaigns();
    var totalLinks = list.length;
    var totalClicks = list.reduce(function(sum, item) { return sum + Number(item.clicks || 0); }, 0);
    var top = list.slice().sort(function(a, b) { return Number(b.clicks || 0) - Number(a.clicks || 0); })[0];
    var last = list.filter(function(item) { return !!item.lastClick; }).sort(function(a, b) { return new Date(b.lastClick) - new Date(a.lastClick); })[0];
    var active = list.filter(function(item) { return normalizeCampStatus(item.status) === 'active'; }).length;

    el.innerHTML =
        '<div class="camp-summary-card"><div class="camp-summary-label">Links criados</div><div class="camp-summary-value">' + formatCampClicks(totalLinks) + '</div><div class="camp-summary-note">' + formatCampClicks(active) + ' ativos</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Cliques totais</div><div class="camp-summary-value">' + formatCampClicks(totalClicks) + '</div><div class="camp-summary-note">Soma dos links curtos</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Mais clicado</div><div class="camp-summary-value">' + (top ? formatCampClicks(top.clicks || 0) : '0') + '</div><div class="camp-summary-note">' + cesc(top ? top.name : 'Nenhum link ainda') + '</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Último clique</div><div class="camp-summary-value">' + (last ? new Date(last.lastClick).toLocaleDateString('pt-BR') : '—') + '</div><div class="camp-summary-note">' + cesc(last ? last.name : 'Aguardando cliques') + '</div></div>';
}

function populateCampaignFilters() {
    var select = document.getElementById('camp-filter-channel');
    if (!select) return;
    var current = select.value;
    select.innerHTML = '<option value="">Todos os canais</option>' + CHANNEL_PRESETS.map(function(item) {
        return '<option value="' + cesc(item.value) + '">' + cesc(item.label) + '</option>';
    }).join('');
    select.value = current;
}


function buildUtmUrl() {
    var urlEl     = document.getElementById('camp-url');
    var nameEl    = document.getElementById('camp-name');
    var sourceEl  = document.getElementById('camp-source');
    var mediumEl  = document.getElementById('camp-medium');
    var contentEl = document.getElementById('camp-content');
    var previewEl = document.getElementById('camp-url-preview');
    var copyBtn   = document.getElementById('camp-copy-btn');
    var saveBtn   = document.getElementById('camp-save-btn');

    var url      = urlEl     ? urlEl.value.trim()     : '';
    var campaign = nameEl    ? nameEl.value.trim()    : '';
    var source   = sourceEl  ? sourceEl.value.trim()  : '';
    var medium   = mediumEl  ? mediumEl.value.trim()  : '';
    var content  = contentEl ? contentEl.value.trim() : '';

    var previewText = document.getElementById('camp-url-preview-text');

    if (!url || !campaign || !source || !medium) {
        if (previewEl) previewEl.value = '';
        if (previewText) { previewText.textContent = 'Preencha os campos acima...'; previewText.classList.add('empty'); }
        if (copyBtn) copyBtn.disabled = true;
        if (saveBtn) saveBtn.disabled = true;
        return '';
    }

    var base = url.split('?')[0].split('#')[0];
    var params = new URLSearchParams();
    params.set('utm_source',   source);
    params.set('utm_medium',   medium);
    params.set('utm_campaign', slugify(campaign));
    if (content) params.set('utm_content', slugify(content));

    var finalUrl = base + '?' + params.toString();
    if (previewEl) previewEl.value = finalUrl;
    if (previewText) { previewText.textContent = finalUrl; previewText.classList.remove('empty'); }
    if (copyBtn) copyBtn.disabled = false;
    if (saveBtn) saveBtn.disabled = false;
    shortenUrl(finalUrl);
    return finalUrl;
}

var _shortenTimer = null;
function shortenUrl(url) {
    var wrap    = document.getElementById('camp-short-wrap');
    var loading = document.getElementById('camp-short-loading');
    var errEl   = document.getElementById('camp-short-error');
    var input   = document.getElementById('camp-short-url');
    if (wrap)    wrap.style.display    = 'none';
    if (errEl)   errEl.style.display   = 'none';
    if (loading) loading.style.display = 'block';

    clearTimeout(_shortenTimer);
    _shortenTimer = setTimeout(function() {
        var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
        fetch(base + '/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url }),
        })
            .then(function(r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(function(data) {
                if (loading) loading.style.display = 'none';
                if (data.short) {
                    if (input) {
                        input.value = data.short;
                        input.dataset.code = data.code || extractShortCode(data.short);
                    }
                    var display = document.getElementById('camp-short-url-display');
                    if (display) display.textContent = data.short;
                    if (wrap)  wrap.style.display = 'block';
                } else {
                    var msg = data.error || 'Não foi possível encurtar o link.';
                    if (msg.indexOf('Redis') !== -1) msg = 'Configure o Redis (Upstash) no Vercel para usar esta função.';
                    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
                }
            })
            .catch(function(err) {
                if (loading) loading.style.display = 'none';
                var msg = 'Não foi possível encurtar o link.';
                if (err && err.message && err.message.indexOf('404') !== -1) msg = 'API não encontrada — o site precisa estar no ar via Vercel.';
                if (err && err.message && err.message.indexOf('503') !== -1) msg = 'Configure o Redis (Upstash) no Vercel para usar esta função.';
                if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
            });
    }, 600);
}

var CHECK_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#0099dd" stroke-width="2.5"><path d="M20 6 9 17l-5-5"></path></svg>';
var COPY_ICON  = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

function copyShortUrl() {
    var input = document.getElementById('camp-short-url');
    if (!input || !input.value) return;
    navigator.clipboard.writeText(input.value).then(function() {
        var btn = document.getElementById('camp-short-copy-btn');
        if (btn) {
            btn.innerHTML = CHECK_ICON;
            setTimeout(function() { btn.innerHTML = COPY_ICON; }, 2000);
        }
        saveUtmLink();
    });
}

function onChannelChange() {
    var channelEl = document.getElementById('camp-channel');
    var sourceEl  = document.getElementById('camp-source');
    var mediumEl  = document.getElementById('camp-medium');
    if (!channelEl || !sourceEl || !mediumEl) return;

    var val    = channelEl.value;
    var preset = null;
    for (var i = 0; i < CHANNEL_PRESETS.length; i++) {
        if (CHANNEL_PRESETS[i].value === val) { preset = CHANNEL_PRESETS[i]; break; }
    }
    var isManual = (val === 'manual');

    if (preset && !isManual) {
        sourceEl.value    = preset.source;
        mediumEl.value    = preset.medium;
        sourceEl.readOnly = true;
        mediumEl.readOnly = true;
        sourceEl.style.background = '#f1f5f9';
        mediumEl.style.background = '#f1f5f9';
    } else {
        sourceEl.value    = '';
        mediumEl.value    = '';
        sourceEl.readOnly = false;
        mediumEl.readOnly = false;
        sourceEl.style.background = '';
        mediumEl.style.background = '';
    }
    buildUtmUrl();
}

function copyUtmUrl() {
    var previewEl = document.getElementById('camp-url-preview');
    var val = previewEl ? previewEl.value : '';
    if (!val) return;
    navigator.clipboard.writeText(val).then(function() {
        var btn = document.getElementById('camp-copy-btn');
        if (!btn) return;
        btn.innerHTML = CHECK_ICON;
        setTimeout(function() { btn.innerHTML = COPY_ICON; }, 2000);
    });
}

function saveUtmLink() {
    var url = buildUtmUrl();
    if (!url) return;

    var nameEl   = document.getElementById('camp-name');
    var chanEl   = document.getElementById('camp-channel');
    var sourceEl = document.getElementById('camp-source');
    var mediumEl = document.getElementById('camp-medium');
    var objectiveEl = document.getElementById('camp-objective');
    var statusEl = document.getElementById('camp-status');
    var contentEl = document.getElementById('camp-content');
    var notesEl = document.getElementById('camp-notes');
    var shortEl  = document.getElementById('camp-short-url');
    var shortUrl = shortEl && shortEl.value ? shortEl.value.trim() : '';
    var shortCode = shortEl && shortEl.dataset ? shortEl.dataset.code : '';
    if (!shortCode && shortUrl) shortCode = extractShortCode(shortUrl);

    var list = loadCampaigns();
    var alreadySaved = list.some(function(c) { return c.url === url || (shortUrl && c.shortUrl === shortUrl); });
    if (alreadySaved) return;

    list.unshift({
        id:      Date.now(),
        name:    nameEl   ? nameEl.value.trim()   : '',
        targetUrl: document.getElementById('camp-url') ? document.getElementById('camp-url').value.trim() : '',
        channel: chanEl   ? chanEl.options[chanEl.selectedIndex].text : '',
        channelValue: chanEl ? chanEl.value : '',
        source:  sourceEl ? sourceEl.value.trim() : '',
        medium:  mediumEl ? mediumEl.value.trim() : '',
        content: contentEl ? contentEl.value.trim() : '',
        objective: objectiveEl ? objectiveEl.value : 'leads',
        status: statusEl ? statusEl.value : 'active',
        notes: notesEl ? notesEl.value.trim() : '',
        url:     url,
        shortUrl: shortUrl,
        shortCode: shortCode,
        clicks: 0,
        date:    new Date().toLocaleDateString('pt-BR'),
    });
    saveCampaigns(list);
    renderSavedLinks();

    // auto-preenche o link no template WhatsApp
    var wappLink = document.getElementById('wapp-link');
    if (wappLink && (shortUrl || url)) {
        wappLink.value = shortUrl || url;
        buildWappTemplate();
    }

    var btn = document.getElementById('camp-save-btn');
    if (btn) {
        btn.innerHTML = '<span>Salvo</span>';
        setTimeout(function() { setCampButton(btn, 'save', 'Salvar link'); }, 2000);
    }
}

function duplicateCampaign(id) {
    var item = loadCampaigns().find(function(c) { return c.id === id; });
    if (!item) return;

    var channelValue = item.channelValue || inferChannelValue(item.channel);
    var channelEl = document.getElementById('camp-channel');
    if (document.getElementById('camp-url')) document.getElementById('camp-url').value = item.targetUrl || getCampaignBaseUrl(item.url);
    if (document.getElementById('camp-name')) document.getElementById('camp-name').value = (item.name || 'Campanha') + ' - cópia';
    if (channelEl) channelEl.value = channelValue;
    if (document.getElementById('camp-content')) document.getElementById('camp-content').value = item.content || '';
    if (document.getElementById('camp-objective')) document.getElementById('camp-objective').value = item.objective || 'leads';
    if (document.getElementById('camp-status')) document.getElementById('camp-status').value = 'active';
    if (document.getElementById('camp-notes')) document.getElementById('camp-notes').value = item.notes || '';

    onChannelChange();
    if (channelValue === 'manual') {
        if (document.getElementById('camp-source')) document.getElementById('camp-source').value = item.source || '';
        if (document.getElementById('camp-medium')) document.getElementById('camp-medium').value = item.medium || '';
        buildUtmUrl();
    }
    document.getElementById('camp-name')?.focus();
}

function requestDeleteCampaign(id) {
    if (_pendingDeleteCampaignId === id) {
        deleteCampaign(id);
        return;
    }

    _pendingDeleteCampaignId = id;
    clearTimeout(_pendingDeleteTimer);
    renderSavedLinks();
    _pendingDeleteTimer = setTimeout(function() {
        if (_pendingDeleteCampaignId === id) {
            _pendingDeleteCampaignId = null;
            renderSavedLinks();
        }
    }, 4000);
}

function deleteCampaign(id) {
    clearTimeout(_pendingDeleteTimer);
    _pendingDeleteCampaignId = null;
    saveCampaigns(loadCampaigns().filter(function(c) { return c.id !== id; }));
    renderCampaignSummary();
    renderSavedLinks();
}

function copySavedCamp(id) {
    var item = loadCampaigns().find(function(c) { return c.id === id; });
    if (!item) return;
    navigator.clipboard.writeText(getCampaignShareUrl(item)).then(function() {
        var btn = document.getElementById('camp-copy-saved-' + id);
        if (!btn) return;
        var orig = btn.innerHTML;
        btn.innerHTML = '<span>Copiado</span>';
        setTimeout(function() { btn.innerHTML = orig; }, 1500);
    });
}

function renderSavedLinks() {
    var el = document.getElementById('camp-saved-list');
    if (!el) return;
    populateCampaignFilters();
    renderCampaignSummary();
    var all = loadCampaigns();
    var list = sortCampaigns(all.filter(matchesCampaignFilters));
    if (!list.length) {
        el.innerHTML = '<div class="analytics-empty">Nenhum link encontrado. Ajuste os filtros ou crie um novo link acima.</div>';
        return;
    }
    var maxClicks = Math.max.apply(null, all.map(function(item) { return Number(item.clicks || 0); }).concat([1]));
    var rows = '';
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var shareUrl = getCampaignShareUrl(c);
        var code = c.shortCode || extractShortCode(c.shortUrl || '');
        var isConfirmingDelete = (_pendingDeleteCampaignId === c.id);
        var status = normalizeCampStatus(c.status);
        var width = Math.round((Number(c.clicks || 0) / maxClicks) * 100);
        rows += '<div class="camp-saved-row">'
            + '<div><div class="camp-saved-name" title="' + cesc(shareUrl) + '">' + cesc(c.name) + '</div><div class="camp-saved-detail">' + cesc(getCampObjectiveLabel(c.objective)) + (c.notes ? ' · ' + cesc(c.notes) : '') + '</div></div>'
            + '<div class="camp-click-cell"><div class="camp-click-count" data-short-code="' + cesc(code) + '">' + (code ? formatCampClicks(c.clicks || 0) : '—') + '</div><div class="camp-click-bar"><div class="camp-click-fill" style="width:' + width + '%"></div></div></div>'
            + '<div><span class="camp-channel-badge">' + cesc(c.channel) + '</span></div>'
            + '<div><span class="camp-status-badge camp-status-' + status + '">' + cesc(getCampStatusLabel(status)) + '</span></div>'
            + '<div class="camp-saved-date">' + cesc(c.date) + '</div>'
            + '<div class="camp-saved-actions">'
            + '<button id="camp-copy-saved-' + c.id + '" class="camp-action-btn" onclick="copySavedCamp(' + c.id + ')" title="Copiar URL">' + campButtonHtml('copy', 'Copiar') + '</button>'
            + '<button class="camp-action-btn camp-icon-only" onclick="duplicateCampaign(' + c.id + ')" title="Duplicar link" aria-label="Duplicar link">' + CAMP_ICONS.duplicate + '</button>'
            + (isConfirmingDelete
                ? '<button class="camp-action-btn camp-del-btn camp-confirm-del-btn" onclick="requestDeleteCampaign(' + c.id + ')" title="Confirmar exclusão">Confirmar</button>'
                : '<button class="camp-action-btn camp-del-btn camp-icon-only" onclick="requestDeleteCampaign(' + c.id + ')" title="Excluir" aria-label="Excluir link">' + CAMP_ICONS.close + '</button>')
            + '</div></div>';
    }
    el.innerHTML = '<div class="camp-saved-table"><div class="camp-saved-header"><span>Campanha</span><span style="text-align:center">Cliques</span><span>Canal</span><span>Status</span><span>Data</span><span></span></div>' + rows + '</div>';
    loadCampaignClickStats();
}

function loadCampaignClickStats() {
    var list = loadCampaigns();
    var codes = [];
    for (var i = 0; i < list.length; i++) {
        var code = list[i].shortCode || extractShortCode(list[i].shortUrl || '');
        if (code && codes.indexOf(code) === -1) codes.push(code);
    }
    if (!codes.length) return;

    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    fetch(base + '/api/shorten/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codes: codes }),
        cache: 'no-store',
    })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var stats = data && data.stats ? data.stats : {};
            var changed = false;
            list.forEach(function(item) {
                var code = item.shortCode || extractShortCode(item.shortUrl || '');
                if (!code || !stats[code]) return;
                item.shortCode = code;
                item.clicks = Number(stats[code].clicks || 0);
                item.lastClick = stats[code].lastClick || null;
                changed = true;
            });
            if (changed) saveCampaigns(list);
            if (changed) renderCampaignSummary();
            document.querySelectorAll('[data-short-code]').forEach(function(el) {
                var code = el.getAttribute('data-short-code');
                if (code && stats[code]) el.textContent = formatCampClicks(stats[code].clicks || 0);
            });
        })
        .catch(function() {
            document.querySelectorAll('[data-short-code]').forEach(function(el) {
                if (el.getAttribute('data-short-code')) el.textContent = '—';
            });
        });
}

function loadCampaignPerformance() {
    var el = document.getElementById('camp-perf-table');
    if (!el) return;
    el.innerHTML = '<div class="analytics-empty">Carregando dados do GA4...</div>';
    var range = (typeof getSelectedAnalyticsRange === 'function') ? getSelectedAnalyticsRange() : { startDate: '30daysAgo', endDate: 'today' };
    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    var site = (typeof getSelectedAnalyticsSite === 'function') ? getSelectedAnalyticsSite() : 'mb-finance';
    var qp = new URLSearchParams({ site: site });
    if (range.startDate) qp.set('startDate', range.startDate);
    if (range.endDate)   qp.set('endDate',   range.endDate);
    fetch(base + '/api/analytics/campaigns?' + qp.toString(), { cache: 'no-store' })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (!data.configured) { el.innerHTML = '<div class="analytics-empty">GA4 nao configurado. Configure as variaveis no Vercel para ver o desempenho das campanhas.</div>'; return; }
            if (!Array.isArray(data.rows) || !data.rows.length) { el.innerHTML = '<div class="analytics-empty">Nenhuma campanha com UTM registrada no periodo. Os dados aparecem apos os primeiros acessos.</div>'; return; }
            var rows = data.rows;
            var maxS = 1;
            for (var i = 0; i < rows.length; i++) { if ((rows[i].sessions || 0) > maxS) maxS = rows[i].sessions; }
            var fmt = (typeof formatInteger === 'function') ? formatInteger : function(n) { return n; };
            var trs = '';
            for (var j = 0; j < rows.length; j++) {
                var r = rows[j];
                var w = Math.max(4, Math.round((r.sessions / maxS) * 60));
                trs += '<tr><td><span class="camp-source-tag">' + cesc(r.source) + '</span></td>'
                    + '<td style="color:#64748b">' + cesc(r.medium) + '</td>'
                    + '<td><div style="font-weight:700;color:#1e293b">' + cesc(r.campaign) + '</div><div style="height:4px;background:#e2e8f0;border-radius:99px;margin-top:5px;overflow:hidden"><div style="height:100%;width:' + w + '%;background:linear-gradient(90deg,#003956,#0099dd);border-radius:99px"></div></div></td>'
                    + '<td style="text-align:right;font-weight:800;color:#003956">' + fmt(r.sessions) + '</td>'
                    + '<td style="text-align:right;color:#64748b">' + fmt(r.activeUsers) + '</td></tr>';
            }
            el.innerHTML = '<table class="analytics-table"><thead><tr><th>De onde veio</th><th>Tipo de canal</th><th>Nome da campanha</th><th style="text-align:right">Visitas</th><th style="text-align:right">Pessoas</th></tr></thead><tbody>' + trs + '</tbody></table>';
        })
        .catch(function() { el.innerHTML = '<div class="analytics-empty">Erro ao carregar dados de campanhas do GA4.</div>'; });
}

function initCampaigns() {
    populateCampaignFilters();
    renderCampaignSummary();
    onChannelChange();
    renderSavedLinks();
    loadCampaignPerformance();
}

window.initCampaigns           = initCampaigns;
window.onChannelChange         = onChannelChange;
window.buildUtmUrl             = buildUtmUrl;
window.copyUtmUrl              = copyUtmUrl;
window.copyShortUrl            = copyShortUrl;
window.saveUtmLink             = saveUtmLink;
window.duplicateCampaign       = duplicateCampaign;
window.deleteCampaign          = deleteCampaign;
window.requestDeleteCampaign   = requestDeleteCampaign;
window.copySavedCamp           = copySavedCamp;
window.loadCampaignPerformance = loadCampaignPerformance;
window.loadCampaignClickStats  = loadCampaignClickStats;
window.buildWappTemplate       = buildWappTemplate;
window.copyWappMessage         = copyWappMessage;
window.openWhatsApp            = openWhatsApp;
window.exportCampaignsCSV      = exportCampaignsCSV;

// ── TEMPLATE WHATSAPP ────────────────────────────────────────────────────────

var WAPP_TEMPLATES = {
    'capital-giro':   'Olá, {nome}! A MB Finance tem uma solução de Capital de Giro com condições especiais para a sua empresa — sem burocracia e análise rápida. Acesse e saiba mais: {link}',
    'conta-pj':       'Olá, {nome}! Abra sua Conta PJ com a MB Finance e tenha acesso aos melhores produtos financeiros do mercado para o seu negócio. Acesse: {link}',
    'maquina-cartao': 'Olá, {nome}! Aceite cartões com a Máquina de Cartão da MB Finance — as melhores taxas para PJ e sem aluguel. Saiba mais: {link}',
    'antecipacao':    'Olá, {nome}! Antecipe seus recebíveis com a MB Finance e garanta o fluxo de caixa da sua empresa. Taxas competitivas e aprovação rápida. Acesse: {link}',
    'personalizado':  'Olá, {nome}! A MB Finance tem uma condição especial para a sua empresa. Acesse: {link}',
};

function buildWappTemplate() {
    var product  = (document.getElementById('wapp-product')  || {}).value || 'capital-giro';
    var name     = ((document.getElementById('wapp-name')    || {}).value || '').trim();
    var link     = ((document.getElementById('wapp-link')    || {}).value || '').trim();
    var preview  = document.getElementById('wapp-preview');
    if (!preview) return;
    if (!link) { preview.value = ''; return; }
    var template = WAPP_TEMPLATES[product] || WAPP_TEMPLATES['personalizado'];
    preview.value = template
        .replace('{nome}', name || 'tudo bem?')
        .replace('{link}', link);
}

function copyWappMessage() {
    var preview = document.getElementById('wapp-preview');
    if (!preview || !preview.value) return;
    navigator.clipboard.writeText(preview.value).then(function() {
        var btns = document.querySelectorAll('.camp-actions .camp-btn-secondary');
        btns.forEach(function(btn) {
            if (btn.textContent.indexOf('Copiar mensagem') !== -1) {
                var orig = btn.innerHTML;
                btn.innerHTML = CHECK_ICON + '<span>Copiado</span>';
                setTimeout(function() { btn.innerHTML = orig; }, 2000);
            }
        });
    });
}

function openWhatsApp() {
    var preview = document.getElementById('wapp-preview');
    if (!preview || !preview.value) return;
    window.open('https://wa.me/?text=' + encodeURIComponent(preview.value), '_blank');
}

// ── EXPORT CSV ───────────────────────────────────────────────────────────────

function exportCampaignsCSV() {
    var list = loadCampaigns();
    if (!list.length) { alert('Nenhum link salvo para exportar.'); return; }
    var header = ['Campanha', 'Canal', 'Origem', 'Midia', 'Cliques', 'Data', 'Link Curto', 'URL Completa'];
    var rows = list.map(function(c) {
        return [
            '"' + String(c.name    || '').replace(/"/g, '""') + '"',
            '"' + String(c.channel || '').replace(/"/g, '""') + '"',
            '"' + String(c.source  || '').replace(/"/g, '""') + '"',
            '"' + String(c.medium  || '').replace(/"/g, '""') + '"',
            c.clicks || 0,
            '"' + String(c.date    || '').replace(/"/g, '""') + '"',
            '"' + String(c.shortUrl || '').replace(/"/g, '""') + '"',
            '"' + String(c.url     || '').replace(/"/g, '""') + '"',
        ].join(',');
    });
    var csv = '﻿' + [header.join(',')].concat(rows).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = 'campanhas-mb-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

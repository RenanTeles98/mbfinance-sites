/**
 * Admin Dashboard - Campanhas e UTM Builder
 */

var CAMP_STORAGE_KEY = 'mb_campaigns_v1';

var CAMP_ICONS = {
    copy: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    save: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path></svg>',
    close: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
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
        channel: chanEl   ? chanEl.options[chanEl.selectedIndex].text : '',
        source:  sourceEl ? sourceEl.value.trim() : '',
        medium:  mediumEl ? mediumEl.value.trim() : '',
        url:     url,
        shortUrl: shortUrl,
        shortCode: shortCode,
        clicks: 0,
        date:    new Date().toLocaleDateString('pt-BR'),
    });
    saveCampaigns(list);
    renderSavedLinks();

    var btn = document.getElementById('camp-save-btn');
    if (btn) {
        btn.innerHTML = '<span>Salvo</span>';
        setTimeout(function() { setCampButton(btn, 'save', 'Salvar link'); }, 2000);
    }
}

function deleteCampaign(id) {
    saveCampaigns(loadCampaigns().filter(function(c) { return c.id !== id; }));
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
    var list = loadCampaigns();
    if (!list.length) {
        el.innerHTML = '<div class="analytics-empty">Nenhum link salvo ainda. Crie links acima para reutiliza-los a qualquer momento.</div>';
        return;
    }
    var rows = '';
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var shareUrl = getCampaignShareUrl(c);
        var code = c.shortCode || extractShortCode(c.shortUrl || '');
        rows += '<div class="camp-saved-row">'
            + '<div class="camp-saved-name" title="' + cesc(shareUrl) + '">' + cesc(c.name) + '</div>'
            + '<div class="camp-click-count" data-short-code="' + cesc(code) + '">' + (code ? formatCampClicks(c.clicks || 0) : '—') + '</div>'
            + '<div><span class="camp-channel-badge">' + cesc(c.channel) + '</span></div>'
            + '<div class="camp-saved-date">' + cesc(c.date) + '</div>'
            + '<div class="camp-saved-actions">'
            + '<button id="camp-copy-saved-' + c.id + '" class="camp-action-btn" onclick="copySavedCamp(' + c.id + ')" title="Copiar URL">' + campButtonHtml('copy', 'Copiar') + '</button>'
            + '<button class="camp-action-btn camp-del-btn camp-icon-only" onclick="deleteCampaign(' + c.id + ')" title="Excluir" aria-label="Excluir link">' + CAMP_ICONS.close + '</button>'
            + '</div></div>';
    }
    el.innerHTML = '<div class="camp-saved-table"><div class="camp-saved-header"><span>Campanha</span><span style="text-align:center">Cliques</span><span>Canal</span><span>Data</span><span></span></div>' + rows + '</div>';
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
            el.innerHTML = '<table class="analytics-table"><thead><tr><th>Origem</th><th>Midia</th><th>Campanha</th><th style="text-align:right">Sessoes</th><th style="text-align:right">Usuarios</th></tr></thead><tbody>' + trs + '</tbody></table>';
        })
        .catch(function() { el.innerHTML = '<div class="analytics-empty">Erro ao carregar dados de campanhas do GA4.</div>'; });
}

function initCampaigns() {
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
window.deleteCampaign          = deleteCampaign;
window.copySavedCamp           = copySavedCamp;
window.loadCampaignPerformance = loadCampaignPerformance;
window.loadCampaignClickStats  = loadCampaignClickStats;

/**
 * Admin Dashboard - Campanhas e UTM Builder
 */

var CAMP_STORAGE_KEY = 'mb_campaigns_v1';

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

    if (!url || !campaign || !source || !medium) {
        if (previewEl) previewEl.value = '';
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
                    if (input) input.value = data.short;
                    if (wrap)  wrap.style.display = 'flex';
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

function copyShortUrl() {
    var input = document.getElementById('camp-short-url');
    if (!input || !input.value) return;
    navigator.clipboard.writeText(input.value).then(function() {
        var btn = document.getElementById('camp-short-copy-btn');
        if (!btn) return;
        btn.textContent = 'Copiado!';
        setTimeout(function() { btn.textContent = '📋 Copiar'; }, 2000);
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
        btn.textContent = 'Copiado!';
        setTimeout(function() { btn.textContent = 'Copiar URL'; }, 2000);
    });
}

function saveUtmLink() {
    var url = buildUtmUrl();
    if (!url) return;

    var nameEl   = document.getElementById('camp-name');
    var chanEl   = document.getElementById('camp-channel');
    var sourceEl = document.getElementById('camp-source');
    var mediumEl = document.getElementById('camp-medium');

    var list = loadCampaigns();
    list.unshift({
        id:      Date.now(),
        name:    nameEl   ? nameEl.value.trim()   : '',
        channel: chanEl   ? chanEl.options[chanEl.selectedIndex].text : '',
        source:  sourceEl ? sourceEl.value.trim() : '',
        medium:  mediumEl ? mediumEl.value.trim() : '',
        url:     url,
        date:    new Date().toLocaleDateString('pt-BR'),
    });
    saveCampaigns(list);
    renderSavedLinks();

    var btn = document.getElementById('camp-save-btn');
    if (btn) { btn.textContent = 'Salvo!'; setTimeout(function() { btn.textContent = 'Salvar link'; }, 2000); }
}

function deleteCampaign(id) {
    saveCampaigns(loadCampaigns().filter(function(c) { return c.id !== id; }));
    renderSavedLinks();
}

function copySavedCamp(id) {
    var item = loadCampaigns().find(function(c) { return c.id === id; });
    if (!item) return;
    navigator.clipboard.writeText(item.url).then(function() {
        var btn = document.getElementById('camp-copy-saved-' + id);
        if (!btn) return;
        var orig = btn.textContent;
        btn.textContent = 'OK';
        setTimeout(function() { btn.textContent = orig; }, 1500);
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
        rows += '<div class="camp-saved-row">'
            + '<div class="camp-saved-name" title="' + cesc(c.url) + '">' + cesc(c.name) + '</div>'
            + '<div><span class="camp-channel-badge">' + cesc(c.channel) + '</span></div>'
            + '<div class="camp-saved-meta">' + cesc(c.source) + ' / ' + cesc(c.medium) + '</div>'
            + '<div class="camp-saved-date">' + cesc(c.date) + '</div>'
            + '<div class="camp-saved-actions">'
            + '<button id="camp-copy-saved-' + c.id + '" class="camp-action-btn" onclick="copySavedCamp(' + c.id + ')" title="Copiar URL">Copiar</button>'
            + '<button class="camp-action-btn camp-del-btn" onclick="deleteCampaign(' + c.id + ')" title="Excluir">X</button>'
            + '</div></div>';
    }
    el.innerHTML = '<div class="camp-saved-table"><div class="camp-saved-header"><span>Campanha</span><span>Canal</span><span>Origem / Midia</span><span>Data</span><span></span></div>' + rows + '</div>';
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

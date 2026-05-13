/**
 * Admin Dashboard - Campanhas e UTM Builder
 */

var CAMP_STORAGE_KEY = 'mb_campaigns_v1';

var CHANNEL_PRESETS = [
    { value: 'sms',               label: 'SMS',                      source: 'sms',        medium: 'sms'      },
    { value: 'email',             label: 'E-mail',                   source: 'email',      medium: 'email'    },
    { value: 'whatsapp',          label: 'WhatsApp',                 source: 'whatsapp',   medium: 'social'   },
    { value: 'google-cpc',        label: 'Google Ads',               source: 'google',     medium: 'cpc'      },
    { value: 'meta-cpc',          label: 'Meta Ads (Facebook/IG)',   source: 'facebook',   medium: 'cpc'      },
    { value: 'tiktok-cpc',        label: 'TikTok Ads',               source: 'tiktok',     medium: 'cpc'      },
    { value: 'linkedin-cpc',      label: 'LinkedIn Ads',             source: 'linkedin',   medium: 'cpc'      },
    { value: 'parceiros',         label: 'Parceiros',                source: 'parceiros',  medium: 'referral' },
    { value: 'instagram-organic', label: 'Instagram Orgânico',       source: 'instagram',  medium: 'social'   },
    { value: 'manual',            label: 'Personalizado',            source: '',           medium: ''         },
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

function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildUtmUrl() {
    var url     = (document.getElementById('camp-url')     || {}).value || '';
    var campaign= (document.getElementById('camp-name')    || {}).value || '';
    var source  = (document.getElementById('camp-source')  || {}).value || '';
    var medium  = (document.getElementById('camp-medium')  || {}).value || '';
    var content = (document.getElementById('camp-content') || {}).value || '';
    url = url.trim(); campaign = campaign.trim(); source = source.trim(); medium = medium.trim(); content = content.trim();

    var previewEl  = document.getElementById('camp-url-preview');
    var copyBtn    = document.getElementById('camp-copy-btn');
    var saveBtn    = document.getElementById('camp-save-btn');

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
    return finalUrl;
}

function onChannelChange() {
    var channelEl  = document.getElementById('camp-channel');
    var sourceEl   = document.getElementById('camp-source');
    var mediumEl   = document.getElementById('camp-medium');
    if (!channelEl || !sourceEl || !mediumEl) return;

    var val    = channelEl.value;
    var preset = CHANNEL_PRESETS.find(function(p) { return p.value === val; });
    var isManual = val === 'manual';

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
        if (!isManual) { sourceEl.focus(); }
    }
    buildUtmUrl();
}

function copyUtmUrl() {
    var val = (document.getElementById('camp-url-preview') || {}).value || '';
    if (!val) return;
    navigator.clipboard.writeText(val).then(function() {
        var btn = document.getElementById('camp-copy-btn');
        if (!btn) return;
        btn.textContent = '✓ Copiado!';
        setTimeout(function() { btn.textContent = '📋 Copiar URL'; }, 2000);
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
    if (btn) { btn.textContent = '✓ Salvo!'; setTimeout(function() { btn.textContent = '💾 Salvar link'; }, 2000); }
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
        btn.textContent = '✓';
        setTimeout(function() { btn.textContent = orig; }, 1500);
    });
}

function renderSavedLinks() {
    var el = document.getElementById('camp-saved-list');
    if (!el) return;
    var list = loadCampaigns();

    if (!list.length) {
        el.innerHTML = '<div class="analytics-empty">Nenhum link salvo ainda. Crie e salve links acima para reutilizá-los facilmente.</div>';
        return;
    }

    el.innerHTML = '<div class="camp-saved-table">'
        + '<div class="camp-saved-header"><span>Campanha</span><span>Canal</span><span>Origem / Mídia</span><span>Data</span><span></span></div>'
        + list.map(function(c) {
            return '<div class="camp-saved-row">'
                + '<div class="camp-saved-name" title="' + cesc(c.url) + '">' + cesc(c.name) + '</div>'
                + '<div><span class="camp-channel-badge">' + cesc(c.channel) + '</span></div>'
                + '<div class="camp-saved-meta">' + cesc(c.source) + ' / ' + cesc(c.medium) + '</div>'
                + '<div class="camp-saved-date">' + cesc(c.date) + '</div>'
                + '<div class="camp-saved-actions">'
                +   '<button id="camp-copy-saved-' + c.id + '" class="camp-action-btn" onclick="copySavedCamp(' + c.id + ')" title="Copiar URL">📋</button>'
                +   '<button class="camp-action-btn camp-del-btn" onclick="deleteCampaign(' + c.id + ')" title="Excluir">🗑️</button>'
                + '</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

async function loadCampaignPerformance() {
    var el = document.getElementById('camp-perf-table');
    if (!el) return;
    el.innerHTML = '<div class="analytics-empty">Carregando dados do GA4...</div>';

    var range = (typeof getSelectedAnalyticsRange === 'function')
        ? getSelectedAnalyticsRange()
        : { startDate: '30daysAgo', endDate: 'today' };

    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    var site = (typeof getSelectedAnalyticsSite === 'function') ? getSelectedAnalyticsSite() : 'mb-finance';
    var params = new URLSearchParams({ site: site });
    if (range.startDate) params.set('startDate', range.startDate);
    if (range.endDate)   params.set('endDate',   range.endDate);
    var apiUrl = base + '/api/analytics/campaigns?' + params.toString();

    try {
        var res  = await fetch(apiUrl, { cache: 'no-store' });
        var data = await res.json();

        if (!data.configured) {
            el.innerHTML = '<div class="analytics-empty">GA4 não configurado. Configure as variáveis no Vercel para ver o desempenho das campanhas.</div>';
            return;
        }
        if (!Array.isArray(data.rows) || !data.rows.length) {
            el.innerHTML = '<div class="analytics-empty">Nenhuma campanha com UTM registrada no período. Crie links com UTM usando o criador acima e compartilhe nos seus canais — os dados aparecem aqui após os primeiros acessos.</div>';
            return;
        }

        var rows = data.rows;
        var maxSessions = Math.max.apply(null, rows.map(function(r) { return r.sessions || 0; })) || 1;

        el.innerHTML = '<table class="analytics-table"><thead><tr>'
            + '<th>Origem</th><th>Mídia</th><th>Campanha</th>'
            + '<th style="text-align:right">Sessões</th><th style="text-align:right">Usuários</th>'
            + '</tr></thead><tbody>'
            + rows.map(function(r) {
                var barW = Math.max(4, Math.round((r.sessions / maxSessions) * 60));
                return '<tr>'
                    + '<td><span class="camp-source-tag">' + cesc(r.source) + '</span></td>'
                    + '<td style="color:#64748b">' + cesc(r.medium) + '</td>'
                    + '<td><div style="font-weight:700;color:#1e293b">' + cesc(r.campaign) + '</div>'
                    +     '<div style="height:4px;background:#e2e8f0;border-radius:99px;margin-top:5px;overflow:hidden"><div style="height:100%;width:' + barW + '%;background:linear-gradient(90deg,#003956,#0099dd);border-radius:99px"></div></div></td>'
                    + '<td style="text-align:right;font-weight:800;color:#003956">' + (typeof formatInteger === 'function' ? formatInteger(r.sessions) : r.sessions) + '</td>'
                    + '<td style="text-align:right;color:#64748b">' + (typeof formatInteger === 'function' ? formatInteger(r.activeUsers) : r.activeUsers) + '</td>'
                    + '</tr>';
            }).join('')
            + '</tbody></table>';
    } catch (e) {
        el.innerHTML = '<div class="analytics-empty">Erro ao carregar dados de campanhas do GA4.</div>';
    }
}

function initCampaigns() {
    onChannelChange();
    renderSavedLinks();
    loadCampaignPerformance();
}

window.initCampaigns          = initCampaigns;
window.onChannelChange        = onChannelChange;
window.buildUtmUrl            = buildUtmUrl;
window.copyUtmUrl             = copyUtmUrl;
window.saveUtmLink            = saveUtmLink;
window.deleteCampaign         = deleteCampaign;
window.copySavedCamp          = copySavedCamp;
window.loadCampaignPerformance = loadCampaignPerformance;

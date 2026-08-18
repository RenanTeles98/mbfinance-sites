/**
 * Admin Dashboard - Campanhas e UTM Builder
 */

var CAMP_STORAGE_KEY = 'mb_campaigns_v2';
var CAMP_PROJECT_STORAGE_KEY = 'mb_campaign_projects_v1';
var CAMP_CLIENT_LINK_STORAGE_KEY = 'mb_campaign_client_links_v1';
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
    trafego: 'TrÃ¡fego',
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

var DEFAULT_CAMPAIGN_PROJECTS = [
    { id: 'mb-finance', name: 'Mb Finance', domain: 'https://mbfinance.com.br' },
    { id: 'mb-negocios', name: 'MB NegÃ³cios', domain: 'https://mbnegocios.com.br' },
];

function isDefaultCampaignProject(id) {
    return DEFAULT_CAMPAIGN_PROJECTS.some(function(project) { return project.id === id; });
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
    { value: 'instagram-bio',     label: 'Instagram Bio',          source: 'instagram', medium: 'social'   },
    { value: 'facebook-bio',      label: 'Facebook Bio',           source: 'facebook',  medium: 'social'   },
    { value: 'manual',            label: 'Personalizado',          source: '',          medium: ''         },
];

function loadCampaigns() {
    try { return JSON.parse(localStorage.getItem(CAMP_STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
}

function saveCampaigns(list) {
    localStorage.setItem(CAMP_STORAGE_KEY, JSON.stringify(list));
}

function normalizeProjectId(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-') || 'projeto';
}

function normalizeProjectName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeProjectDomain(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    try {
        var parsed = new URL(raw.indexOf('://') === -1 ? 'https://' + raw : raw);
        return parsed.protocol + '//' + parsed.host;
    } catch (e) {
        return raw;
    }
}

function mergeCampaignProjects(projects) {
    var map = {};
    DEFAULT_CAMPAIGN_PROJECTS.concat(projects || []).forEach(function(project) {
        var name = normalizeProjectName(project.name);
        if (!name) return;
        var id = project.id || normalizeProjectId(name);
        map[id] = { id: id, name: name, domain: normalizeProjectDomain(project.domain) };
    });
    loadCampaigns().forEach(function(item) {
        var name = getCampaignProject(item);
        var id = normalizeProjectId(name);
        if (name && !map[id]) map[id] = { id: id, name: name, domain: '' };
    });
    return Object.keys(map).map(function(id) { return map[id]; }).sort(function(a, b) {
        return a.name.localeCompare(b.name, 'pt-BR');
    });
}

function loadCampaignProjects() {
    var stored = [];
    try { stored = JSON.parse(localStorage.getItem(CAMP_PROJECT_STORAGE_KEY) || '[]'); }
    catch (e) { stored = []; }
    return mergeCampaignProjects(stored);
}

function saveCampaignProjects(projects) {
    localStorage.setItem(CAMP_PROJECT_STORAGE_KEY, JSON.stringify(mergeCampaignProjects(projects)));
}

function getSelectedCampaignProject() {
    var select = document.getElementById('camp-filter-project');
    return select ? select.value : '';
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

function getCampaignProject(item) {
    return String((item && item.project) || 'Sem projeto').trim() || 'Sem projeto';
}

function formatCampaignDate(value) {
    if (!value) return 'â€”';
    try { return new Date(value).toLocaleDateString('pt-BR'); }
    catch (e) { return String(value || 'â€”'); }
}

function getShortDisplayUrl(item) {
    return item.shortUrl || item.url || '';
}

function getRequestedShortCode() {
    var el = document.getElementById('camp-slug');
    var value = el ? String(el.value || '').trim().toLowerCase() : '';
    if (!value) return '';
    return value.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-').slice(0, 40);
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
    var project = getSelectedCampaignProject();
    var haystack = [item.project, item.name, item.channel, item.source, item.medium, item.notes, item.shortUrl, item.targetUrl, getCampObjectiveLabel(item.objective)].join(' ').toLowerCase();
    if (search && haystack.indexOf(search) === -1) return false;
    if (project && normalizeProjectId(getCampaignProject(item)) !== project) return false;
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
    var allCampaigns = loadCampaigns();
    var hasFilterControls = !!document.getElementById('camp-search');
    var list = hasFilterControls ? allCampaigns.filter(matchesCampaignFilters) : allCampaigns;
    var totalLinks = list.length;
    var totalClicks = list.reduce(function(sum, item) { return sum + Number(item.clicks || 0); }, 0);
    var top = list.slice().sort(function(a, b) { return Number(b.clicks || 0) - Number(a.clicks || 0); })[0];
    var last = list.filter(function(item) { return !!item.lastClick; }).sort(function(a, b) { return new Date(b.lastClick) - new Date(a.lastClick); })[0];
    var active = list.filter(function(item) { return normalizeCampStatus(item.status) === 'active'; }).length;

    el.innerHTML =
        '<div class="camp-summary-card"><div class="camp-summary-label">Links criados</div><div class="camp-summary-value">' + formatCampClicks(totalLinks) + '</div><div class="camp-summary-note">' + formatCampClicks(active) + ' ativos</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Cliques totais</div><div class="camp-summary-value">' + formatCampClicks(totalClicks) + '</div><div class="camp-summary-note">Soma dos links curtos</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Mais clicado</div><div class="camp-summary-value">' + (top ? formatCampClicks(top.clicks || 0) : '0') + '</div><div class="camp-summary-note">' + cesc(top ? top.name : 'Nenhum link ainda') + '</div></div>'
        + '<div class="camp-summary-card"><div class="camp-summary-label">Ãšltimo clique</div><div class="camp-summary-value">' + (last ? new Date(last.lastClick).toLocaleDateString('pt-BR') : 'â€”') + '</div><div class="camp-summary-note">' + cesc(last ? last.name : 'Aguardando cliques') + '</div></div>';
}

function populateCampaignFilters() {
    var projects = loadCampaignProjects();
    var selectedProject = getSelectedCampaignProject();
    var projectSelect = document.getElementById('camp-filter-project');
    if (projectSelect) {
        projectSelect.innerHTML = '<option value="">Todos os projetos</option>' + projects.map(function(project) {
            return '<option value="' + cesc(project.id) + '">' + cesc(project.name) + '</option>';
        }).join('');
        projectSelect.value = projects.some(function(project) { return project.id === selectedProject; }) ? selectedProject : '';
    }

    var createProjectSelect = document.getElementById('camp-project');
    if (createProjectSelect) {
        var current = createProjectSelect.value || (projectSelect ? projectSelect.value : '');
        createProjectSelect.innerHTML = projects.map(function(project) {
            return '<option value="' + cesc(project.id) + '">' + cesc(project.name) + '</option>';
        }).join('');
        if (projects.some(function(project) { return project.id === current; })) createProjectSelect.value = current;
        else if (projectSelect && projectSelect.value) createProjectSelect.value = projectSelect.value;
        else if (projects[0]) createProjectSelect.value = projects[0].id;
    }

    var channelSelect = document.getElementById('camp-filter-channel');
    if (channelSelect) {
        var currentChannel = channelSelect.value;
        channelSelect.innerHTML = '<option value="">Todos os canais</option>' + CHANNEL_PRESETS.map(function(item) {
            return '<option value="' + cesc(item.value) + '">' + cesc(item.label) + '</option>';
        }).join('');
        channelSelect.value = currentChannel;
    }
    renderCampaignProjects();
    updateCampaignProjectContext();
}


function getProjectNameById(id) {
    var project = loadCampaignProjects().find(function(item) { return item.id === id; });
    return project ? project.name : 'Sem projeto';
}

function getProjectDomainById(id) {
    var project = loadCampaignProjects().find(function(item) { return item.id === id; });
    return project ? project.domain : '';
}

function updateCampaignProjectContext() {
    var note = document.getElementById('camp-project-context-note');
    var selected = getSelectedCampaignProject();
    if (!note) return;
    if (!selected) {
        note.textContent = 'VisÃ£o geral com todos os projetos. Selecione um projeto para filtrar mÃ©tricas, links e criaÃ§Ã£o.';
        return;
    }
    note.textContent = 'Mostrando mÃ©tricas, links e criaÃ§Ã£o para ' + getProjectNameById(selected) + '.';
}

function onCampaignCreateProjectChange() {
    var projectSelect = document.getElementById('camp-project');
    var urlEl = document.getElementById('camp-url');
    var domain = projectSelect ? getProjectDomainById(projectSelect.value) : '';
    if (urlEl && domain && !urlEl.value.trim()) urlEl.value = domain;
    buildUtmUrl();
}

function onCampaignProjectFilterChange() {
    var selected = getSelectedCampaignProject();
    var createProject = document.getElementById('camp-project');
    if (createProject && selected) {
        createProject.value = selected;
        onCampaignCreateProjectChange();
    }
    renderCampaignSummary();
    renderSavedLinks();
    renderClientLinks();
    updateCampaignProjectContext();
}

function openCampaignProjectsModal() {
    var modal = document.getElementById('campaign-projects-modal');
    if (!modal) return;
    populateCampaignFilters();
    renderCampaignProjects();
    modal.classList.add('open');
    setTimeout(function() {
        var el = document.getElementById('camp-project-name');
        if (el) el.focus();
    }, 60);
}

function closeCampaignProjectsModal() {
    var modal = document.getElementById('campaign-projects-modal');
    if (modal) modal.classList.remove('open');
}
function focusCampaignProjectForm() {
    openCampaignProjectsModal();
}

function saveCampaignProject() {
    var nameEl = document.getElementById('camp-project-name');
    var domainEl = document.getElementById('camp-project-domain');
    var name = normalizeProjectName(nameEl ? nameEl.value : '');
    if (!name) {
        if (nameEl) { nameEl.focus(); nameEl.placeholder = 'Digite o nome do projeto'; }
        return;
    }
    var projects = loadCampaignProjects();
    var id = normalizeProjectId(name);
    var domain = normalizeProjectDomain(domainEl ? domainEl.value : '');
    var existing = projects.find(function(project) { return project.id === id; });
    if (existing) {
        existing.name = name;
        existing.domain = domain || existing.domain;
    } else {
        projects.push({ id: id, name: name, domain: domain });
    }
    saveCampaignProjects(projects);
    if (nameEl) nameEl.value = '';
    if (domainEl) domainEl.value = '';
    populateCampaignFilters();
    var projectFilter = document.getElementById('camp-filter-project');
    if (projectFilter) projectFilter.value = id;
    onCampaignProjectFilterChange();
    renderCampaignProjects();
}

function deleteCampaignProject(id) {
    if (!id) return;
    if (isDefaultCampaignProject(id)) {
        alert('Mb Finance e MB NegÃ³cios sÃ£o projetos base e nÃ£o podem ser apagados.');
        return;
    }
    var used = loadCampaigns().some(function(item) { return normalizeProjectId(getCampaignProject(item)) === id; });
    if (used) {
        alert('Este projeto possui links salvos. Remova ou mova os links antes de apagar o projeto.');
        return;
    }
    var projects = loadCampaignProjects().filter(function(project) { return project.id !== id; });
    saveCampaignProjects(projects);
    var filter = document.getElementById('camp-filter-project');
    if (filter && filter.value === id) filter.value = '';
    populateCampaignFilters();
    renderCampaignSummary();
    renderSavedLinks();
}
function renderCampaignProjects() {
    var el = document.getElementById('camp-project-list');
    if (!el) return;
    var selected = getSelectedCampaignProject();
    var html = loadCampaignProjects().map(function(project) {
        var used = loadCampaigns().some(function(item) { return normalizeProjectId(getCampaignProject(item)) === project.id; });
        var locked = used || isDefaultCampaignProject(project.id);
        return '<div class="camp-project-chip' + (selected === project.id ? ' active' : '') + '"><span>' + cesc(project.name) + '</span>'
            + (project.domain ? '<span class="camp-project-chip-domain">' + cesc(project.domain) + '</span>' : '')
            + '<button type="button" onclick="deleteCampaignProject(\'' + cesc(project.id) + '\')" title="Excluir projeto" aria-label="Excluir projeto"' + (locked ? ' disabled' : '') + '>' + CAMP_ICONS.close + '</button></div>';
    }).join('');
    el.innerHTML = html || '<div class="analytics-empty">Nenhum projeto cadastrado ainda.</div>';
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


function showCampaignShortError(message, canRelease) {
    var errEl = document.getElementById('camp-short-error');
    if (!errEl) return;
    var code = getRequestedShortCode();
    errEl.style.display = 'block';
    if (canRelease && code) {
        errEl.innerHTML = cesc(message) + ' <button type="button" class="camp-inline-link" onclick="releaseRequestedShortCode()">Liberar apelido</button>';
    } else {
        errEl.textContent = message;
    }
}

function releaseRequestedShortCode() {
    var code = getRequestedShortCode();
    if (!code) return;
    var errEl = document.getElementById('camp-short-error');
    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    if (errEl) errEl.textContent = 'Liberando apelido...';
    fetch(base + '/api/shorten', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code }),
    })
        .then(function(r) {
            return r.json().catch(function() { return {}; }).then(function(data) {
                if (!r.ok) throw new Error(data.error || 'HTTP ' + r.status);
                return data;
            });
        })
        .then(function() {
            if (errEl) errEl.textContent = 'Apelido liberado. Gerando o link novamente...';
            buildUtmUrl();
        })
        .catch(function(err) {
            var msg = err && err.message ? err.message : 'Nao foi possivel liberar este apelido.';
            showCampaignShortError(msg, false);
        });
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
        var shortDomainEl = document.getElementById('camp-short-domain');
        fetch(base + '/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                baseUrl: shortDomainEl ? shortDomainEl.value : '',
                customCode: getRequestedShortCode(),
            }),
        })
            .then(function(r) {
                return r.json().catch(function() { return {}; }).then(function(data) {
                    if (!r.ok) throw new Error(data.error || 'HTTP ' + r.status);
                    return data;
                });
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
                    var msg = data.error || 'NÃ£o foi possÃ­vel encurtar o link.';
                    if (msg.indexOf('Redis') !== -1) msg = 'Configure o Redis (Upstash) no Vercel para usar esta funÃ§Ã£o.';
                    showCampaignShortError(msg, false);
                }
            })
            .catch(function(err) {
                if (loading) loading.style.display = 'none';
                var msg = 'NÃ£o foi possÃ­vel encurtar o link.';
                if (err && err.message && err.message.indexOf('404') !== -1) msg = 'API nÃ£o encontrada â€” o site precisa estar no ar via Vercel.';
                if (err && err.message && err.message.indexOf('503') !== -1) msg = 'Configure o Redis (Upstash) no Vercel para usar esta funÃ§Ã£o.';
                if (err && err.message && err.message.indexOf('destino') !== -1) msg = err.message + '. Confira se o endereÃ§o foi digitado corretamente.';
                var canRelease = false;
                if (err && err.message && err.message.toLowerCase().indexOf('apelido') !== -1) {
                    msg = err.message;
                    canRelease = true;
                }
                showCampaignShortError(msg, canRelease);
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

    var projectEl = document.getElementById('camp-project');
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
        project: projectEl ? getProjectNameById(projectEl.value) : 'Sem projeto',
        projectId: projectEl ? projectEl.value : '',
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
        customCode: getRequestedShortCode(),
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
    if (document.getElementById('camp-project')) document.getElementById('camp-project').value = item.projectId || normalizeProjectId(getCampaignProject(item));
    if (document.getElementById('camp-name')) document.getElementById('camp-name').value = (item.name || 'Campanha') + ' - cÃ³pia';
    if (channelEl) channelEl.value = channelValue;
    if (document.getElementById('camp-content')) document.getElementById('camp-content').value = item.content || '';
    if (document.getElementById('camp-slug')) document.getElementById('camp-slug').value = '';
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


function releaseCampaignShortCode(item) {
    var code = item ? (item.shortCode || extractShortCode(item.shortUrl || '')) : '';
    if (!code) return;
    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    fetch(base + '/api/shorten', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, url: item.url || '' }),
    }).catch(function(err) {
        console.warn('[campaigns] Nao foi possivel liberar o apelido do link curto:', err);
    });
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
    var list = loadCampaigns();
    var item = list.find(function(c) { return c.id === id; });
    if (item) releaseCampaignShortCode(item);
    saveCampaigns(list.filter(function(c) { return c.id !== id; }));
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
        var shortDisplay = getShortDisplayUrl(c) || 'Link curto pendente';
        var code = c.shortCode || extractShortCode(c.shortUrl || '');
        var isConfirmingDelete = (_pendingDeleteCampaignId === c.id);
        var status = normalizeCampStatus(c.status);
        var width = Math.round((Number(c.clicks || 0) / maxClicks) * 100);
        var lastClick = c.lastClick ? formatCampaignDate(c.lastClick) : 'Sem cliques';
        rows += '<div class="camp-saved-row">'
            + '<div><div class="camp-project-pill" title="' + cesc(getCampaignProject(c)) + '">' + cesc(getCampaignProject(c)) + '</div><div class="camp-saved-name" title="' + cesc(c.name) + '">' + cesc(c.name || 'Campanha sem nome') + '</div><div class="camp-saved-detail">Criado em ' + cesc(c.date || 'â€”') + ' Â· ' + cesc(getCampObjectiveLabel(c.objective)) + (c.notes ? ' Â· ' + cesc(c.notes) : '') + '</div></div>'
            + '<div><div class="camp-link-short" title="' + cesc(shortDisplay) + '">' + cesc(shortDisplay) + '</div><div class="camp-link-dest" title="' + cesc(c.targetUrl || c.url || '') + '">' + cesc(c.targetUrl || c.url || '') + '</div></div>'
            + '<div class="camp-click-cell"><div class="camp-click-count" data-short-code="' + cesc(code) + '">' + (code ? formatCampClicks(c.clicks || 0) : 'â€”') + '</div><div class="camp-click-bar"><div class="camp-click-fill" data-click-fill-code="' + cesc(code) + '" style="width:' + width + '%"></div></div></div>'
            + '<div><div class="camp-last-click' + (c.lastClick ? '' : ' empty') + '" data-last-click-code="' + cesc(code) + '">' + cesc(lastClick) + '</div></div>'
            + '<div><span class="camp-channel-badge">' + cesc(c.channel) + '</span></div>'
            + '<div><span class="camp-status-badge camp-status-' + status + '">' + cesc(getCampStatusLabel(status)) + '</span></div>'
            + '<div class="camp-saved-actions">'
            + '<button id="camp-copy-saved-' + c.id + '" class="camp-action-btn" onclick="copySavedCamp(' + c.id + ')" title="Copiar URL">' + campButtonHtml('copy', 'Copiar') + '</button>'
            + '<button class="camp-action-btn camp-icon-only" onclick="duplicateCampaign(' + c.id + ')" title="Duplicar link" aria-label="Duplicar link">' + CAMP_ICONS.duplicate + '</button>'
            + (isConfirmingDelete
                ? '<button class="camp-action-btn camp-del-btn camp-confirm-del-btn" onclick="requestDeleteCampaign(' + c.id + ')" title="Confirmar exclusÃ£o">Confirmar</button>'
                : '<button class="camp-action-btn camp-del-btn camp-icon-only" onclick="requestDeleteCampaign(' + c.id + ')" title="Excluir" aria-label="Excluir link">' + CAMP_ICONS.close + '</button>')
            + '</div></div>';
    }
    el.innerHTML = '<div class="camp-saved-table"><div class="camp-saved-header"><span>Projeto / campanha</span><span>Link personalizado</span><span style="text-align:center">Cliques</span><span>Ãšltimo clique</span><span>Canal</span><span>Status</span><span></span></div>' + rows + '</div>';
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
                if (el.getAttribute('data-short-code')) el.textContent = 'â€”';
            });
        });
}


function loadClientLinks() {
    try { return JSON.parse(localStorage.getItem(CAMP_CLIENT_LINK_STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
}

function saveClientLinks(list) {
    localStorage.setItem(CAMP_CLIENT_LINK_STORAGE_KEY, JSON.stringify(list));
}

function setClientStatus(message, type) {
    var el = document.getElementById('camp-client-status');
    if (!el) return;
    el.className = 'camp-client-status' + (type ? ' ' + type : '');
    el.textContent = message || '';
}

function normalizeClientField(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function parseClientRows(raw) {
    return String(raw || '').split(/\r?\n/).map(function(line) {
        var clean = line.trim();
        if (!clean) return null;
        var parts = clean.split(/\t|;|,/).map(normalizeClientField);
        if (!parts[0]) return null;
        return {
            name: parts[0] || '',
            cnpj: parts[1] || '',
            phone: parts[2] || '',
            company: parts[3] || parts[0] || '',
        };
    }).filter(Boolean);
}

function makeClientCode(existingCodes) {
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var code = '';
    do {
        code = 'lc';
        for (var i = 0; i < 10; i++) code += chars[Math.floor(Math.random() * chars.length)];
    } while (existingCodes.indexOf(code) !== -1);
    existingCodes.push(code);
    return code;
}

function getClientCampaignContext() {
    var projectEl = document.getElementById('camp-project');
    var nameEl = document.getElementById('camp-name');
    var chanEl = document.getElementById('camp-channel');
    var sourceEl = document.getElementById('camp-source');
    var mediumEl = document.getElementById('camp-medium');
    var contentEl = document.getElementById('camp-content');
    var targetEl = document.getElementById('camp-url');
    var domainEl = document.getElementById('camp-short-domain');
    return {
        project: projectEl ? getProjectNameById(projectEl.value) : 'Sem projeto',
        projectId: projectEl ? projectEl.value : '',
        campaign: nameEl ? nameEl.value.trim() : '',
        channel: chanEl ? chanEl.options[chanEl.selectedIndex].text : '',
        channelValue: chanEl ? chanEl.value : '',
        source: sourceEl ? sourceEl.value.trim() : '',
        medium: mediumEl ? mediumEl.value.trim() : '',
        content: contentEl ? contentEl.value.trim() : '',
        targetUrl: targetEl ? targetEl.value.trim() : '',
        shortBase: domainEl ? domainEl.value : '',
    };
}

function buildClientBaseUtmUrl(context) {
    if (!context.targetUrl || !context.campaign || !context.source || !context.medium) return '';
    var base = context.targetUrl.split('?')[0].split('#')[0];
    var params = new URLSearchParams();
    params.set('utm_source', context.source);
    params.set('utm_medium', context.medium);
    params.set('utm_campaign', slugify(context.campaign));
    if (context.content) params.set('utm_content', slugify(context.content));
    return base + '?' + params.toString();
}

function buildClientTargetUrl(context, client, code) {
    var baseUrl = buildClientBaseUtmUrl(context);
    if (!baseUrl) return '';
    try {
        var parsed = new URL(baseUrl);
        var content = context.content ? slugify(context.content) + '-' + code : code;
        parsed.searchParams.set('utm_content', content);
        parsed.searchParams.set('mb_lead', code);
        return parsed.toString();
    } catch (e) {
        return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + 'mb_lead=' + encodeURIComponent(code);
    }
}
function renderClientMessage(template, item) {
    return String(template || '')
        .replace(/\{nome\}/gi, item.name || '')
        .replace(/\{empresa\}/gi, item.company || '')
        .replace(/\{cnpj\}/gi, item.cnpj || '')
        .replace(/\{telefone\}/gi, item.phone || '')
        .replace(/\{link\}/gi, item.shortUrl || '')
        .replace(/\{campanha\}/gi, item.campaign || '');
}

function requestShortLinkForClient(url, baseUrl, code, attempt) {
    var base = (typeof getApiBase === 'function' ? getApiBase() : window.location.origin).replace(/\/$/, '');
    return fetch(base + '/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url, baseUrl: baseUrl || '', customCode: code }),
    }).then(function(res) {
        return res.json().catch(function() { return {}; }).then(function(data) {
            if (res.ok) return data;
            if (res.status === 409 && attempt < 3) throw new Error('retry-code');
            throw new Error(data.error || 'Nao foi possivel gerar o link curto.');
        });
    });
}

async function generateClientLinks() {
    var rowsEl = document.getElementById('camp-client-rows');
    var templateEl = document.getElementById('camp-client-message');
    var btn = document.getElementById('camp-client-generate-btn');
    var clients = parseClientRows(rowsEl ? rowsEl.value : '');
    if (!clients.length) { setClientStatus('Cole ao menos um cliente para gerar os links.', 'error'); return; }

    var context = getClientCampaignContext();
    if (!context.targetUrl || !context.campaign || !context.source || !context.medium) {
        setClientStatus('Preencha destino, campanha, origem e meio no bloco acima.', 'error');
        return;
    }

    var existing = loadClientLinks();
    var existingCodes = existing.map(function(item) { return item.shortCode; }).filter(Boolean);
    var created = [];
    if (btn) btn.disabled = true;
    setClientStatus('Gerando 0 de ' + clients.length + ' links...', '');

    try {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            var code = makeClientCode(existingCodes);
            var targetUrl = buildClientTargetUrl(context, client, code);
            var data = null;
            for (var attempt = 0; attempt < 4; attempt++) {
                try {
                    data = await requestShortLinkForClient(targetUrl, context.shortBase, code, attempt);
                    break;
                } catch (err) {
                    if (String(err && err.message) !== 'retry-code') throw err;
                    code = makeClientCode(existingCodes);
                    targetUrl = buildClientTargetUrl(context, client, code);
                }
            }
            var item = {
                id: Date.now() + i,
                token: code,
                shortCode: data && data.code ? data.code : code,
                shortUrl: data && data.short ? data.short : '',
                targetUrl: context.targetUrl,
                url: targetUrl,
                project: context.project,
                projectId: context.projectId,
                campaign: context.campaign,
                channel: context.channel,
                channelValue: context.channelValue,
                source: context.source,
                medium: context.medium,
                content: context.content,
                name: client.name,
                cnpj: client.cnpj,
                phone: client.phone,
                company: client.company,
                clicks: 0,
                lastClick: null,
                date: new Date().toLocaleDateString('pt-BR'),
            };
            item.message = renderClientMessage(templateEl ? templateEl.value : '', item);
            created.push(item);
            setClientStatus('Gerando ' + (i + 1) + ' de ' + clients.length + ' links...', '');
        }
        saveClientLinks(created.concat(existing));
        if (rowsEl) rowsEl.value = '';
        setClientStatus(created.length + ' links por cliente gerados.', 'success');
        renderClientLinks();
    } catch (err) {
        setClientStatus(err && err.message ? err.message : 'Erro ao gerar links por cliente.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

function matchesClientProject(item) {
    var project = getSelectedCampaignProject();
    if (!project) return true;
    return normalizeProjectId(item.project || '') === project || item.projectId === project;
}

function renderClientLinks() {
    var el = document.getElementById('camp-client-list');
    if (!el) return;
    var list = loadClientLinks().filter(matchesClientProject);
    if (!list.length) {
        el.innerHTML = '<div class="analytics-empty">Nenhum link por cliente gerado ainda.</div>';
        return;
    }
    var rows = list.map(function(item) {
        var code = item.shortCode || extractShortCode(item.shortUrl || '');
        var lastClick = item.lastClick ? formatCampaignDate(item.lastClick) : 'Sem cliques';
        return '<div class="camp-client-row">'
            + '<div><div class="camp-client-name">' + cesc(item.name || 'Cliente sem nome') + '</div><div class="camp-client-meta">CNPJ: ' + cesc(item.cnpj || '-') + (item.company ? ' Â· ' + cesc(item.company) : '') + (item.phone ? ' Â· ' + cesc(item.phone) : '') + '</div></div>'
            + '<div><div class="camp-client-link" title="' + cesc(item.shortUrl || '') + '">' + cesc(item.shortUrl || 'Link pendente') + '</div><div class="camp-client-msg" title="' + cesc(item.message || '') + '">' + cesc(item.message || '') + '</div></div>'
            + '<div class="camp-click-cell"><div class="camp-click-count" data-client-code="' + cesc(code) + '">' + formatCampClicks(item.clicks || 0) + '</div><div class="camp-click-bar"><div class="camp-click-fill" data-client-fill-code="' + cesc(code) + '" style="width:' + Math.min(100, Number(item.clicks || 0) * 12) + '%"></div></div></div>'
            + '<div><div class="camp-last-click' + (item.lastClick ? '' : ' empty') + '" data-client-last-code="' + cesc(code) + '">' + cesc(lastClick) + '</div></div>'
            + '<div class="camp-client-row-actions"><button class="camp-action-btn" onclick="copyClientLink(' + item.id + ')">' + campButtonHtml('copy', 'Link') + '</button><button class="camp-action-btn" onclick="copyClientMessage(' + item.id + ')">' + campButtonHtml('copy', 'Mensagem') + '</button><button class="camp-action-btn camp-del-btn camp-icon-only" onclick="deleteClientLink(' + item.id + ')" aria-label="Excluir link por cliente">' + CAMP_ICONS.close + '</button></div>'
            + '</div>';
    }).join('');
    el.innerHTML = '<div class="camp-client-table"><div class="camp-client-header"><span>Cliente</span><span>Link e mensagem</span><span>Cliques</span><span>Ultimo clique</span><span></span></div>' + rows + '</div>';
    loadClientLinkStats();
}

function loadClientLinkStats() {
    var list = loadClientLinks();
    var codes = [];
    list.forEach(function(item) {
        var code = item.shortCode || extractShortCode(item.shortUrl || '');
        if (code && codes.indexOf(code) === -1) codes.push(code);
    });
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
            if (changed) saveClientLinks(list);
            document.querySelectorAll('[data-client-code]').forEach(function(el) {
                var code = el.getAttribute('data-client-code');
                if (code && stats[code]) el.textContent = formatCampClicks(stats[code].clicks || 0);
            });
            document.querySelectorAll('[data-client-last-code]').forEach(function(el) {
                var code = el.getAttribute('data-client-last-code');
                if (code && stats[code]) {
                    el.textContent = stats[code].lastClick ? formatCampaignDate(stats[code].lastClick) : 'Sem cliques';
                    el.classList.toggle('empty', !stats[code].lastClick);
                }
            });
        });
}

function copyClientLink(id) {
    var item = loadClientLinks().find(function(row) { return row.id === id; });
    if (item && item.shortUrl) navigator.clipboard.writeText(item.shortUrl);
}

function copyClientMessage(id) {
    var item = loadClientLinks().find(function(row) { return row.id === id; });
    if (item && item.message) navigator.clipboard.writeText(item.message);
}

function deleteClientLink(id) {
    var list = loadClientLinks();
    var item = list.find(function(row) { return row.id === id; });
    if (item) releaseCampaignShortCode({ shortCode: item.shortCode, shortUrl: item.shortUrl, url: item.url });
    saveClientLinks(list.filter(function(row) { return row.id !== id; }));
    renderClientLinks();
}

function exportClientLinksCSV() {
    var list = loadClientLinks().filter(matchesClientProject);
    if (!list.length) return;
    var header = ['Projeto', 'Campanha', 'Cliente', 'Empresa', 'CNPJ', 'Telefone', 'Cliques', 'Ultimo Clique', 'Codigo', 'Link', 'Mensagem'];
    var rows = list.map(function(item) {
        return [item.project, item.campaign, item.name, item.company, item.cnpj, item.phone, item.clicks || 0, item.lastClick ? formatCampaignDate(item.lastClick) : '', item.shortCode || '', item.shortUrl || '', item.message || ''].map(function(value) {
            return '"' + String(value || '').replace(/"/g, '""') + '"';
        }).join(',');
    });
    var blob = new Blob([header.join(',') + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'links-por-cliente.csv';
    a.click();
    URL.revokeObjectURL(a.href);
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
            el.innerHTML = '<table class="analytics-table"><thead><tr><th>Origem</th><th>Meio</th><th>Nome da campanha</th><th style="text-align:right">Visitas</th><th style="text-align:right">Pessoas</th></tr></thead><tbody>' + trs + '</tbody></table>';
        })
        .catch(function() { el.innerHTML = '<div class="analytics-empty">Erro ao carregar dados de campanhas do GA4.</div>'; });
}

function initCampaigns() {
    if (!window.__campaignProjectEscBound) {
        window.__campaignProjectEscBound = true;
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') closeCampaignProjectsModal();
        });
    }
    populateCampaignFilters();
    renderCampaignSummary();
    onChannelChange();
    renderSavedLinks();
    renderClientLinks();
    renderWappTemplates();
    loadCampaignPerformance();
}

window.initCampaigns           = initCampaigns;
window.onCampaignProjectFilterChange = onCampaignProjectFilterChange;
window.focusCampaignProjectForm = focusCampaignProjectForm;
window.openCampaignProjectsModal = openCampaignProjectsModal;
window.closeCampaignProjectsModal = closeCampaignProjectsModal;
window.onCampaignCreateProjectChange = onCampaignCreateProjectChange;
window.saveCampaignProject = saveCampaignProject;
window.deleteCampaignProject = deleteCampaignProject;
window.onChannelChange         = onChannelChange;
window.buildUtmUrl             = buildUtmUrl;
window.copyUtmUrl              = copyUtmUrl;
window.copyShortUrl            = copyShortUrl;
window.releaseRequestedShortCode = releaseRequestedShortCode;
window.saveUtmLink             = saveUtmLink;
window.duplicateCampaign       = duplicateCampaign;
window.deleteCampaign          = deleteCampaign;
window.requestDeleteCampaign   = requestDeleteCampaign;
window.copySavedCamp           = copySavedCamp;
window.loadCampaignPerformance = loadCampaignPerformance;
window.loadCampaignClickStats  = loadCampaignClickStats;
window.generateClientLinks    = generateClientLinks;
window.renderClientLinks      = renderClientLinks;
window.loadClientLinkStats    = loadClientLinkStats;
window.copyClientLink         = copyClientLink;
window.copyClientMessage      = copyClientMessage;
window.deleteClientLink       = deleteClientLink;
window.exportClientLinksCSV   = exportClientLinksCSV;
window.buildWappTemplate       = buildWappTemplate;
window.saveWappTemplate        = saveWappTemplate;
window.useWappTemplate         = useWappTemplate;
window.deleteWappTemplate      = deleteWappTemplate;
window.renderWappTemplates     = renderWappTemplates;
window.copyWappMessage         = copyWappMessage;
window.openWhatsApp            = openWhatsApp;
window.exportCampaignsCSV      = exportCampaignsCSV;

// â”€â”€ TEMPLATE WHATSAPP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

var WAPP_TPL_KEY = 'mb_wapp_templates_v1';

var WAPP_TEMPLATES = {
    'capital-giro':   'OlÃ¡, {nome}! A Mb Finance tem uma soluÃ§Ã£o de Capital de Giro com condiÃ§Ãµes especiais para a sua empresa â€” sem burocracia e anÃ¡lise rÃ¡pida. Acesse e saiba mais: {link}',
    'conta-pj':       'OlÃ¡, {nome}! Abra sua Conta PJ com a Mb Finance e tenha acesso aos melhores produtos financeiros do mercado para o seu negÃ³cio. Acesse: {link}',
    'maquina-cartao': 'OlÃ¡, {nome}! Aceite cartÃµes com a MÃ¡quina de CartÃ£o da Mb Finance â€” as melhores taxas para PJ e sem aluguel. Saiba mais: {link}',
    'antecipacao':    'OlÃ¡, {nome}! Antecipe seus recebÃ­veis com a Mb Finance e garanta o fluxo de caixa da sua empresa. Taxas competitivas e aprovaÃ§Ã£o rÃ¡pida. Acesse: {link}',
    'personalizado':  'OlÃ¡, {nome}! A Mb Finance tem uma condiÃ§Ã£o especial para a sua empresa. Acesse: {link}',
};

var WAPP_PRODUCT_LABELS = {
    'capital-giro': 'Capital de Giro', 'conta-pj': 'Conta PJ',
    'maquina-cartao': 'MÃ¡quina de CartÃ£o', 'antecipacao': 'AntecipaÃ§Ã£o',
    'personalizado': 'Personalizado',
};

function loadWappTemplates() {
    try { return JSON.parse(localStorage.getItem(WAPP_TPL_KEY) || '[]'); } catch (e) { return []; }
}
function saveWappTemplates(list) { localStorage.setItem(WAPP_TPL_KEY, JSON.stringify(list)); }

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

function saveWappTemplate() {
    var nameEl   = document.getElementById('wapp-tpl-name');
    var preview  = document.getElementById('wapp-preview');
    var product  = (document.getElementById('wapp-product') || {}).value || 'personalizado';
    var link     = ((document.getElementById('wapp-link')   || {}).value || '').trim();
    var tplName  = nameEl ? nameEl.value.trim() : '';
    var message  = preview ? preview.value.trim() : '';
    if (!tplName) { if (nameEl) { nameEl.focus(); nameEl.placeholder = 'Digite um nome para o template'; } return; }
    if (!message) return;
    var list = loadWappTemplates();
    list.unshift({ id: Date.now(), name: tplName, product: product, message: message, link: link, date: new Date().toLocaleDateString('pt-BR') });
    saveWappTemplates(list);
    if (nameEl) nameEl.value = '';
    renderWappTemplates();
}

function useWappTemplate(id) {
    var tpl = loadWappTemplates().find(function(t) { return t.id === id; });
    if (!tpl) return;
    var preview = document.getElementById('wapp-preview');
    var linkEl  = document.getElementById('wapp-link');
    var prodEl  = document.getElementById('wapp-product');
    if (preview) preview.value = tpl.message;
    if (linkEl && tpl.link)  linkEl.value = tpl.link;
    if (prodEl && tpl.product) prodEl.value = tpl.product;
    document.getElementById('wapp-preview') && document.getElementById('wapp-preview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteWappTemplate(id) {
    saveWappTemplates(loadWappTemplates().filter(function(t) { return t.id !== id; }));
    renderWappTemplates();
}

function renderWappTemplates() {
    var el    = document.getElementById('wapp-tpl-list');
    var count = document.getElementById('wapp-tpl-count');
    if (!el) return;
    var list = loadWappTemplates();
    if (count) count.textContent = list.length ? list.length + ' salvo' + (list.length > 1 ? 's' : '') : '';
    if (!list.length) { el.innerHTML = '<div class="analytics-empty">Nenhum template salvo ainda.</div>'; return; }
    var html = '';
    for (var i = 0; i < list.length; i++) {
        var t = list[i];
        var label = WAPP_PRODUCT_LABELS[t.product] || t.product;
        html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid #f1f5f9;">'
            + '<div style="flex:1;min-width:0;">'
            + '<div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:4px;">' + cesc(t.name) + '</div>'
            + '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">'
            + '<span class="camp-channel-badge">' + cesc(label) + '</span>'
            + '<span style="font-size:11px;color:#94a3b8;">' + cesc(t.date) + '</span>'
            + '</div>'
            + '<div style="font-size:12px;color:#64748b;line-height:1.5;white-space:pre-wrap;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">' + cesc(t.message) + '</div>'
            + '</div>'
            + '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">'
            + '<button class="camp-action-btn" onclick="useWappTemplate(' + t.id + ')" title="Usar este template">Usar</button>'
            + '<button class="camp-action-btn camp-del-btn camp-icon-only" onclick="deleteWappTemplate(' + t.id + ')" title="Excluir">'
            + '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>'
            + '</div>'
            + '</div>';
    }
    el.innerHTML = html;
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

// â”€â”€ EXPORT CSV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function exportCampaignsCSV() {
    var list = loadCampaigns();
    if (!list.length) { alert('Nenhum link salvo para exportar.'); return; }
    var header = ['Projeto', 'Campanha', 'Canal', 'Origem', 'Meio', 'Cliques', 'Ultimo Clique', 'Data', 'Codigo', 'Link Curto', 'URL Completa'];
    var rows = list.map(function(c) {
        return [
            '"' + String(getCampaignProject(c)).replace(/"/g, '""') + '"',
            '"' + String(c.name    || '').replace(/"/g, '""') + '"',
            '"' + String(c.channel || '').replace(/"/g, '""') + '"',
            '"' + String(c.source  || '').replace(/"/g, '""') + '"',
            '"' + String(c.medium  || '').replace(/"/g, '""') + '"',
            c.clicks || 0,
            '"' + String(c.lastClick ? formatCampaignDate(c.lastClick) : '').replace(/"/g, '""') + '"',
            '"' + String(c.date    || '').replace(/"/g, '""') + '"',
            '"' + String(c.shortCode || extractShortCode(c.shortUrl || '') || '').replace(/"/g, '""') + '"',
            '"' + String(c.shortUrl || '').replace(/"/g, '""') + '"',
            '"' + String(c.url     || '').replace(/"/g, '""') + '"',
        ].join(',');
    });
    var csv = 'ï»¿' + [header.join(',')].concat(rows).join('\r\n');
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

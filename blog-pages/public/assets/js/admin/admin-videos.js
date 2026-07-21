/**
 * Admin Dashboard - AI Video Batch Planner
 */

var VIDEO_STORAGE_KEY = 'mb_ai_video_jobs_v1';
var VIDEO_EDITORIAL_STORAGE_KEY = 'mb_ai_video_editorial_v1';
var VIDEO_INFLUENCER_STORAGE_KEY = 'mb_ai_video_influencers_v2';
var VIDEO_SECTION_STORAGE_KEY = 'mb_ai_video_active_section_v1';
var VIDEO_SOCIAL_ACCOUNTS_STORAGE_KEY = 'mb_ai_video_social_accounts_v1';
var VIDEO_META_ASSETS_STORAGE_KEY = 'mb_ai_video_meta_assets_v1';
var VIDEO_META_OAUTH_RESULT_STORAGE_KEY = 'mb_meta_oauth_result_v1';
var VIDEO_INFLUENCER_COLLAPSED_STORAGE_KEY = 'mb_ai_video_influencer_collapsed_v1';
var VIDEO_STATUSES = ['Roteiro pronto', 'Aguardando HeyGen', 'Enviado ao HeyGen', 'Gerando video', 'Edicao pendente', 'Aguardando Remotion', 'Editando no Remotion', 'Video editado', 'Aprovado', 'Publicado', 'Falhou'];
var VIDEO_EDITORIAL_STATUSES = [
    { id: 'ideia', label: 'Ideias' },
    { id: 'roteiro', label: 'Roteiro' },
    { id: 'producao', label: 'Producao' },
    { id: 'publicado', label: 'Publicado' }
];
var VIDEO_EDITORIAL_PILLARS = [
    { id: 'educacao-pj', name: 'Educacao financeira PJ', desc: 'Explicar conta PJ, credito, maquininha e rotina financeira de forma simples.' },
    { id: 'beneficios-praticos', name: 'Beneficios praticos', desc: 'Mostrar impacto direto no dia a dia da empresa.' },
    { id: 'quebra-objecoes', name: 'Quebra de objecoes', desc: 'Reduzir medo de burocracia, custo, processo digital ou aprovacao.' },
    { id: 'comparativos', name: 'Comparativos consultivos', desc: 'Ajudar o empresario a comparar caminhos sem venda agressiva.' },
    { id: 'bastidores-jornada', name: 'Bastidores da jornada', desc: 'Mostrar etapas de atendimento, documentos e proximo passo.' },
    { id: 'oferta-conversao', name: 'Oferta e conversao', desc: 'Direcionar para WhatsApp, simulacao, abertura de conta ou atendimento.' }
];
var VIDEO_MAX_PROFILE_FILE_BYTES = 15 * 1024 * 1024;
var VIDEO_PROFILE_DB_NAME = 'mb_ai_video_profile_files_v1';
var VIDEO_PROFILE_DB_STORE = 'files';
var HELENA_DUARTE_REFERENCES = [
    { src: '/images/influencers/helena-duarte/autorretrato-iluminacao-suave.png', label: 'Autorretrato' },
    { src: '/images/influencers/helena-duarte/retrato-corporativo-minimalista.png', label: 'Retrato corporativo' },
    { src: '/images/influencers/helena-duarte/retrato-sorridente-minimalista.png', label: 'Retrato sorridente' },
    { src: '/images/influencers/helena-duarte/selfie-ambiente-moderno.png', label: 'Selfie ambiente moderno' },
    { src: '/images/influencers/helena-duarte/escritorio-moderno.png', label: 'Escritorio moderno' },
    { src: '/images/influencers/helena-duarte/corredor-corporativo.png', label: 'Corredor corporativo' },
    { src: '/images/influencers/helena-duarte/smartphone-cartao-banco.png', label: 'Smartphone e cartao' },
    { src: '/images/influencers/helena-duarte/c6-app-apresentacao.png', label: 'Apresentacao C6 Bank' }
];
var HELENA_DUARTE_MANUAL = "A Helena Duarte foi criada como uma consultora financeira digital da MB Negócios, com o papel de representar a empresa em conteúdos, anúncios, vídeos curtos, WhatsApp, landing pages e materiais comerciais. A proposta é que ela seja uma personagem virtual com imagem profissional, linguagem simples e presença consistente, ajudando empresários a entender soluções financeiras de forma mais clara e consultiva.\n\n1. Papel estratégico da Helena\n\nA Helena funciona como uma ponte entre os produtos financeiros e a realidade do empresário. Ela não deve ser apenas uma “influenciadora bonita”, mas uma personagem com função comercial e educativa.\n\nO papel dela é:\n\ngerar confiança;\neducar o público;\nquebrar objeções;\nexplicar soluções como Conta PJ, C6 Pay, cartão empresarial, crédito e atendimento consultivo;\nconduzir o cliente para WhatsApp, abertura de conta ou atendimento com especialista.\n\nA direção central do manual é:\n\nMenos burocracia, mais clareza para empresas que precisam de soluções financeiras práticas.\n\n2. Perfil da personagem\n\nA Helena é posicionada como uma mulher de aproximadamente 29 a 32 anos, com postura de especialista acessível. Ela deve passar segurança, mas sem parecer distante ou excessivamente formal.\n\nCaracterísticas principais:\n\nnome: Helena Duarte;\nfunção: consultora financeira digital / apresentadora virtual da MB Negócios;\narquétipo: especialista acessível;\npersonalidade: segura, objetiva, simpática, didática, elegante e comercial na medida certa;\nenergia: confiante, próxima e profissional;\npúblico: empresários, donos de pequenos e médios negócios, gestores financeiros e responsáveis por decisões bancárias PJ.\n3. Direção visual\n\nVisualmente, a Helena precisa manter uma aparência profissional, natural e consistente.\n\nElementos fixos da aparência:\n\nrosto oval levemente alongado;\npele morena clara com subtom quente-neutro;\ntextura de pele natural, com poros e pequenas imperfeições;\ncabelo longo, castanho escuro, cacheado e volumoso;\nolhos castanho/avelã;\nexpressão segura, inteligente, simpática e espontânea;\nmaquiagem natural a moderada;\npostura ereta, confiante e com gestos leves.\n\nEstilo recomendado:\n\nblazer preto, bege, azul-marinho ou grafite;\nblusa neutra;\ncalça de alfaiataria;\nacessórios discretos;\nmaquiagem profissional, sem parecer artificial.\n\nO manual também orienta evitar roupas muito sensuais, estética casual demais, aparência plástica, expressão robótica ou cenários que não comuniquem negócios.\n\n4. Tom de voz e linguagem\n\nA Helena deve falar de forma clara, objetiva e consultiva. A ideia é explicar como uma especialista, mas com linguagem simples, como se estivesse conversando com o empresário.\n\nTom ideal:\n\nconsultivo;\nsimples;\ndidático;\nseguro;\npróximo;\nsem economês pesado;\nsem promessas absolutas;\nsem pressão comercial exagerada.\n\nFrase que resume o posicionamento da fala:\n\n“Eu te ajudo a entender o que realmente faz sentido para a rotina financeira da sua empresa.”\n\n5. Narrativa central\n\nA Helena foi criada para representar a visão consultiva da MB Negócios: transformar produtos financeiros empresariais em decisões mais simples, claras e acessíveis para quem empreende.\n\nEla não precisa ter uma biografia falsa. A função dela é simbólica e funcional: explicar, orientar e conduzir o empresário para o próximo passo.\n\nNarrativa em uma frase:\n\nUma consultora digital criada para explicar soluções financeiras empresariais de forma simples, humana e estratégica.\n\n6. Pilares de conteúdo\n\nO manual define seis pilares principais para a criação de conteúdo da Helena:\n\nPilar\tObjetivo\nEducação financeira PJ\tExplicar conta PJ, crédito, maquininha, fluxo financeiro e custos de forma simples\nBenefícios práticos\tMostrar como os produtos ajudam no dia a dia da empresa\nQuebra de objeções\tReduzir medo de burocracia, custo, processo digital ou aprovação\nComparativos consultivos\tAjudar o público a comparar opções sem venda agressiva\nBastidores da jornada\tMostrar etapas como falar com consultor, enviar documentos e começar a operar\nOferta e conversão\tDirecionar para WhatsApp, simulação, abertura de conta ou atendimento consultivo\n7. Aplicações por canal\n\nA Helena pode ser usada em diferentes canais, sempre adaptando o tom e o formato.\n\nRedes sociais: conteúdos educativos, dicas, objeções e bastidores.\nAnúncios: vídeos com dor explícita, solução e CTA claro.\nWhatsApp: mensagens curtas, consultivas e personalizadas.\nLanding pages: imagem de confiança ao lado da oferta ou CTA.\nInstitucional: apresentadora virtual da marca, com tom mais sóbrio e credível.\n\n8. Guia de consistência\n\nPara não descaracterizar a personagem, todos os conteúdos precisam manter:\n\nrosto e idade aparentes consistentes;\ncabelo longo, cacheado e castanho escuro;\npele morena clara com textura natural;\nroupa executiva moderna;\ncenário corporativo ou comercial premium;\ntom consultivo e simples;\nfunção sempre ligada à orientação financeira empresarial.\n\nO manual reforça que a Helena não deve virar uma personagem de lifestyle genérico. Ela precisa estar sempre conectada à MB Negócios e ao universo de soluções financeiras para empresas.\n\n9. Cuidados importantes\n\nO manual deixa claro que a Helena deve ser comunicada com transparência como consultora/apresentadora virtual da marca. Não é recomendado fingir que ela é uma pessoa real com histórico pessoal, experiências próprias ou depoimentos não verificados.\n\nAntes de publicar qualquer conteúdo com a Helena, o checklist principal é:\n\na personagem está claramente ligada à MB Negócios?\na fala tem gancho, contexto, benefício e CTA?\na imagem parece profissional da área financeira?\nrosto, cabelo e tom de voz estão consistentes?\no conteúdo evita promessas exageradas?\no CTA direciona para WhatsApp, abertura de conta, simulação ou atendimento?\nResumo final\n\nA Helena Duarte é a personagem digital criada para ser o rosto consultivo da MB Negócios. Ela deve transmitir credibilidade, clareza, proximidade e profissionalismo, ajudando empresários a entender soluções como Conta PJ, C6 Pay, cartão empresarial, crédito e suporte consultivo.\n\nA função dela é tornar o conteúdo financeiro mais humano e simples, sem perder o tom profissional da marca. O uso correto da Helena precisa manter consistência visual, linguagem consultiva, transparência sobre ser uma personagem virtual e foco em gerar confiança para levar o público ao atendimento comercial.";
var DEFAULT_VIDEO_INFLUENCERS = {
    'mb-negocios': {
        activeId: 'heena-duarte',
        items: [{
            id: 'heena-duarte',
            name: 'Helena Duarte',
            referenceUrl: '/images/influencers/helena-duarte/autorretrato-iluminacao-suave.png',
            photoDataUrl: '',
            photoUrl: '/images/influencers/helena-duarte/autorretrato-iluminacao-suave.png',
            photoFileName: 'autorretrato-iluminacao-suave.png',
            referenceImages: HELENA_DUARTE_REFERENCES.slice(),
            
            manual: HELENA_DUARTE_MANUAL,
            manualFileName: '',
            manualFileKey: '',
            manualFileDataUrl: '',
            manualFileType: '',
            manualFileSize: 0,
            avatar: 'Helena Duarte',
            avatarId: '497d434789434baaa674261928606714',
            voiceId: 'c9b8dff8a19f45678935ca5df08aaf7c',
            updatedAt: '2026-07-13T00:00:00.000Z'
        }]
    }
};

function vesc(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugVideoId(value) {
    return String(value || 'influencer').trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || ('influencer-' + Date.now());
}

function loadVideosQueue() {
    try { return JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY) || '[]'); } catch (e) { return []; }
}

function saveVideosQueue(list) { localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(list)); }

function loadVideoEditorialIdeas() {
    try { return JSON.parse(localStorage.getItem(VIDEO_EDITORIAL_STORAGE_KEY) || '[]'); } catch (e) { return []; }
}

function saveVideoEditorialIdeas(list) { localStorage.setItem(VIDEO_EDITORIAL_STORAGE_KEY, JSON.stringify(list)); }

function getVideoPillar(id) {
    return VIDEO_EDITORIAL_PILLARS.find(function(pillar) { return pillar.id === id; }) || VIDEO_EDITORIAL_PILLARS[0];
}

function normalizeInfluencerGroup(value) {
    if (Array.isArray(value)) return { activeId: value[0] ? value[0].id : '', items: value };
    if (value && Array.isArray(value.items)) return { activeId: value.activeId || (value.items[0] ? value.items[0].id : ''), items: value.items };
    if (value && (value.name || value.avatarId || value.voiceId || value.manual)) {
        var id = value.id || slugVideoId(value.name || value.avatar || 'influencer');
        return { activeId: id, items: [Object.assign({}, value, { id: id })] };
    }
    return { activeId: '', items: [] };
}

function mergeDefaultVideoInfluencerData(map) {
    Object.keys(DEFAULT_VIDEO_INFLUENCERS).forEach(function(projectId) {
        var current = normalizeInfluencerGroup(map[projectId]);
        var defaults = normalizeInfluencerGroup(DEFAULT_VIDEO_INFLUENCERS[projectId]);
        defaults.items.forEach(function(defaultItem) {
            var index = current.items.findIndex(function(item) { return item.id === defaultItem.id; });
            if (index < 0) return;
            if (!current.items[index].photoUrl && defaultItem.photoUrl) current.items[index].photoUrl = defaultItem.photoUrl;
            if (!current.items[index].photoFileName && defaultItem.photoFileName) current.items[index].photoFileName = defaultItem.photoFileName;
            if (current.items[index].name === 'Heena Duarte') current.items[index].name = defaultItem.name;
            if (current.items[index].avatar === 'Heena Duarte') current.items[index].avatar = defaultItem.avatar;
            if (!current.items[index].manual && defaultItem.manual) current.items[index].manual = defaultItem.manual;
            if (!current.items[index].referenceUrl && defaultItem.referenceUrl) current.items[index].referenceUrl = defaultItem.referenceUrl;
            if (!Array.isArray(current.items[index].referenceImages) || !current.items[index].referenceImages.length) {
                current.items[index].referenceImages = defaultItem.referenceImages || [];
            }
        });
        if (current.items.length) map[projectId] = current;
    });
    return map;
}

function loadVideoInfluencers() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(VIDEO_INFLUENCER_STORAGE_KEY) || '{}'); } catch (e) { raw = {}; }
    var legacy = {};
    try { legacy = JSON.parse(localStorage.getItem('mb_ai_video_influencers_v1') || '{}'); } catch (e2) { legacy = {}; }
    var source = Object.keys(raw).length ? raw : legacy;
    var map = {};
    Object.keys(source).forEach(function(projectId) { map[projectId] = normalizeInfluencerGroup(source[projectId]); });
    Object.keys(DEFAULT_VIDEO_INFLUENCERS).forEach(function(projectId) {
        if (!map[projectId] || !map[projectId].items.length) map[projectId] = DEFAULT_VIDEO_INFLUENCERS[projectId];
    });
    return mergeDefaultVideoInfluencerData(map);
}

function saveVideoInfluencers(map) { localStorage.setItem(VIDEO_INFLUENCER_STORAGE_KEY, JSON.stringify(map)); }

function getVideoProjects() {
    if (typeof loadCampaignProjects === 'function') return loadCampaignProjects();
    return [{ id: 'mb-finance', name: 'MB Finance' }, { id: 'mb-negocios', name: 'MB Negocios' }];
}

function populateVideoProjects() {
    var select = document.getElementById('video-project');
    if (!select) return;
    var current = select.value;
    var projects = getVideoProjects();
    select.innerHTML = projects.map(function(project) {
        return '<option value="' + vesc(project.id) + '">' + vesc(project.name) + '</option>';
    }).join('');
    if (projects.some(function(project) { return project.id === current; })) select.value = current;
    loadProjectInfluencerToForm();
}

function getSelectedVideoProjectId() {
    return (document.getElementById('video-project') || {}).value || '';
}

function getVideoProjectName(id) {
    var project = getVideoProjects().find(function(item) { return item.id === id; });
    return project ? project.name : 'Sem projeto';
}

function getProjectInfluencerGroup(projectId) {
    return normalizeInfluencerGroup(loadVideoInfluencers()[projectId || getSelectedVideoProjectId()]);
}

function getSelectedInfluencerId() {
    var select = document.getElementById('video-influencer-select');
    return select ? select.value : '';
}

function getActiveProjectInfluencer() {
    var group = getProjectInfluencerGroup();
    var selectedId = getSelectedInfluencerId() || group.activeId;
    return group.items.find(function(item) { return item.id === selectedId; }) || group.items[0] || null;
}

function getSelectedInfluencerForForm() {
    var selectedId = getSelectedInfluencerId();
    if (!selectedId) return null;
    var group = getProjectInfluencerGroup();
    return group.items.find(function(item) { return item.id === selectedId; }) || null;
}

function getInitials(name) {
    var parts = String(name || 'IA').trim().split(/\s+/).filter(Boolean);
    return ((parts[0] || 'I')[0] + (parts[1] || parts[0] || 'A')[0]).toUpperCase();
}

function setInfluencerForm(influencer) {
    influencer = influencer || {};
    var nameEl = document.getElementById('video-influencer-name');
    var refEl = document.getElementById('video-influencer-reference');
    var manualEl = document.getElementById('video-influencer-manual');
    var avatarIdEl = document.getElementById('video-avatar-id');
    var voiceIdEl = document.getElementById('video-voice-id');
    var photoNameEl = document.getElementById('video-influencer-photo-name');
    var manualNameEl = document.getElementById('video-influencer-manual-name');
    if (nameEl) nameEl.value = influencer.name || '';
    if (refEl) refEl.value = influencer.referenceUrl || '';
    if (manualEl) manualEl.value = influencer.manual || '';
    if (avatarIdEl) avatarIdEl.value = influencer.avatarId || '';
    if (voiceIdEl) voiceIdEl.value = influencer.voiceId || '';
    if (photoNameEl) photoNameEl.innerHTML = influencer.photoFileName ? '<strong>Foto:</strong> ' + vesc(influencer.photoFileName) : 'Nenhuma foto anexada.';
    if (manualNameEl) manualNameEl.innerHTML = influencer.manualFileName ? '<strong>Manual:</strong> ' + vesc(influencer.manualFileName) + (influencer.manualFileSize ? ' <span>(' + formatFileSize(influencer.manualFileSize) + ')</span>' : '') : 'Nenhum manual anexado.';
    renderInfluencerReferenceGallery(influencer);
    updateInfluencerFormPreview();
}

function getInfluencerPhotoSrc(influencer) {
    return influencer && (influencer.photoDataUrl || influencer.photoUrl || '');
}

function renderInfluencerAvatar(el, influencer, fallbackName) {
    if (!el) return;
    var photo = getInfluencerPhotoSrc(influencer);
    el.classList.toggle('has-photo', !!photo);
    el.innerHTML = photo ? '<img src="' + vesc(photo) + '" alt="Foto da influencer">' : vesc(getInitials(fallbackName || (influencer && influencer.name)));
}

function renderInfluencerReferenceGallery(influencer) {
    var el = document.getElementById('video-influencer-reference-gallery');
    if (!el) return;
    var images = Array.isArray(influencer && influencer.referenceImages) ? influencer.referenceImages : [];
    if (!images.length) {
        el.innerHTML = '<div class="video-reference-empty">Nenhuma referencia visual fixa neste perfil.</div>';
        return;
    }
    el.innerHTML = images.map(function(image) {
        var active = getInfluencerPhotoSrc(influencer) === image.src ? ' active' : '';
        return '<button type="button" class="video-reference-thumb' + active + '" onclick="useInfluencerReferenceImage(\'' + vesc(image.src) + '\',\'' + vesc(image.label || '') + '\')">'
            + '<img src="' + vesc(image.src) + '" alt="' + vesc(image.label || 'Referencia visual') + '" loading="lazy">'
            + '<span>' + vesc(image.label || 'Referencia') + '</span>'
            + '</button>';
    }).join('');
}

function useInfluencerReferenceImage(src, label) {
    if (!src) return;
    updateActiveInfluencerPatch({
        photoUrl: src,
        photoDataUrl: '',
        photoFileName: label || src.split('/').pop(),
        referenceUrl: src
    });
    setVideoStatus('Referencia visual aplicada como foto principal.');
}

function updateInfluencerFormPreview() {
    var name = ((document.getElementById('video-influencer-name') || {}).value || '').trim();
    renderInfluencerAvatar(document.getElementById('video-influencer-form-initials'), getSelectedInfluencerForForm(), name);
}

function getVideoInfluencerCollapsed() {
    try { return localStorage.getItem(VIDEO_INFLUENCER_COLLAPSED_STORAGE_KEY) !== 'open'; } catch (e) { return true; }
}

function setVideoInfluencerCollapsed(collapsed) {
    try { localStorage.setItem(VIDEO_INFLUENCER_COLLAPSED_STORAGE_KEY, collapsed ? 'closed' : 'open'); } catch (e) {}
    updateVideoInfluencerCollapse();
}

function updateVideoInfluencerCollapse() {
    var card = document.getElementById('video-influencer-card');
    var btn = document.getElementById('video-influencer-toggle');
    var collapsed = getVideoInfluencerCollapsed();
    if (card) card.classList.toggle('is-collapsed', collapsed);
    if (btn) {
        btn.textContent = collapsed ? 'Editar' : 'Recolher';
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
}

function toggleVideoInfluencerCard() {
    var card = document.getElementById('video-influencer-card');
    setVideoInfluencerCollapsed(!(card && card.classList.contains('is-collapsed')));
}

function openVideoInfluencerCard() {
    setVideoInfluencerCollapsed(false);
}
function renderProjectInfluencerList() {
    var group = getProjectInfluencerGroup();
    var select = document.getElementById('video-influencer-select');
    var empty = document.getElementById('video-influencer-empty');
    var summary = document.getElementById('video-influencer-summary');
    if (!select) return;
    select.innerHTML = group.items.map(function(item) {
        return '<option value="' + vesc(item.id) + '">' + vesc(item.name || 'Influencer sem nome') + '</option>';
    }).join('');
    select.value = group.items.some(function(item) { return item.id === group.activeId; }) ? group.activeId : (group.items[0] ? group.items[0].id : '');
    if (empty) empty.style.display = group.items.length ? 'none' : '';
    if (summary) summary.style.display = group.items.length ? 'grid' : 'none';
    updateInfluencerSummary();
}

function updateInfluencerSummary() {
    var influencer = getActiveProjectInfluencer();
    var initials = document.getElementById('video-influencer-initials');
    var nameEl = document.getElementById('video-influencer-summary-name');
    var metaEl = document.getElementById('video-influencer-summary-meta');
    if (!influencer) return;
    renderInfluencerAvatar(initials, influencer, influencer.name);
    if (nameEl) nameEl.textContent = influencer.name || 'Influencer sem nome';
    if (metaEl) {
        var ids = [];
        if (influencer.photoDataUrl) ids.push('Foto OK');
        if (influencer.avatarId) ids.push('Aparencia OK');
        if (influencer.voiceId) ids.push('Voz OK');
        if (influencer.manualFileName || influencer.manual) ids.push('Manual OK');
        metaEl.textContent = ids.length ? ids.join(' / ') : 'Perfil incompleto';
    }
}

function loadProjectInfluencerToForm() {
    updateVideoInfluencerCollapse();
    renderProjectInfluencerList();
    setInfluencerForm(getActiveProjectInfluencer());
    applyProjectInfluencer(false);
}

function onVideoProjectChange() {
    loadProjectInfluencerToForm();
}

function onVideoInfluencerChange() {
    var projectId = getSelectedVideoProjectId();
    var map = loadVideoInfluencers();
    map[projectId] = getProjectInfluencerGroup(projectId);
    map[projectId].activeId = getSelectedInfluencerId();
    saveVideoInfluencers(map);
    setInfluencerForm(getActiveProjectInfluencer());
    applyProjectInfluencer(false);
    updateInfluencerSummary();
}

function readInfluencerForm() {
    var name = ((document.getElementById('video-influencer-name') || {}).value || '').trim();
    var existing = getSelectedInfluencerForForm() || {};
    return {
        id: getSelectedInfluencerId() || slugVideoId(name),
        name: name,
        referenceUrl: ((document.getElementById('video-influencer-reference') || {}).value || '').trim(),
        photoDataUrl: existing.photoDataUrl || '',
        photoUrl: existing.photoUrl || '',
        photoFileName: existing.photoFileName || '',
        referenceImages: Array.isArray(existing.referenceImages) ? existing.referenceImages : [],
        manual: ((document.getElementById('video-influencer-manual') || {}).value || '').trim(),
        manualFileName: existing.manualFileName || '',
        manualFileKey: existing.manualFileKey || '',
        manualFileDataUrl: existing.manualFileDataUrl || '',
        manualFileType: existing.manualFileType || '',
        manualFileSize: existing.manualFileSize || 0,
        avatar: name,
        avatarId: ((document.getElementById('video-avatar-id') || {}).value || '').trim(),
        voiceId: ((document.getElementById('video-voice-id') || {}).value || '').trim(),
        updatedAt: new Date().toISOString()
    };
}

function newProjectInfluencer() {
    openVideoInfluencerCard();
    var select = document.getElementById('video-influencer-select');
    if (select) select.value = '';
    setInfluencerForm({ id: '', name: '', referenceUrl: '', photoDataUrl: '', photoUrl: '', photoFileName: '', referenceImages: [], manual: '', manualFileName: '', manualFileKey: '', manualFileDataUrl: '', manualFileType: '', manualFileSize: 0, avatarId: '', voiceId: '' });
    var nameEl = document.getElementById('video-influencer-name');
    if (nameEl) nameEl.focus();
}

function saveProjectInfluencer() {
    var projectId = getSelectedVideoProjectId();
    if (!projectId) { setVideoStatus('Selecione um projeto antes de salvar a influencer.'); return; }
    var influencer = readInfluencerForm();
    if (!influencer.name) { setVideoStatus('Digite o nome da influencer antes de salvar.'); return; }
    var map = loadVideoInfluencers();
    var group = getProjectInfluencerGroup(projectId);
    var existingIndex = group.items.findIndex(function(item) { return item.id === influencer.id; });
    if (existingIndex >= 0) group.items[existingIndex] = influencer;
    else group.items.push(influencer);
    group.activeId = influencer.id;
    map[projectId] = group;
    saveVideoInfluencers(map);
    renderProjectInfluencerList();
    var select = document.getElementById('video-influencer-select');
    if (select) select.value = influencer.id;
    setInfluencerForm(influencer);
    applyProjectInfluencer(false);
    setVideoStatus('Influencer salva para este projeto.');
}

function deleteProjectInfluencer() {
    var projectId = getSelectedVideoProjectId();
    var selectedId = getSelectedInfluencerId();
    if (!projectId || !selectedId) return;
    if (!confirm('Excluir esta influencer deste projeto?')) return;
    var map = loadVideoInfluencers();
    var group = getProjectInfluencerGroup(projectId);
    group.items = group.items.filter(function(item) { return item.id !== selectedId; });
    group.activeId = group.items[0] ? group.items[0].id : '';
    map[projectId] = group;
    saveVideoInfluencers(map);
    loadProjectInfluencerToForm();
}

function applyProjectInfluencer(showMessage) {
    var influencer = getActiveProjectInfluencer();
    if (!influencer) return;
    var avatarEl = document.getElementById('video-avatar');
    var avatarIdEl = document.getElementById('video-avatar-id');
    var voiceIdEl = document.getElementById('video-voice-id');
    if (avatarEl) avatarEl.value = influencer.name || '';
    if (avatarIdEl && influencer.avatarId) avatarIdEl.value = influencer.avatarId;
    if (voiceIdEl && influencer.voiceId) voiceIdEl.value = influencer.voiceId;
    if (showMessage !== false) setVideoStatus('Influencer aplicada ao gerador de conteudo.');
}

function formatFileSize(bytes) {
    var value = Number(bytes || 0);
    if (!value) return '';
    if (value < 1024 * 1024) return Math.max(1, Math.round(value / 1024)) + ' KB';
    return (value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1).replace('.0', '') + ' MB';
}

function openVideoProfileDb() {
    return new Promise(function(resolve, reject) {
        if (!window.indexedDB) { reject(new Error('Seu navegador nao suporta armazenamento de arquivos.')); return; }
        var request = indexedDB.open(VIDEO_PROFILE_DB_NAME, 1);
        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(VIDEO_PROFILE_DB_STORE)) db.createObjectStore(VIDEO_PROFILE_DB_STORE);
        };
        request.onsuccess = function() { resolve(request.result); };
        request.onerror = function() { reject(request.error || new Error('Erro ao abrir armazenamento local.')); };
    });
}

function saveVideoProfileFile(key, file) {
    return openVideoProfileDb().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction(VIDEO_PROFILE_DB_STORE, 'readwrite');
            tx.objectStore(VIDEO_PROFILE_DB_STORE).put({
                name: file.name,
                type: file.type || '',
                size: file.size || 0,
                updatedAt: new Date().toISOString(),
                blob: file
            }, key);
            tx.oncomplete = function() { db.close(); resolve(); };
            tx.onerror = function() { db.close(); reject(tx.error || new Error('Erro ao salvar arquivo local.')); };
        });
    });
}

function updateActiveInfluencerPatch(patch) {
    var projectId = getSelectedVideoProjectId();
    if (!projectId) { setVideoStatus('Selecione um projeto antes de anexar arquivos.'); return; }
    var current = readInfluencerForm();
    if (!current.name) { setVideoStatus('Digite o nome da influencer antes de anexar arquivos.'); return; }
    var map = loadVideoInfluencers();
    var group = getProjectInfluencerGroup(projectId);
    var existingIndex = group.items.findIndex(function(item) { return item.id === current.id; });
    var influencer = Object.assign({}, existingIndex >= 0 ? group.items[existingIndex] : current, current, patch, { updatedAt: new Date().toISOString() });
    if (existingIndex >= 0) group.items[existingIndex] = influencer;
    else group.items.push(influencer);
    group.activeId = influencer.id;
    map[projectId] = group;
    saveVideoInfluencers(map);
    renderProjectInfluencerList();
    var select = document.getElementById('video-influencer-select');
    if (select) select.value = influencer.id;
    setInfluencerForm(influencer);
    applyProjectInfluencer(false);
}

function importInfluencerPhoto(input) {
    var file = input && input.files ? input.files[0] : null;
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { setVideoStatus('Anexe uma imagem PNG, JPG ou WebP.'); input.value = ''; return; }
    var reader = new FileReader();
    reader.onload = function(event) {
        var image = new Image();
        image.onload = function() {
            var canvas = document.createElement('canvas');
            var size = 320;
            canvas.width = size;
            canvas.height = size;
            var ctx = canvas.getContext('2d');
            var scale = Math.max(size / image.width, size / image.height);
            var w = image.width * scale;
            var h = image.height * scale;
            ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            updateActiveInfluencerPatch({ photoDataUrl: dataUrl, photoUrl: '', photoFileName: file.name });
            setVideoStatus('Foto anexada ao perfil da influencer.');
        };
        image.onerror = function() { setVideoStatus('Nao foi possivel carregar essa imagem.'); };
        image.src = String(event.target.result || '');
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function importInfluencerManual(input) {
    var file = input && input.files ? input.files[0] : null;
    if (!file) return;
    if (file.size > VIDEO_MAX_PROFILE_FILE_BYTES) {
        setVideoStatus('Manual muito grande. Use um arquivo de ate 15 MB.');
        input.value = '';
        return;
    }
    var projectId = getSelectedVideoProjectId();
    var current = readInfluencerForm();
    if (!projectId || !current.name) {
        setVideoStatus('Selecione o projeto e digite o nome da influencer antes de anexar o manual.');
        input.value = '';
        return;
    }
    var isText = /\.(txt|md|markdown|json)$/i.test(file.name || '') || /^text\//.test(file.type || '');
    var fileKey = projectId + ':' + current.id + ':manual:' + Date.now();
    var patch = {
        manualFileName: file.name,
        manualFileKey: fileKey,
        manualFileDataUrl: '',
        manualFileType: file.type || '',
        manualFileSize: file.size || 0
    };

    function finishSave() {
        saveVideoProfileFile(fileKey, file)
            .then(function() {
                updateActiveInfluencerPatch(patch);
                setVideoStatus(isText ? 'Manual anexado e resumo preenchido.' : 'PDF anexado ao perfil da influencer.');
            })
            .catch(function(error) {
                setVideoStatus(error.message || 'Erro ao salvar o manual no navegador.');
            });
    }

    if (isText) {
        var reader = new FileReader();
        reader.onload = function(event) {
            patch.manual = String(event.target.result || '');
            var manual = document.getElementById('video-influencer-manual');
            if (manual) manual.value = patch.manual;
            finishSave();
        };
        reader.readAsText(file, 'utf-8');
    } else {
        finishSave();
    }
    input.value = '';
}

function loadVideoSocialAccounts() {
    try { return JSON.parse(localStorage.getItem(VIDEO_SOCIAL_ACCOUNTS_STORAGE_KEY) || '{}') || {}; } catch (e) { return {}; }
}

function saveVideoSocialAccounts(map) {
    localStorage.setItem(VIDEO_SOCIAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(map || {}));
}

function loadImportedVideoMetaAccounts() {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(VIDEO_META_ASSETS_STORAGE_KEY) || '[]') || []; } catch (e) { list = []; }
    return Array.isArray(list) ? list : [];
}

function saveImportedVideoMetaAccounts(list) {
    localStorage.setItem(VIDEO_META_ASSETS_STORAGE_KEY, JSON.stringify(Array.isArray(list) ? list : []));
}

function normalizeVideoMetaAccount(account) {
    account = account || {};
    return {
        id: account.id || slugVideoId((account.platform || 'meta') + '-' + (account.name || account.externalId || Date.now())),
        platform: account.platform === 'facebook' ? 'facebook' : 'instagram',
        name: account.name || 'Perfil Meta',
        handle: account.handle || '',
        url: account.url || '',
        externalId: account.externalId || '',
        pageId: account.pageId || '',
        connectedAt: account.connectedAt || new Date().toISOString(),
        connection: 'meta-oauth'
    };
}

function mergeVideoMetaAccounts(existing, incoming) {
    var list = Array.isArray(existing) ? existing.slice() : [];
    (Array.isArray(incoming) ? incoming : []).forEach(function(account) {
        var normalized = normalizeVideoMetaAccount(account);
        var index = list.findIndex(function(item) {
            return item.id === normalized.id || (item.externalId && normalized.externalId && item.externalId === normalized.externalId);
        });
        if (index >= 0) list[index] = Object.assign({}, list[index], normalized);
        else list.push(normalized);
    });
    return list;
}

function getAllVideoSocialAccounts() {
    var imported = loadImportedVideoMetaAccounts();
    var legacy = [];
    var map = loadVideoSocialAccounts();
    Object.keys(map).forEach(function(projectId) {
        var rows = Array.isArray(map[projectId]) ? map[projectId] : [];
        rows.forEach(function(row) { if (row && typeof row === 'object') legacy.push(row); });
    });
    return mergeVideoMetaAccounts(imported, legacy);
}

function getVideoSocialPlatformLabel(platform) {
    return platform === 'facebook' ? 'Facebook' : 'Instagram';
}

function getProjectVideoSocialAccountIds(projectId) {
    var map = loadVideoSocialAccounts();
    var rows = map[projectId || getSelectedVideoProjectId()] || [];
    if (!Array.isArray(rows)) return [];
    return rows.map(function(row) { return typeof row === 'string' ? row : row && row.id; }).filter(Boolean);
}

function saveProjectVideoSocialAccountIds(projectId, ids) {
    var map = loadVideoSocialAccounts();
    map[projectId || getSelectedVideoProjectId()] = Array.isArray(ids) ? ids : [];
    saveVideoSocialAccounts(map);
}

function getProjectVideoSocialAccounts(projectId) {
    var ids = getProjectVideoSocialAccountIds(projectId);
    var all = getAllVideoSocialAccounts();
    return ids.map(function(id) { return all.find(function(account) { return account.id === id; }); }).filter(Boolean);
}

function formatVideoSocialAccountLabel(account) {
    var platform = getVideoSocialPlatformLabel(account.platform);
    return platform + ': ' + (account.name || account.handle || 'Perfil sem nome');
}

function syncVideoChannelSelectionState() {
    Array.prototype.slice.call(document.querySelectorAll('.video-channel-option')).forEach(function(label) {
        var input = label.querySelector('input[name="video-channel"]');
        label.classList.toggle('is-selected', !!(input && input.checked));
    });
    Array.prototype.slice.call(document.querySelectorAll('.video-connected-account')).forEach(function(label) {
        var input = label.querySelector('input[name="video-connected-account"]');
        label.classList.toggle('is-selected', !!(input && input.checked));
    });
}

function renderVideoConnectedAccounts() {
    var listEl = document.getElementById('video-connected-account-list');
    if (!listEl) return;
    var projectId = getSelectedVideoProjectId();
    var allAccounts = getAllVideoSocialAccounts();
    var selectedIds = getProjectVideoSocialAccountIds(projectId);
    if (!projectId) {
        listEl.innerHTML = '<div class="video-connected-empty">Selecione um projeto para escolher os ativos da Meta.</div>';
        return;
    }
    if (!allAccounts.length) {
        listEl.innerHTML = '<div class="video-connected-empty">Nenhuma pagina ou Instagram importado ainda. Conecte sua conta Meta/Facebook uma vez e depois escolha aqui quais ativos pertencem a este projeto.</div>';
        return;
    }
    var facebookAccounts = allAccounts.filter(function(account) { return account.platform === 'facebook'; });
    var instagramAccounts = allAccounts.filter(function(account) { return account.platform === 'instagram'; });
    function renderGroup(title, accounts, emptyText) {
        return '<div class="video-connected-group"><div class="video-connected-group-title">' + vesc(title) + '</div>'
            + (accounts.length ? accounts.map(function(account) {
                var label = formatVideoSocialAccountLabel(account);
                var meta = account.handle || account.url || 'Ativo importado da Meta';
                var checked = selectedIds.indexOf(account.id) >= 0;
                return '<label class="video-connected-account' + (checked ? ' is-selected' : '') + '">'
                    + '<input type="checkbox" name="video-connected-account" value="' + vesc(account.id) + '" data-label="' + vesc(label) + '" data-platform="' + vesc(account.platform) + '"' + (checked ? ' checked' : '') + ' onchange="toggleProjectVideoSocialAccount(this)">'
                    + '<span class="video-connected-main"><span class="video-connected-name">' + vesc(account.name || label) + '</span><span class="video-connected-meta">' + vesc(meta) + ' / Importado da Meta</span></span>'
                    + '<span class="video-connected-platform">' + vesc(getVideoSocialPlatformLabel(account.platform)) + '</span>'
                    + '</label>';
            }).join('') : '<div class="video-connected-empty">' + vesc(emptyText) + '</div>')
            + '</div>';
    }
    listEl.innerHTML = renderGroup('Pagina do Facebook para este projeto', facebookAccounts, 'Nenhuma pagina do Facebook foi devolvida pela Meta.')
        + renderGroup('Instagram profissional para este projeto', instagramAccounts, 'Nenhum Instagram profissional foi devolvido pela Meta ainda.');
    syncVideoChannelSelectionState();
}

function toggleProjectVideoSocialAccount(input) {
    var projectId = getSelectedVideoProjectId();
    if (!projectId || !input) return;
    var ids = getProjectVideoSocialAccountIds(projectId);
    var id = input.value;
    if (input.checked && ids.indexOf(id) < 0) ids.push(id);
    if (!input.checked) ids = ids.filter(function(item) { return item !== id; });
    saveProjectVideoSocialAccountIds(projectId, ids);
    renderVideoConnectedAccounts();
    setVideoStatus('Ativos da Meta atualizados para este projeto.');
}

function connectVideoSocialAccount(platform) {
    var width = 720;
    var height = 760;
    var left = Math.max(0, Math.round((window.screen.width - width) / 2));
    var top = Math.max(0, Math.round((window.screen.height - height) / 2));
    var popup = window.open('/api/meta/connect?platform=' + encodeURIComponent(platform || 'facebook'), 'meta-connect', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes');
    if (!popup) {
        setVideoStatus('O navegador bloqueou o pop-up da Meta. Libere pop-ups para conectar sua conta.');
        return;
    }
    popup.focus();
    watchVideoMetaPopup(popup);
    setVideoStatus('Abrindo login oficial da Meta para importar paginas e perfis profissionais...');
}

function saveVideoMetaAccounts(accounts) {
    var incoming = Array.isArray(accounts) ? accounts : [];
    if (!incoming.length) { setVideoStatus('Nenhum ativo foi retornado pela Meta.'); return; }
    var imported = mergeVideoMetaAccounts(loadImportedVideoMetaAccounts(), incoming);
    saveImportedVideoMetaAccounts(imported);
    renderVideoConnectedAccounts();
    var pageCount = imported.filter(function(account) { return account.platform === 'facebook'; }).length;
    var instagramCount = imported.filter(function(account) { return account.platform === 'instagram'; }).length;
    setVideoStatus('Ativos da Meta importados: ' + pageCount + ' pagina(s) e ' + instagramCount + ' Instagram(s). Selecione os ativos deste projeto.');
}

function handleVideoMetaMessage(event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data || {};
    if (data.type !== 'mb-meta-connect') return;
    if (!data.ok) {
        setVideoStatus(data.error || 'Nao foi possivel conectar com a Meta.');
        return;
    }
    saveVideoMetaAccounts(data.accounts || []);
    if (data.warning) setVideoStatus(data.warning);
}

function consumeVideoMetaStoredResult() {
    var raw = '';
    try { raw = localStorage.getItem(VIDEO_META_OAUTH_RESULT_STORAGE_KEY) || ''; } catch (e) { raw = ''; }
    if (!raw) return false;
    try { localStorage.removeItem(VIDEO_META_OAUTH_RESULT_STORAGE_KEY); } catch (e2) {}
    try {
        var data = JSON.parse(raw);
        handleVideoMetaMessage({ origin: window.location.origin, data: data });
        return true;
    } catch (e3) {
        setVideoStatus('A Meta retornou a conexao, mas nao foi possivel ler os dados. Tente conectar novamente.');
        return false;
    }
}

function watchVideoMetaPopup(popup) {
    var attempts = 0;
    var timer = window.setInterval(function() {
        attempts += 1;
        var consumed = consumeVideoMetaStoredResult();
        var closed = false;
        try { closed = !!(popup && popup.closed); } catch (e) { closed = false; }
        if (consumed || closed || attempts > 120) window.clearInterval(timer);
        if (closed && !consumed) {
            window.setTimeout(function() {
                if (!consumeVideoMetaStoredResult()) {
                    setVideoStatus('A janela da Meta fechou. Se os ativos nao aparecerem, conecte novamente e confirme se a tela final abriu em blog.mbfinance.com.br.');
                }
            }, 300);
        }
        if (attempts > 120 && !consumed) setVideoStatus('A conexão da Meta demorou demais. Tente conectar novamente.');
    }, 500);
}

function handleVideoMetaStorageEvent(event) {
    if (!event || event.key === VIDEO_META_OAUTH_RESULT_STORAGE_KEY) consumeVideoMetaStoredResult();
}

function disconnectVideoSocialAccount(event, accountId) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    var projectId = getSelectedVideoProjectId();
    if (!projectId || !accountId) return;
    var ids = getProjectVideoSocialAccountIds(projectId).filter(function(id) { return id !== accountId; });
    saveProjectVideoSocialAccountIds(projectId, ids);
    renderVideoConnectedAccounts();
    setVideoStatus('Ativo removido deste projeto.');
}
function getVideoPurposeMode() {
    var value = (document.getElementById('video-purpose') || {}).value || 'Conteudo para redes sociais';
    if (value === 'Anuncios pagos') return 'ads';
    if (value === 'Conteudo e anuncios') return 'both';
    return 'organic';
}

function updateVideoChannelVisibility() {
    syncVideoChannelSelectionState();
}

function getSelectedVideoChannels() {
    updateVideoChannelVisibility();
    var selected = Array.prototype.slice.call(document.querySelectorAll('input[name="video-connected-account"]:checked'));
    return selected.map(function(input) { return input.getAttribute('data-label') || input.value; }).filter(Boolean);
}

function setSelectedVideoChannels(values) {
    var selected = Array.isArray(values) ? values : [];
    Array.prototype.slice.call(document.querySelectorAll('input[name="video-connected-account"]')).forEach(function(input) {
        var label = input.getAttribute('data-label') || '';
        var platform = getVideoSocialPlatformLabel(input.getAttribute('data-platform'));
        input.checked = !selected.length || selected.some(function(value) { return label.indexOf(value) >= 0 || platform === value; });
    });
    updateVideoChannelVisibility();
}

function getSelectedVideoProducts() {
    var selected = Array.prototype.slice.call(document.querySelectorAll('input[name="video-product"]:checked'));
    var values = selected.map(function(input) { return input.value; }).filter(Boolean);
    return values.length ? values : ['Maquininhas Mercado Pago'];
}

function setSelectedVideoProducts(values) {
    var selected = Array.isArray(values) ? values : [];
    Array.prototype.slice.call(document.querySelectorAll('input[name="video-product"]')).forEach(function(input) {
        input.checked = selected.indexOf(input.value) >= 0;
    });
    if (!document.querySelector('input[name="video-product"]:checked')) {
        var first = document.querySelector('input[name="video-product"]');
        if (first) first.checked = true;
    }
    syncVideoProductSelectionState();
}

function syncVideoProductSelectionState() {
    Array.prototype.slice.call(document.querySelectorAll('#video-product-options .video-channel-option')).forEach(function(label) {
        var input = label.querySelector('input[name="video-product"]');
        label.classList.toggle('is-selected', !!(input && input.checked));
    });
}
function getVideoBrief() {
    var projectId = (document.getElementById('video-project') || {}).value || '';
    var influencer = getActiveProjectInfluencer();
    var startDate = ((document.getElementById('video-start-date') || {}).value || '').trim();
    var dayInterval = Math.max(0, Math.min(30, Number((document.getElementById('video-day-interval') || {}).value || 1)));
    var channels = getSelectedVideoChannels();
    return {
        projectId: projectId,
        projectName: getVideoProjectName(projectId),
        purpose: (document.getElementById('video-purpose') || {}).value || 'Conteudo para redes sociais',
        channels: channels,
        channel: channels.join(' + '),
        products: getSelectedVideoProducts(),
        offer: getSelectedVideoProducts().join(' + '),
        format: (document.getElementById('video-format') || {}).value || '9:16',
        quantity: Math.max(1, Math.min(20, Number((document.getElementById('video-quantity') || {}).value || 1))),
        startDate: startDate,
        dayInterval: dayInterval,
        duration: (document.getElementById('video-duration') || {}).value || '30 segundos',
        tone: (document.getElementById('video-tone') || {}).value || 'direto e comercial',
        avatar: influencer ? influencer.name : '',
        avatarId: influencer ? influencer.avatarId : '',
        voiceId: influencer ? influencer.voiceId : '',
        cta: ((document.getElementById('video-cta') || {}).value || '').trim(),
        notes: ((document.getElementById('video-brief') || {}).value || '').trim(),
        influencerId: influencer ? influencer.id : '',
        influencerManual: influencer ? influencer.manual : '',
        influencerManualFile: influencer ? influencer.manualFileName : '',
        influencerReference: influencer ? influencer.referenceUrl : '',
        influencerReferenceImages: influencer && Array.isArray(influencer.referenceImages) ? influencer.referenceImages.map(function(image) { return image.src; }).join(' | ') : ''
    };
}

function buildVideoScript(brief, index) {
    var hooks = [
        'Voce ainda perde venda porque seu cliente nao consegue pagar do jeito que prefere?',
        'Se a sua empresa vende no cartao, esta mensagem pode melhorar sua rotina.',
        'Antes de escolher uma solucao de pagamento, veja este ponto importante.',
        'Tem lojista pagando caro sem perceber por falta de comparacao.',
        'O jeito mais simples de vender mais pode estar no atendimento certo.'
    ];
    var proof = [
        'A proposta e facilitar a conversa, comparar condicoes e indicar o melhor caminho para o seu CNPJ.',
        'A ideia e reduzir atrito, trazer clareza e acelerar sua decisao sem complicar o processo.',
        'Com uma orientacao consultiva, fica mais facil entender taxas, operacao e proximo passo.',
        'O foco e transformar duvida em acao com um atendimento direto para empresas.',
        'Voce entende a oferta, tira duvidas e decide com mais seguranca.'
    ];
    var notes = brief.notes ? ' Direcao extra: ' + brief.notes : '';
    var influencerManual = brief.influencerManual ? ' Manual da influencer ' + brief.avatar + ': ' + brief.influencerManual : (brief.influencerManualFile ? ' Manual da influencer anexado no perfil: ' + brief.influencerManualFile + '. Use esse documento como referencia de identidade.' : '');
    return 'Gancho: ' + hooks[(index - 1) % hooks.length] + '\n\n'
        + 'Desenvolvimento: transforme o(s) produto(s) ' + brief.offer + ' em uma ideia de conteudo com tom ' + brief.tone + ', uso principal em ' + brief.purpose + ', pensado para ' + brief.channel + ', com duracao aproximada de ' + brief.duration + '. ' + proof[(index - 1) % proof.length] + notes + influencerManual + '\n\n'
        + 'Cena sugerida: usar a influencer ' + (brief.avatar || 'do projeto') + ' em plano medio, legenda destacando a principal promessa, corte rapido para CTA visual.\n\n'
        + 'CTA: ' + (brief.cta || 'Clique no link e fale com um especialista.');
}

function getPlannedVideoDate(brief, index) {
    if (!brief.startDate) return '';
    var date = new Date(brief.startDate + 'T12:00:00');
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + ((index - 1) * brief.dayInterval));
    return date.toISOString().slice(0, 10);
}

function createVideoJobFromBrief(brief, index, total) {
    var plannedDate = getPlannedVideoDate(brief, index);
    return {
            id: Date.now() + index,
            projectId: brief.projectId,
            project: brief.projectName,
            purpose: brief.purpose,
            channels: brief.channels,
            channel: brief.channel,
            offer: brief.offer,
            format: brief.format,
            duration: brief.duration,
            tone: brief.tone,
            avatar: brief.avatar,
            avatarId: brief.avatarId,
            voiceId: brief.voiceId,
            cta: brief.cta,
            notes: brief.notes,
            influencerId: brief.influencerId,
            influencerManual: brief.influencerManual,
            influencerManualFile: brief.influencerManualFile,
            influencerReference: brief.influencerReference,
            title: 'Ideia ' + index + ' - ' + brief.offer + (brief.avatar ? ' - ' + brief.avatar : ''),
            script: buildVideoScript(brief, index) + (plannedDate ? '\n\nData planejada de postagem: ' + formatVideoDate(plannedDate) + '.' : ''),
            status: 'Roteiro pronto',
            heygenVideoId: '',
            videoUrl: '',
            thumbnailUrl: '',
            videoPageUrl: '',
            remotionStatus: '',
            remotionUpdatedAt: '',
            finalVideoUrl: '',
            failureMessage: '',
            plannedDate: plannedDate,
            createdAt: new Date().toISOString()
        };
}

function createContentIdeasWithQuantity(quantity, statusLabel) {
    var brief = getVideoBrief();
    brief.quantity = Math.max(1, Math.min(20, Number(quantity || brief.quantity || 1)));
    if (!brief.projectId) { setVideoStatus('Cadastre ou selecione um projeto antes de gerar conteudo.'); return; }
    if (!brief.influencerId) { setVideoStatus('Cadastre ou selecione a influencer deste projeto antes de gerar conteudo.'); return; }
    var list = loadVideosQueue();
    var jobs = [];
    for (var i = 1; i <= brief.quantity; i++) jobs.push(createVideoJobFromBrief(brief, i, brief.quantity));
    jobs.reverse().forEach(function(job) { list.unshift(job); });
    saveVideosQueue(list);
    renderVideosQueue();
    setVideoStatus(statusLabel || (brief.quantity + ' ideia' + (brief.quantity > 1 ? 's' : '') + ' de conteudo gerada' + (brief.quantity > 1 ? 's' : '') + '.'));
}

function createSingleVideo() {
    createContentIdeas();
}

function createContentIdeas() {
    var quantity = Math.max(1, Math.min(20, Number((document.getElementById('video-quantity') || {}).value || 1)));
    createContentIdeasWithQuantity(quantity);
}

function createVideoBatch() {
    createContentIdeas();
}

function setVideoStatus(message) {
    var el = document.getElementById('video-status-line');
    if (!el) return;
    el.textContent = message || '';
    if (message) setTimeout(function() { if (el.textContent === message) el.textContent = ''; }, 4500);
}

function formatVideoDate(value) {
    if (!value) return '';
    try {
        var date = String(value).length === 10 ? new Date(String(value) + 'T12:00:00') : new Date(value);
        return date.toLocaleDateString('pt-BR');
    } catch (e) { return ''; }
}

function renderVideoSummary() {
    var el = document.getElementById('video-summary');
    if (!el) return;
    var list = loadVideosQueue();
    var approved = list.filter(function(item) { return item.status === 'Video editado' || item.status === 'Aprovado' || item.status === 'Publicado'; }).length;
    var generating = list.filter(function(item) { return item.status === 'Aguardando HeyGen' || item.status === 'Enviado ao HeyGen' || item.status === 'Gerando video'; }).length;
    var pendingEdit = list.filter(function(item) { return item.status === 'Edicao pendente' || item.status === 'Aguardando Remotion' || item.status === 'Editando no Remotion'; }).length;
    el.innerHTML = '<div class="video-summary-card"><div class="video-summary-label">Roteiros</div><div class="video-summary-value">' + list.length + '</div><div class="video-summary-note">Total na fila</div></div>'
        + '<div class="video-summary-card"><div class="video-summary-label">HeyGen</div><div class="video-summary-value">' + generating + '</div><div class="video-summary-note">Geracao do MP4</div></div>'
        + '<div class="video-summary-card"><div class="video-summary-label">Remotion</div><div class="video-summary-value">' + pendingEdit + '</div><div class="video-summary-note">Edicao final</div></div>'
        + '<div class="video-summary-card"><div class="video-summary-label">Prontos</div><div class="video-summary-value">' + approved + '</div><div class="video-summary-note">Editados/aprovados</div></div>';
}

function populateVideoEditorialPillars() {
    var list = document.getElementById('video-pillar-list');
    var select = document.getElementById('video-idea-pillar');
    if (list) {
        list.innerHTML = VIDEO_EDITORIAL_PILLARS.map(function(pillar) {
            return '<div class="video-pillar-item"><strong>' + vesc(pillar.name) + '</strong><span>' + vesc(pillar.desc) + '</span></div>';
        }).join('');
    }
    if (select) {
        var current = select.value;
        select.innerHTML = VIDEO_EDITORIAL_PILLARS.map(function(pillar) {
            return '<option value="' + vesc(pillar.id) + '">' + vesc(pillar.name) + '</option>';
        }).join('');
        if (VIDEO_EDITORIAL_PILLARS.some(function(pillar) { return pillar.id === current; })) select.value = current;
    }
}

function renderVideoEditorialKanban() {
    populateVideoEditorialPillars();
    var board = document.getElementById('video-editorial-kanban');
    if (!board) return;
    var ideas = loadVideoEditorialIdeas();
    board.innerHTML = VIDEO_EDITORIAL_STATUSES.map(function(column) {
        var items = ideas.filter(function(item) { return item.status === column.id; });
        var cards = items.length ? items.map(renderVideoEditorialCard).join('') : '<div class="video-empty" style="padding:18px 10px;">Sem conteudos.</div>';
        return '<section class="video-kanban-column">'
            + '<div class="video-kanban-head"><span>' + vesc(column.label) + '</span><span class="video-kanban-count">' + items.length + '</span></div>'
            + '<div class="video-kanban-items">' + cards + '</div>'
            + '</section>';
    }).join('');
}

function renderVideoEditorialCard(item) {
    var pillar = getVideoPillar(item.pillar);
    var prev = VIDEO_EDITORIAL_STATUSES[Math.max(0, VIDEO_EDITORIAL_STATUSES.findIndex(function(col) { return col.id === item.status; }) - 1)];
    var next = VIDEO_EDITORIAL_STATUSES[Math.min(VIDEO_EDITORIAL_STATUSES.length - 1, VIDEO_EDITORIAL_STATUSES.findIndex(function(col) { return col.id === item.status; }) + 1)];
    return '<article class="video-kanban-card">'
        + '<div class="video-kanban-card-title">' + vesc(item.title) + '</div>'
        + '<div class="video-kanban-card-meta">' + vesc(pillar.name) + '</div>'
        + (item.note ? '<div class="video-kanban-card-note">' + vesc(item.note) + '</div>' : '')
        + '<div class="video-kanban-actions">'
        + (prev.id !== item.status ? '<button class="video-icon-btn" onclick="moveVideoEditorialIdea(\'' + vesc(item.id) + '\',\'' + vesc(prev.id) + '\')">Voltar</button>' : '')
        + (next.id !== item.status ? '<button class="video-icon-btn" onclick="moveVideoEditorialIdea(\'' + vesc(item.id) + '\',\'' + vesc(next.id) + '\')">Avancar</button>' : '')
        + '<button class="video-icon-btn" onclick="useVideoEditorialIdea(\'' + vesc(item.id) + '\')">Usar</button>'
        + '<button class="video-icon-btn" onclick="deleteVideoEditorialIdea(\'' + vesc(item.id) + '\')">Excluir</button>'
        + '</div>'
        + '</article>';
}

function addVideoEditorialIdea() {
    var titleEl = document.getElementById('video-idea-title');
    var pillarEl = document.getElementById('video-idea-pillar');
    var noteEl = document.getElementById('video-idea-note');
    var title = (titleEl && titleEl.value || '').trim();
    if (!title) { setVideoStatus('Digite uma ideia para adicionar ao Kanban.'); if (titleEl) titleEl.focus(); return; }
    var ideas = loadVideoEditorialIdeas();
    ideas.unshift({
        id: Date.now().toString(36),
        projectId: getSelectedVideoProjectId(),
        title: title,
        pillar: (pillarEl && pillarEl.value) || VIDEO_EDITORIAL_PILLARS[0].id,
        note: (noteEl && noteEl.value || '').trim(),
        status: 'ideia',
        createdAt: new Date().toISOString()
    });
    saveVideoEditorialIdeas(ideas);
    if (titleEl) titleEl.value = '';
    if (noteEl) noteEl.value = '';
    renderVideoEditorialKanban();
    setVideoStatus('Ideia adicionada ao Kanban.');
}

function moveVideoEditorialIdea(id, status) {
    var ideas = loadVideoEditorialIdeas();
    ideas.forEach(function(item) { if (item.id === id) item.status = status; });
    saveVideoEditorialIdeas(ideas);
    renderVideoEditorialKanban();
}

function deleteVideoEditorialIdea(id) {
    if (!confirm('Excluir esta ideia da linha editorial?')) return;
    saveVideoEditorialIdeas(loadVideoEditorialIdeas().filter(function(item) { return item.id !== id; }));
    renderVideoEditorialKanban();
}

function useVideoEditorialIdea(id) {
    var item = loadVideoEditorialIdeas().find(function(row) { return row.id === id; });
    if (!item) return;
    var pillar = getVideoPillar(item.pillar);
    var brief = document.getElementById('video-brief');
    if (brief) {
        brief.value = 'Pilar editorial: ' + pillar.name + '\nIdeia: ' + item.title + (item.note ? '\nDirecao: ' + item.note : '');
        brief.focus();
    }
    moveVideoEditorialIdea(id, 'roteiro');
    if (typeof switchTab === 'function') switchTab('videos');
    setVideoStatus('Ideia aplicada ao briefing do video.');
}

function seedVideoEditorialIdeas() {
    var existing = loadVideoEditorialIdeas();
    if (existing.length && !confirm('Adicionar ideias base sem apagar as atuais?')) return;
    var seeds = [
        ['educacao-pj', 'Conta PJ: por que separar o dinheiro da empresa do pessoal?', 'Abrir com dor de mistura financeira e conduzir para atendimento consultivo.'],
        ['quebra-objecoes', 'Maquininha: medo de taxa alta e contrato complicado', 'Explicar comparacao de condicoes sem promessa absoluta.'],
        ['beneficios-praticos', 'C6 Pay no dia a dia de quem vende no cartao', 'Mostrar praticidade, rotina e proximo passo pelo WhatsApp.'],
        ['comparativos', 'Credito PJ: quando faz sentido buscar capital de giro?', 'Conteudo educativo, sem incentivo irresponsavel.'],
        ['bastidores-jornada', 'Como funciona falar com um especialista da MB Negocios', 'Mostrar etapas simples do atendimento.'],
        ['oferta-conversao', 'Atendimento consultivo para escolher solucao PJ', 'CTA direto para WhatsApp ou simulacao.']
    ];
    var now = Date.now();
    seeds.reverse().forEach(function(seed, index) {
        existing.unshift({
            id: (now + index).toString(36),
            projectId: getSelectedVideoProjectId(),
            title: seed[1],
            pillar: seed[0],
            note: seed[2],
            status: 'ideia',
            createdAt: new Date().toISOString()
        });
    });
    saveVideoEditorialIdeas(existing);
    renderVideoEditorialKanban();
    setVideoStatus('Ideias base adicionadas ao Kanban.');
}

function renderVideosQueue() {
    renderVideoSummary();
    var el = document.getElementById('video-list');
    if (!el) return;
    var list = loadVideosQueue();
    if (!list.length) { el.innerHTML = '<div class="video-empty">Nenhuma ideia gerada ainda.</div>'; return; }
    var rows = list.map(function(item) {
        var statusOptions = VIDEO_STATUSES.map(function(status) {
            return '<option value="' + vesc(status) + '"' + (item.status === status ? ' selected' : '') + '>' + vesc(status) + '</option>';
        }).join('');
        var meta = '';
        if (item.heygenVideoId) meta += '<span class="video-pill">HeyGen: ' + vesc(item.heygenVideoId) + '</span>';
        if (item.videoUrl) meta += '<span class="video-pill"><a href="' + vesc(item.videoUrl) + '" target="_blank" rel="noopener">Abrir MP4</a></span>';
        if (item.remotionStatus) meta += '<span class="video-pill">Remotion: ' + vesc(item.remotionStatus) + '</span>';
        if (item.finalVideoUrl) meta += '<span class="video-pill"><a href="' + vesc(item.finalVideoUrl) + '" target="_blank" rel="noopener">Video final</a></span>';
        if (item.failureMessage) meta += '<span class="video-pill" style="color:#dc2626;background:#fef2f2;">' + vesc(item.failureMessage) + '</span>';
        var canSend = item.avatarId && item.voiceId && item.script;
        var canEditWithRemotion = !!item.videoUrl;
        return '<article class="video-row" id="video-row-' + item.id + '">'
            + '<div class="video-row-main">'
            + '<div class="video-row-title">' + vesc(item.title) + '</div>'
            + '<div class="video-row-meta">'
            + '<span class="video-pill">' + vesc(item.project || 'Sem projeto') + '</span>'
            + '<span class="video-pill">' + vesc(item.offer || 'Sem produto') + '</span>'
            + '<span class="video-pill">' + vesc(item.channel || 'Sem destino') + '</span>'
            + '<span class="video-pill">' + vesc(item.tone || 'Sem tom') + '</span>'
            + meta
            + '</div>'
            + '<div class="video-row-script">' + vesc(item.script) + '</div>'
            + '</div>'
            + '<div class="video-row-actions">'
            + '<select class="video-status" onchange="updateVideoStatus(' + item.id + ', this.value)">' + statusOptions + '</select>'
            + '<button class="video-icon-btn" onclick="toggleVideoIdeaDetails(' + item.id + ')">Ver tudo</button>'
            + '<button class="video-icon-btn" onclick="copyVideoScript(' + item.id + ')">Copiar</button>'
            + '<button class="video-icon-btn" onclick="sendVideoToHeyGen(' + item.id + ')"' + (canSend ? '' : ' disabled title="Preencha ID de aparencia e Voice ID na influencer"') + '>HeyGen</button>'
            + '<button class="video-icon-btn" onclick="refreshHeyGenVideo(' + item.id + ')"' + (item.heygenVideoId ? '' : ' disabled') + '>Status</button>'
            + '<button class="video-icon-btn" onclick="sendVideoToRemotion(' + item.id + ')"' + (canEditWithRemotion ? '' : ' disabled title="Consulte o HeyGen ate o MP4 ficar pronto"') + '>Remotion</button>'
            + '<button class="video-icon-btn" onclick="duplicateVideoJob(' + item.id + ')">Duplicar</button>'
            + '<button class="video-icon-btn" onclick="deleteVideoJob(' + item.id + ')">Excluir</button>'
            + '</div>'
            + '</article>';
    }).join('');
    el.innerHTML = '<div class="video-table">' + rows + '</div>';
}

function toggleVideoIdeaDetails(id) {
    var row = document.getElementById('video-row-' + id);
    if (!row) return;
    row.classList.toggle('expanded');
    var btn = Array.prototype.slice.call(row.querySelectorAll('button')).find(function(button) { return button.textContent === 'Ver tudo' || button.textContent === 'Recolher'; });
    if (btn) btn.textContent = row.classList.contains('expanded') ? 'Recolher' : 'Ver tudo';
}
function updateVideoItem(id, updater) {
    var list = loadVideosQueue();
    list.forEach(function(item) { if (item.id === id) updater(item); });
    saveVideosQueue(list);
    renderVideosQueue();
}

async function sendVideoToHeyGen(id) {
    var item = loadVideosQueue().find(function(row) { return row.id === id; });
    if (!item) return;
    if (!item.avatarId || !item.voiceId) {
        setVideoStatus('Preencha ID de aparencia e Voice ID antes de enviar ao HeyGen.');
        return;
    }
    setVideoStatus('Enviando roteiro ao HeyGen...');
    try {
        var res = await fetch('/api/heygen/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: item.title,
                script: item.script,
                avatarId: item.avatarId,
                voiceId: item.voiceId,
                aspectRatio: item.format
            })
        });
        var data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Erro ao criar video.');
        updateVideoItem(id, function(row) {
            row.heygenVideoId = data.videoId || row.heygenVideoId || '';
            row.status = 'Enviado ao HeyGen';
            row.failureMessage = '';
        });
        setVideoStatus('Video enviado ao HeyGen.');
    } catch (e) {
        updateVideoItem(id, function(row) {
            row.status = 'Falhou';
            row.failureMessage = e.message || 'Erro ao enviar ao HeyGen.';
        });
        setVideoStatus(e.message || 'Erro ao enviar ao HeyGen.');
    }
}

async function refreshHeyGenVideo(id) {
    var item = loadVideosQueue().find(function(row) { return row.id === id; });
    if (!item || !item.heygenVideoId) return;
    setVideoStatus('Consultando status no HeyGen...');
    try {
        var res = await fetch('/api/heygen/videos?videoId=' + encodeURIComponent(item.heygenVideoId), { cache: 'no-store' });
        var data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Erro ao consultar video.');
        updateVideoItem(id, function(row) {
            row.videoUrl = data.captionedVideoUrl || data.videoUrl || row.videoUrl || '';
            row.thumbnailUrl = data.thumbnailUrl || row.thumbnailUrl || '';
            row.videoPageUrl = data.videoPageUrl || row.videoPageUrl || '';
            row.failureMessage = data.failureMessage || '';
            if (data.failureMessage) row.status = 'Falhou';
            else if (row.videoUrl) row.status = 'Edicao pendente';
            else row.status = 'Gerando video';
        });
        setVideoStatus(data.videoUrl || data.captionedVideoUrl ? 'Video pronto para baixar.' : 'Video ainda em processamento.');
    } catch (e) {
        setVideoStatus(e.message || 'Erro ao consultar status.');
    }
}

function sendVideoToRemotion(id) {
    var item = loadVideosQueue().find(function(row) { return row.id === id; });
    if (!item) return;
    if (!item.videoUrl) {
        setVideoStatus('Antes do Remotion, consulte o HeyGen ate o MP4 ficar pronto.');
        return;
    }
    updateVideoItem(id, function(row) {
        row.status = 'Aguardando Remotion';
        row.remotionStatus = 'Fila criada';
        row.remotionUpdatedAt = new Date().toISOString();
        row.failureMessage = '';
    });
    setVideoStatus('Conteudo colocado na fila de edicao Remotion.');
}

function copyVideoScript(id) {
    var item = loadVideosQueue().find(function(row) { return row.id === id; });
    if (!item || !navigator.clipboard) return;
    navigator.clipboard.writeText(item.script).then(function() { setVideoStatus('Roteiro copiado.'); });
}

function updateVideoStatus(id, status) {
    var list = loadVideosQueue();
    list.forEach(function(item) { if (item.id === id) item.status = status; });
    saveVideosQueue(list);
    renderVideoSummary();
}

function duplicateVideoJob(id) {
    var list = loadVideosQueue();
    var item = list.find(function(row) { return row.id === id; });
    if (!item) return;
    list.unshift(Object.assign({}, item, {
        id: Date.now(),
        title: item.title + ' - copia',
        createdAt: new Date().toISOString(),
        status: 'Roteiro pronto',
        heygenVideoId: '',
        videoUrl: '',
        thumbnailUrl: '',
        videoPageUrl: '',
        remotionStatus: '',
        remotionUpdatedAt: '',
        finalVideoUrl: '',
        failureMessage: ''
    }));
    saveVideosQueue(list);
    renderVideosQueue();
}

function deleteVideoJob(id) {
    saveVideosQueue(loadVideosQueue().filter(function(row) { return row.id !== id; }));
    renderVideosQueue();
}

function clearVideosQueue() {
    var list = loadVideosQueue();
    if (!list.length || !confirm('Limpar todas as ideias de conteudo?')) return;
    saveVideosQueue([]);
    renderVideosQueue();
}

function exportVideosCSV() {
    var list = loadVideosQueue();
    if (!list.length) { setVideoStatus('Nenhuma ideia para exportar.'); return; }
    var header = ['Projeto', 'Uso do video', 'Redes', 'Oferta', 'Formato', 'Duracao', 'Tom', 'Influencer', 'ID Aparencia', 'Voice ID', 'Status', 'HeyGen ID', 'Video URL', 'Remotion', 'Video final', 'Manual Influencer', 'Data planejada', 'Data criacao', 'Roteiro'];
    var rows = list.map(function(item) {
        return [item.project, item.purpose || '', item.channel, item.offer, item.format, item.duration, item.tone, item.avatar, item.avatarId, item.voiceId, item.status, item.heygenVideoId, item.videoUrl, item.remotionStatus, item.finalVideoUrl, item.influencerManual, formatVideoDate(item.plannedDate), formatVideoDate(item.createdAt), item.script].map(function(value) {
            return '"' + String(value || '').replace(/"/g, '""') + '"';
        }).join(',');
    });
    var blob = new Blob(['\ufeff' + header.join(',') + '\r\n' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'videos-ia-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

function applyVideoTemplate(type) {
    var purpose = document.getElementById('video-purpose');
    var duration = document.getElementById('video-duration');
    var tone = document.getElementById('video-tone');
    var cta = document.getElementById('video-cta');
    var brief = document.getElementById('video-brief');
    if (type === 'maquininha') {
        setSelectedVideoProducts(['Maquininhas Mercado Pago']);
        if (purpose) purpose.value = 'Conteudo e anuncios';
        setSelectedVideoChannels(['Instagram', 'Stories', 'TikTok', 'YouTube', 'Facebook', 'Meta Ads', 'Instagram Ads', 'Facebook Ads', 'TikTok Ads', 'YouTube Ads']);
        if (duration) duration.value = '30 segundos';
        if (tone) tone.value = 'direto e comercial';
        if (cta) cta.value = 'Clique no link e fale com um especialista.';
        if (brief) brief.value = 'Falar com lojistas e empresas que vendem no cartao. Destacar atendimento, comparacao de condicoes e proximo passo simples.';
    }
    if (type === 'educativo') {
        if (purpose) purpose.value = 'Conteudo para redes sociais';
        setSelectedVideoChannels(['Instagram', 'TikTok', 'YouTube', 'Facebook']);
        if (duration) duration.value = '45 segundos';
        if (tone) tone.value = 'educativo e confiavel';
        setSelectedVideoProducts(['Conta PJ', 'Capital de Giro']);
        if (brief) brief.value = 'Explicar uma dor comum do empresario, mostrar o erro mais comum e chamar para conversar com um especialista.';
    }
    if (type === 'ads') {
        if (purpose) purpose.value = 'Anuncios pagos';
        setSelectedVideoChannels(['Meta Ads', 'Instagram Ads', 'Facebook Ads', 'TikTok Ads', 'YouTube Ads']);
        if (duration) duration.value = '15 segundos';
        if (tone) tone.value = 'urgente e promocional';
        setSelectedVideoProducts(['Maquininhas Mercado Pago']);
        if (brief) brief.value = 'Gancho forte nos 3 primeiros segundos, beneficio claro, prova de credibilidade e CTA direto.';
    }
    setVideoStatus('Modelo aplicado.');
}

function switchVideoSection(section) {
    var selected = section === 'editorial' ? 'editorial' : 'production';
    document.querySelectorAll('.video-subsection').forEach(function(el) {
        el.classList.toggle('active', el.id === 'video-section-' + selected);
    });
    document.querySelectorAll('.video-subnav-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.id === 'videoSubnav-' + selected);
    });
    var wrap = document.querySelector('#screen-videos .video-wrap');
    if (wrap) wrap.classList.toggle('video-editorial-active', selected === 'editorial');
    try { localStorage.setItem(VIDEO_SECTION_STORAGE_KEY, selected); } catch (e) {}
    if (selected === 'editorial') renderVideoEditorialKanban();
    if (selected === 'production') renderVideosQueue();
}

function initVideos() {
    consumeVideoMetaStoredResult();
    populateVideoProjects();
    updateVideoChannelVisibility();
    loadProjectInfluencerToForm();
    var savedSection = localStorage.getItem(VIDEO_SECTION_STORAGE_KEY) || 'production';
    switchVideoSection(savedSection);
}

function initEditorial() {
    switchVideoSection('editorial');
}

window.removeEventListener('message', handleVideoMetaMessage);
window.addEventListener('message', handleVideoMetaMessage);
window.removeEventListener('storage', handleVideoMetaStorageEvent);
window.addEventListener('storage', handleVideoMetaStorageEvent);
window.removeEventListener('focus', consumeVideoMetaStoredResult);
window.addEventListener('focus', consumeVideoMetaStoredResult);
consumeVideoMetaStoredResult();
window.initVideos = initVideos;
window.initEditorial = initEditorial;
window.switchVideoSection = switchVideoSection;
window.createSingleVideo = createSingleVideo;
window.createVideoBatch = createVideoBatch;
window.renderVideosQueue = renderVideosQueue;
window.toggleVideoIdeaDetails = toggleVideoIdeaDetails;
window.renderVideoEditorialKanban = renderVideoEditorialKanban;
window.addVideoEditorialIdea = addVideoEditorialIdea;
window.moveVideoEditorialIdea = moveVideoEditorialIdea;
window.deleteVideoEditorialIdea = deleteVideoEditorialIdea;
window.useVideoEditorialIdea = useVideoEditorialIdea;
window.seedVideoEditorialIdeas = seedVideoEditorialIdeas;
window.sendVideoToRemotion = sendVideoToRemotion;
window.copyVideoScript = copyVideoScript;
window.updateVideoStatus = updateVideoStatus;
window.duplicateVideoJob = duplicateVideoJob;
window.deleteVideoJob = deleteVideoJob;
window.clearVideosQueue = clearVideosQueue;
window.exportVideosCSV = exportVideosCSV;
window.applyVideoTemplate = applyVideoTemplate;
window.updateVideoChannelVisibility = updateVideoChannelVisibility;
window.syncVideoChannelSelectionState = syncVideoChannelSelectionState;
window.connectVideoSocialAccount = connectVideoSocialAccount;
window.toggleProjectVideoSocialAccount = toggleProjectVideoSocialAccount;
window.disconnectVideoSocialAccount = disconnectVideoSocialAccount;
window.sendVideoToHeyGen = sendVideoToHeyGen;
window.refreshHeyGenVideo = refreshHeyGenVideo;
window.onVideoProjectChange = onVideoProjectChange;
window.onVideoInfluencerChange = onVideoInfluencerChange;
window.toggleVideoInfluencerCard = toggleVideoInfluencerCard;
window.newProjectInfluencer = newProjectInfluencer;
window.saveProjectInfluencer = saveProjectInfluencer;
window.deleteProjectInfluencer = deleteProjectInfluencer;
window.applyProjectInfluencer = applyProjectInfluencer;
window.importInfluencerManual = importInfluencerManual;
window.importInfluencerPhoto = importInfluencerPhoto;
window.useInfluencerReferenceImage = useInfluencerReferenceImage;
window.updateInfluencerFormPreview = updateInfluencerFormPreview;



























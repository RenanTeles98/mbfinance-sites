/**
 * Admin Dashboard - Blog Management (CRUD, Editor & Export)
 */

/* ── STORAGE & SYNC ── */
function loadPosts() {
    const apiUrl = getPostsApiUrl();
    if (!apiUrl) {
        loadLocalPosts();
        setSyncStatus('Somente local', 'offline');
        return;
    }

    fetch(apiUrl)
        .then(r => r.ok ? r.json() : Promise.reject(new Error('Falha ao carregar API')))
        .then(data => {
            const remotePosts = Array.isArray(data.posts) ? data.posts : [];
            const localPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

            if (!remotePosts.length && Array.isArray(localPosts) && localPosts.length) {
                posts = localPosts;
                renderSidebar();
                setSyncStatus('API vazia, usando rascunho local', 'warn');
                return;
            }

            posts = remotePosts;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            renderSidebar();
            setSyncStatus('Conectado ao blog oficial', 'online');
        })
        .catch(() => {
            loadLocalPosts();
            setSyncStatus('API indisponivel, usando rascunho local', 'warn');
        });
}

function loadLocalPosts() {
    try { posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e) { posts = []; }
    renderSidebar();
}

function persistLocal() { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); 
}

function getApiBase() {
    return (localStorage.getItem(API_BASE_KEY) || '').trim().replace(/\/$/, '');
}

function getApiToken() {
    return (localStorage.getItem(API_TOKEN_KEY) || 'mbfinance2026').trim();
}

function getPostsApiUrl() {
    const base = getApiBase();
    return base ? `${base}/api/blog/posts` : '';
}

function updateOfficialBlogUi() {
    const base = getApiBase() || 'https://mbfinance-sites.vercel.app';
    const link = document.getElementById('official-blog-link');
    if (!link) return;
    link.href = `${base}/blog.html`;
    link.textContent = 'Ver Blog Oficial';
}

function setSyncStatus(text, tone) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    el.textContent = text;
    el.className = `sync-indicator ${tone}`;
}

function configureOfficialBlog() {
    const currentBase = getApiBase() || 'https://mbfinance-sites.vercel.app';
    const base = prompt('URL do site oficial MB Finance:', currentBase);
    if (base === null) return;
    const normalizedBase = base.trim().replace(/\/$/, '');
    if (!normalizedBase) {
        localStorage.removeItem(API_BASE_KEY);
        localStorage.removeItem(API_TOKEN_KEY);
        updateOfficialBlogUi();
        setSyncStatus('Somente local', 'offline');
        return;
    }
    localStorage.setItem(API_BASE_KEY, normalizedBase);
    localStorage.setItem(API_TOKEN_KEY, 'mbfinance2026');
    localStorage.setItem('mb_site_domain', normalizedBase);
    updateOfficialBlogUi();
    setSyncStatus('Site oficial configurado', 'warn');
    loadPosts();
}

async function syncOfficialBlog(showSuccess = true) {
    const apiUrl = getPostsApiUrl();
    if (!apiUrl) {
        if (showSuccess) alert('Configure a API do blog oficial primeiro.');
        setSyncStatus('Somente local', 'offline');
        return false;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-blog-admin-token': getApiToken(),
            },
            body: JSON.stringify({ posts }),
        });

        if (!response.ok) throw new Error('Falha ao publicar');

        setSyncStatus('Publicado no blog oficial', 'online');
        if (showSuccess) {
            alert('✅ Conteudo publicado no blog oficial.\n\nO blog oficial conectado ao app Next.js ja esta lendo esses posts automaticamente.');
        }
        return true;
    } catch (error) {
        console.error(error);
        setSyncStatus('Falha na publicacao automatica', 'warn');
        if (showSuccess) {
            alert('Nao foi possivel publicar automaticamente.\nVerifique a URL da API, o token e se o app Next.js esta em execucao.');
        }
        return false;
    }
}

/* ── SIDEBAR & RENDER ── */
function renderSidebar(triggerAnalytics = true) {
    const list = document.getElementById('post-list');
    if (!list) return;
    if (!posts.length) {
        list.innerHTML = '<div class="empty-list">Nenhum post ainda.<br>Clique em "Novo Post" para começar.</div>';
        if (typeof renderAnalytics === 'function' && triggerAnalytics) renderAnalytics();
        return;
    }
    const now = new Date();
    
    list.innerHTML = posts.map(p => {
        let statusClass = p.published !== false ? 'pub' : 'draft';
        let statusLabel = p.published !== false ? 'Publicado' : 'Rascunho';
        
        if (p.published !== false) {
            const pubDate = new Date(`${p.date}T${p.time || '00:00'}:00`);
            if (pubDate > now) {
                statusClass = 'sched';
                statusLabel = 'Agendado';
            }
        }

        // Busca métricas se existirem
        let views = 0;
        if (typeof analyticsData !== 'undefined' && analyticsData && analyticsData.topPages) {
            const page = analyticsData.topPages.find(item => item.pagePath === `/blog/${p.slug}` || item.pagePath === `/blog/${p.slug}.html`);
            if (page) views = page.screenPageViews || 0;
        }

        return '<div class="post-item' + (p.id === currentId ? ' active' : '') + '" data-id="' + p.id + '" onclick="editPost(this.dataset.id)">' +
            '<div class="post-item-title" title="' + esc(p.title) + '">' + esc(p.title) + '</div>' +
            '<div class="post-item-meta">' +
                '<span class="post-item-cat">' + esc(p.categoryLabel || p.category) + '</span>' +
                '<span class="status-dot ' + statusClass + '"></span>' +
                '<span class="status-text ' + statusClass + '">' + statusLabel + '</span>' +
            '</div>' +
            (views > 0 ? '<div class="post-item-metrics"><svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> ' + views.toLocaleString('pt-BR') + ' views</div>' : '') +
        '</div>';
    }).join('');
    
    if (typeof renderAnalytics === 'function' && triggerAnalytics) renderAnalytics();
}

function getBannersConfig() {
    return {
        slot1: localStorage.getItem('mb_banner_slot1') || '',
        slot2: localStorage.getItem('mb_banner_slot2') || ''
    };
}
function newPost() {
    currentId = null;
    document.getElementById('form-title').textContent = 'Novo Post';
    document.getElementById('btn-delete').style.display = 'none';
    clearForm();
    showForm();
    document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));
}

function editPost(id) {
    const p = posts.find(x => x.id === id);
    if (!p) return;
    currentId = id;
    document.getElementById('form-title').textContent = 'Editar Post';
    document.getElementById('btn-delete').style.display = '';
    fillForm(p);
    showForm();
    document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));
    const el = document.querySelector(`.post-item[data-id="${id}"]`);
    if (el) el.classList.add('active');
}

async function savePost() {
    const title = document.getElementById('f-title').value.trim();
    if (!title) { alert('O título é obrigatório.'); document.getElementById('f-title').focus(); return; }

    const cat = document.getElementById('f-category').value;
    const content = document.getElementById('editor-content').innerHTML;
    const readTime = document.getElementById('f-readtime').value.trim() || calcReadTime(content);

    const post = {
        id:            currentId || uid(),
        title,
        slug:          slugify(title),
        category:      cat,
        categoryLabel: CAT_LABELS[cat] || cat,
        excerpt:       document.getElementById('f-excerpt').value.trim(),
        image:         getImageValue(),
        content,
        readTime,
        date:          document.getElementById('f-date').value || today(),
        time:          document.getElementById('f-time').value || '09:00',
        featured:      document.getElementById('f-featured').checked,
        published:     document.getElementById('f-published').checked,
        seoTitle:      document.getElementById('f-seo-title').value.trim(),
        seoDesc:       document.getElementById('f-seo-desc').value.trim(),
        keywords:      document.getElementById('f-keywords').value.trim(),
    };

    async function doSave() {
        if (currentId) {
            const i = posts.findIndex(x => x.id === currentId);
            if (i !== -1) posts[i] = post;
        } else {
            posts.unshift(post);
            currentId = post.id;
            document.getElementById('form-title').textContent = 'Editar Post';
            document.getElementById('btn-delete').style.display = '';
        }
        persistLocal();
        renderSidebar();
        document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));
        const el = document.querySelector(`.post-item[data-id="${currentId}"]`);
        if (el) el.classList.add('active');
        await syncOfficialBlog(false);
        showToast();
    }

    if (post.published) {
        const textToCheck = [title, post.excerpt, post.content.replace(/<[^>]+>/g, ' ')].join(' ');
        await checkSpelling(textToCheck, doSave);
    } else {
        await doSave();
    }
}

async function deleteCurrentPost() {
    if (!currentId) return;
    const p = posts.find(x => x.id === currentId);
    if (!p || !confirm(`Excluir "${p.title}"?\nEsta ação não pode ser desfeita.`)) return;
    posts = posts.filter(x => x.id !== currentId);
    persistLocal();
    await syncOfficialBlog(false);
    currentId = null;
    renderSidebar();
    showWelcome();
}

/* ── UI HELPERS ── */
function showForm()    { document.getElementById('welcome-screen').style.display = 'none'; document.getElementById('post-form').style.display = ''; }
function showWelcome() { document.getElementById('welcome-screen').style.display = ''; document.getElementById('post-form').style.display = 'none'; }

function clearForm() {
    document.getElementById('f-title').value      = '';
    document.getElementById('f-category').value   = 'credito';
    document.getElementById('f-date').value        = today();
    document.getElementById('f-time').value        = '09:00';
    document.getElementById('f-excerpt').value     = '';
    document.getElementById('f-image').value       = '';
    document.getElementById('f-image-b64').value   = '';
    document.getElementById('f-image-file').value  = '';
    document.getElementById('upload-label').textContent = 'Clique para selecionar ou arraste a imagem aqui';
    document.getElementById('upload-filename').style.display = 'none';
    document.getElementById('upload-filename').textContent   = '';
    document.getElementById('f-readtime').value    = '';
    document.getElementById('f-featured').checked  = false;
    document.getElementById('f-published').checked = true;
    document.getElementById('editor-content').innerHTML = '';
    document.getElementById('f-seo-title').value = '';
    document.getElementById('f-seo-desc').value  = '';
    document.getElementById('f-keywords').value  = '';
    updateCharCount('f-seo-title','cnt-seo-title',60);
    updateCharCount('f-seo-desc','cnt-seo-desc',155);
    updateSeoPreview();
    const img = document.getElementById('img-preview');
    img.style.display = 'none'; img.src = '';
    switchImgTab('url');
}

function fillForm(p) {
    document.getElementById('f-title').value      = p.title      || '';
    document.getElementById('f-category').value   = p.category   || 'credito';
    document.getElementById('f-date').value        = p.date       || today();
    document.getElementById('f-time').value        = p.time       || '09:00';
    document.getElementById('f-excerpt').value     = p.excerpt    || '';
    const isB64 = (p.image || '').startsWith('data:');
    if (isB64) {
        switchImgTab('upload');
        document.getElementById('f-image-b64').value = p.image;
        document.getElementById('upload-label').textContent = 'Imagem carregada do PC';
        document.getElementById('upload-filename').textContent = '(imagem salva)';
        document.getElementById('upload-filename').style.display = 'block';
        document.getElementById('f-image').value = '';
    } else {
        switchImgTab('url');
        document.getElementById('f-image').value = p.image || '';
        document.getElementById('f-image-b64').value = '';
    }
    document.getElementById('f-readtime').value    = p.readTime   || '';
    document.getElementById('f-featured').checked  = !!p.featured;
    document.getElementById('f-published').checked = p.published !== false;
    document.getElementById('editor-content').innerHTML = p.content || '';
    document.getElementById('f-seo-title').value = p.seoTitle || '';
    document.getElementById('f-seo-desc').value  = p.seoDesc  || '';
    document.getElementById('f-keywords').value  = p.keywords || '';
    updateCharCount('f-seo-title','cnt-seo-title',60);
    updateCharCount('f-seo-desc','cnt-seo-desc',155);
    updateSeoPreview();
    updateImgPreview(p.image || '');
}

function showToast(msg) {
    const t = document.getElementById('save-toast');
    if (!t) return;
    t.textContent = '✓ ' + (msg || 'Post salvo!');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

/* ── IMAGE HELPERS ── */
function updateImgPreview(url) {
    const img = document.getElementById('img-preview');
    if (!img) return;
    if (url && (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:'))) {
        img.src = url; img.style.display = 'block';
    } else { img.style.display = 'none'; img.src = ''; }
}

function switchImgTab(tab) {
    const isUrl = tab === 'url';
    const urlPanel = document.getElementById('img-url-panel');
    const uploadPanel = document.getElementById('img-upload-panel');
    const tabUrl = document.getElementById('tab-url');
    const tabUpload = document.getElementById('tab-upload');
    
    if (urlPanel) urlPanel.style.display = isUrl ? '' : 'none';
    if (uploadPanel) uploadPanel.style.display = isUrl ? 'none' : '';
    if (tabUrl) tabUrl.classList.toggle('active', isUrl);
    if (tabUpload) tabUpload.classList.toggle('active', !isUrl);
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const b64 = e.target.result;
        document.getElementById('f-image-b64').value = b64;
        document.getElementById('upload-label').textContent = 'Imagem selecionada:';
        const fn = document.getElementById('upload-filename');
        fn.textContent = file.name;
        fn.style.display = 'block';
        document.getElementById('upload-drop').classList.remove('drag');
        updateImgPreview(b64);
    };
    reader.readAsDataURL(file);
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('upload-drop');
    if (dropZone) dropZone.classList.remove('drag');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('f-image-file');
    input.files = dt.files;
    handleFileUpload(input);
}

function getImageValue() {
    const urlPanel = document.getElementById('img-url-panel');
    if (urlPanel && urlPanel.style.display !== 'none') {
        return document.getElementById('f-image').value.trim();
    }
    return document.getElementById('f-image-b64').value || '';
}

/* ── SPELLCHECK LOGIC ── */
let _spellCallback = null;

function spellClose() {
    document.getElementById('spell-modal').classList.remove('open');
    _spellCallback = null;
}

function spellProceed() {
    document.getElementById('spell-modal').classList.remove('open');
    if (_spellCallback) { _spellCallback(); _spellCallback = null; }
}

async function checkSpelling(text, onOk) {
    const modal = document.getElementById('spell-modal');
    if (!modal) return onOk();
    
    const modalTitle = document.getElementById('spell-modal-title');
    const modalSub = document.getElementById('spell-modal-sub');
    const modalBody = document.getElementById('spell-modal-body');
    const modalActions = document.getElementById('spell-modal-actions');

    modalTitle.textContent = 'Verificando ortografia...';
    modalSub.textContent = 'Aguarde enquanto analisamos o texto.';
    modalBody.innerHTML = '';
    modalActions.style.display = 'none';
    modal.classList.add('open');

    try {
        const params = new URLSearchParams({ text, language: 'pt-BR', enabledOnly: 'false' });
        const res = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });
        const data = await res.json();
        const errors = (data.matches || []).filter(m => m.rule && m.rule.issueType !== 'style');

        if (errors.length === 0) {
            modalTitle.textContent = 'Tudo certo!';
            modalSub.textContent = 'Nenhum erro ortográfico encontrado.';
            modalBody.innerHTML = '<div class="spell-ok"><div class="spell-ok-icon">✅</div><p>Texto aprovado. Publicando...</p></div>';
            modalActions.style.display = 'none';
            setTimeout(() => { modal.classList.remove('open'); onOk(); }, 1200);
        } else {
            modalTitle.textContent = `${errors.length} problema(s) encontrado(s)`;
            modalSub.textContent = 'Revise os erros abaixo antes de publicar.';
            const list = document.createElement('div');
            list.className = 'spell-error-list';
            errors.slice(0, 15).forEach(m => {
                const word = text.substring(m.offset, m.offset + m.length);
                const suggestions = (m.replacements || []).slice(0, 3).map(r => r.value).join(', ');
                list.innerHTML += `<div class="spell-error-item">
                    <div class="spell-word">"${word}"</div>
                    <div class="spell-msg">${m.message}</div>
                    ${suggestions ? `<div class="spell-suggest">Sugestão: ${suggestions}</div>` : ''}
                </div>`;
            });
            modalBody.appendChild(list);
            modalActions.style.display = 'flex';
            _spellCallback = onOk;
        }
    } catch(e) {
        modal.classList.remove('open');
        onOk();
    }
}

/* ── EDITOR COMMANDS ── */
function cmd(command, value) {
    document.getElementById('editor-content').focus();
    document.execCommand(command, false, value || null);
}

function insertLink() {
    const url = prompt('URL do link:');
    if (url) { document.getElementById('editor-content').focus(); document.execCommand('createLink', false, url); }
}

/* ── PREVIEW ── */
function previewPost() {
    const title   = document.getElementById('f-title').value.trim() || 'Sem título';
    const cat     = document.getElementById('f-category').value;
    const excerpt = document.getElementById('f-excerpt').value.trim();
    const image   = getImageValue();
    const content = document.getElementById('editor-content').innerHTML;
    const date    = document.getElementById('f-date').value;
    const rt      = document.getElementById('f-readtime').value.trim() || calcReadTime(content);

    const cover = image
        ? `<img class="preview-cover" src="${esc(image)}" alt="${esc(title)}">`
        : `<div class="preview-cover-ph"></div>`;

    document.getElementById('preview-content').innerHTML = `
        ${cover}
        <div class="preview-body">
            <p class="preview-cat">${esc(CAT_LABELS[cat] || cat)}</p>
            <h1 class="preview-h1">${esc(title)}</h1>
            <div class="preview-meta">
                <span>📅 ${fmtDate(date)}</span>
                <span>⏱ ${esc(rt)}</span>
            </div>
            ${excerpt ? `<div class="preview-excerpt">${esc(excerpt)}</div>` : ''}
            <div class="preview-content">${content}</div>
        </div>`;
    document.getElementById('preview-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
    document.body.style.overflow = '';
}

/* ── SEO ── */
function updateCharCount(fieldId, counterId, max) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const len = field.value.length;
    const el  = document.getElementById(counterId);
    if (!el) return;
    el.textContent = len + '/' + max;
    el.className = 'char-count' + (len > max ? ' over' : len > max * 0.85 ? ' warn' : '');
    updateSeoPreview();
}

function updateSeoPreview() {
    const titleField = document.getElementById('f-seo-title');
    const titleMainField = document.getElementById('f-title');
    const descField = document.getElementById('f-seo-desc');
    
    if (!titleField || !titleMainField || !descField) return;

    const title  = titleField.value.trim() || titleMainField.value.trim() || 'Título SEO aparecerá aqui';
    const desc   = descField.value.trim()  || 'A meta descrição aparecerá aqui. Escreva algo atrativo para fazer o cliente clicar no seu resultado.';
    const slug   = slugify(titleMainField.value.trim() || 'artigo');
    const domain = localStorage.getItem('mb_site_domain') || 'mbfinance.com.br';
    
    const prevTitle = document.getElementById('seo-prev-title');
    const prevDesc = document.getElementById('seo-prev-desc');
    const prevSite = document.getElementById('seo-prev-site');
    
    if (prevTitle) prevTitle.textContent = title;
    if (prevDesc) prevDesc.textContent  = desc;
    if (prevSite) prevSite.textContent  = domain.replace(/https?:\/\//,'') + ' › blog › artigo-' + slug;
}

/* ── EXPORT ── */
async function exportBlog() {
    const pub = posts.filter(p => p.published !== false);
    if (!pub.length) { alert('Nenhum post publicado para exportar.\nCrie posts e marque como "Publicado" antes de exportar.'); return; }

    let domain = localStorage.getItem('mb_site_domain') || '';
    if (!domain) {
        domain = prompt('Qual é a URL do seu site?\n(Ex: https://mbfinance.com.br)', 'https://mbfinance.com.br');
        if (!domain) return;
        domain = domain.replace(/\/$/, '');
        localStorage.setItem('mb_site_domain', domain);
    }

    const zip      = new JSZip();
    const featured = pub.find(p => p.featured) || pub[0];
    const grid     = pub.filter(p => p.id !== featured.id);

    // blog.html (index)
    zip.file('blog.html', buildBlogHTML(featured, grid, pub, domain));

    // artigo-[slug].html para cada post
    pub.forEach(p => {
        zip.file('artigo-' + p.slug + '.html', buildArticleHTML(p, domain));
    });

    // sitemap.xml
    zip.file('sitemap.xml', buildSitemapXML(pub, domain));

    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mb-finance-blog.zip';
    a.click();
    URL.revokeObjectURL(a.href);
    alert('✅ Blog exportado!\n\nDescompacte o arquivo e envie TODOS os arquivos para a pasta do seu site (onde está o mb-finance-completo.html).');
}

function cardHTML(p) {
    const thumb = p.image
        ? `style="background-image:url('${p.image}');background-size:cover;background-position:center;"`
        : `style="background:linear-gradient(135deg,#003956,#0099dd);"`;
    return `
        <a class="card" data-cat="${esc(p.category)}" href="artigo-${esc(p.slug)}.html" style="text-decoration:none;display:block;">
            <div class="card-thumb" ${thumb}></div>
            <div class="card-body">
                <p class="card-category">${esc(p.categoryLabel)}</p>
                <h3 class="card-title">${esc(p.title)}</h3>
                <p class="card-excerpt">${esc(p.excerpt)}</p>
                <div class="card-footer">
                    <span class="card-read-time">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        ${esc(p.readTime)}
                    </span>
                    <span>${fmtDate(p.date)}</span>
                </div>
            </div>
        </a>`;
}

function featuredHTML(p) {
    const imgStyle = p.image
        ? `background-image:url('${p.image}');background-size:cover;background-position:center;`
        : `background:linear-gradient(135deg,#003956,#0099dd);`;
    return `
        <a class="featured" data-cat="${esc(p.category)}" href="artigo-${esc(p.slug)}.html" style="text-decoration:none;display:grid;grid-template-columns:1fr 1fr;">
            <div class="featured-image" style="${imgStyle}">
                <div class="featured-image-overlay"></div>
                <span class="featured-badge">Artigo em destaque</span>
            </div>
            <div class="featured-content">
                <p class="article-category">${esc(p.categoryLabel)}</p>
                <h2 class="featured-title">${esc(p.title)}</h2>
                <p class="featured-excerpt">${esc(p.excerpt)}</p>
                <div class="article-meta">
                    <span><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${esc(p.readTime)}</span>
                    <span>${fmtDate(p.date)}</span>
                </div>
                <span class="read-btn" style="margin-top:28px;display:inline-flex;align-items:center;gap:8px;background:#003956;color:#fff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;width:fit-content;">
                    Ler artigo
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </span>
            </div>
        </a>`;
}

function buildArticleHTML(p, domain) {
    const seoTitle = p.seoTitle || (p.title + ' | MB Finance');
    const seoDesc  = p.seoDesc  || p.excerpt || '';
    const keywords = p.keywords || '';
    const canonical = domain + '/artigo-' + p.slug + '.html';
    const cover = p.image
        ? `<img class="art-cover" src="${p.image}" alt="${esc(p.title)}">`
        : `<div class="art-cover-ph"></div>`;
    const yr = new Date().getFullYear();
    const dateISO = p.date || today();
    const banners = getBannersConfig();
    const hasSidebar = !!(banners.slot1 || banners.slot2);
    const artSidebarCSS = hasSidebar ? '.art-page-wrap{max-width:1280px;margin:0 auto;display:flex;gap:36px;align-items:flex-start;}.art-main{flex:1;min-width:0;max-width:none;}.ad-sidebar{width:320px;flex-shrink:0;position:sticky;top:96px;padding-top:48px;}.ad-slot{margin-bottom:20px;}@media(max-width:1100px){.art-page-wrap{flex-direction:column;}.ad-sidebar{width:100%;position:static;padding-top:0;}}' : '';
    const artSidebarHTML = hasSidebar ? '<aside class="ad-sidebar">' + (banners.slot1 ? '<div class="ad-slot">' + banners.slot1 + '</div>' : '') + (banners.slot2 ? '<div class="ad-slot">' + banners.slot2 + '</div>' : '') + '</aside>' : '';
    const artMainOpen  = hasSidebar ? '<div class="art-page-wrap"><main class="art-main">' : '<main class="art-main">';
    const artMainClose = hasSidebar ? '</main>' + artSidebarHTML + '</div>' : '</main>';
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(seoTitle)}</title>
<meta name="description" content="${esc(seoDesc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(seoTitle)}">
<meta property="og:description" content="${esc(seoDesc)}">
${p.image ? `<meta property="og:image" content="${p.image.startsWith('data:') ? '' : p.image}">` : ''}
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="MB Finance">
<meta property="article:published_time" content="${dateISO}">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(seoTitle)}">
<meta name="twitter:description" content="${esc(seoDesc)}">
<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${esc(p.title).replace(/"/g,'\\"')}","description":"${esc(seoDesc).replace(/"/g,'\\"')}","datePublished":"${dateISO}","publisher":{"@type":"Organization","name":"MB Finance","url":"${domain}"},"mainEntityOfPage":{"@type":"WebPage","@id":"${canonical}"}}
<\/script>
<link rel="icon" type="image/png" href="https://i.ibb.co/MDGzVRmC/logo-mb-finance.png">
<link rel="stylesheet" href="../tailwind.min.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;background:#f8fafc;color:#1a2332;}
.navbar{position:sticky;top:0;z-index:100;background:#003956;}
.navbar-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;}
.logo{font-size:22px;font-weight:900;text-decoration:none;}.logo span:first-child{color:#fff;}.logo span:last-child{color:#0099dd;}
.nav-back{color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px;transition:color .2s;}
.nav-back:hover{color:#fff;}
.art-hero{background:#003956;padding:48px 24px 0;}
.art-hero-inner{max-width:780px;margin:0 auto;}
.art-cat{font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#0099dd;margin-bottom:14px;}
.art-hero h1{font-family:'Inter',sans-serif;font-size:clamp(26px,4vw,42px);font-weight:900;color:#fff;line-height:1.2;margin-bottom:16px;}
.art-meta{display:flex;align-items:center;gap:20px;font-size:13px;color:rgba(255,255,255,0.55);font-weight:600;padding-bottom:32px;}
.art-cover{width:100%;max-height:420px;object-fit:cover;display:block;border-radius:0;}
.art-cover-ph{width:100%;height:320px;background:linear-gradient(135deg,#003956,#0099dd);display:block;}
.art-main{max-width:780px;margin:0 auto;padding:48px 24px 80px;}
.art-excerpt-box{font-size:17px;color:#475569;line-height:1.75;font-weight:500;padding:22px 24px;background:#f0f9ff;border-radius:12px;border-left:4px solid #0099dd;margin-bottom:36px;}
.art-content{font-size:16px;line-height:1.9;color:#374151;}
.art-content h2{font-family:'Inter',sans-serif;font-size:24px;font-weight:700;color:#003956;margin:36px 0 14px;}
.art-content h3{font-size:18px;font-weight:800;color:#003956;margin:28px 0 10px;}
.art-content p{margin-bottom:18px;}
.art-content strong{font-weight:800;color:#003956;}
.art-content ul,.art-content ol{margin:10px 0 18px 24px;}
.art-content li{margin-bottom:8px;}
.art-content blockquote{border-left:4px solid #0099dd;padding:16px 20px;background:#f0f9ff;border-radius:0 10px 10px 0;margin:24px 0;color:#003956;font-style:italic;font-size:17px;}
.art-content a{color:#0099dd;text-decoration:underline;}
.art-cta{background:#003956;border-radius:16px;padding:40px;text-align:center;margin-top:48px;}
.art-cta h3{font-size:22px;font-weight:900;color:#fff;margin-bottom:8px;}
.art-cta p{color:rgba(255,255,255,0.6);margin-bottom:24px;font-size:15px;}
.art-cta a{display:inline-flex;align-items:center;gap:8px;background:#0099dd;color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;transition:opacity .2s;}
.art-cta a:hover{opacity:.85;}
.back-link{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:13px;font-weight:600;text-decoration:none;margin-bottom:28px;transition:color .2s;}
.back-link:hover{color:#003956;}
.footer{background:#000;padding:28px 24px;text-align:center;}
.footer p{color:rgba(255,255,255,0.25);font-size:12px;}
${artSidebarCSS}
</style>
</head>
<body>
<nav class="navbar">
  <div class="navbar-inner">
    <a href="../mb-finance-completo.html" class="logo"><span>mb</span><span>finance.</span></a>
    <a href="blog.html" class="nav-back">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Voltar ao Blog
    </a>
  </div>
</nav>
<div class="art-hero">
  <div class="art-hero-inner">
    <p class="art-cat">${esc(p.categoryLabel)}</p>
    <h1>${esc(p.title)}</h1>
    <div class="art-meta">
      <span>📅 ${fmtDate(p.date)}</span>
      <span>⏱ ${esc(p.readTime)}</span>
    </div>
  </div>
</div>
${cover}
${artMainOpen}
  <a href="blog.html" class="back-link">
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12H5M12 5l-7 7 7 7"/></svg>
    Ver todos os artigos
  </a>
  ${p.excerpt ? `<div class="art-excerpt-box">${esc(p.excerpt)}</div>` : ''}
  <div class="art-content">${p.content}</div>
  <div class="art-cta">
    <h3>Precisa de crédito para sua empresa?</h3>
    <p>A MB Finance encontra as melhores condições entre todos os nossos parceiros.</p>
    <a href="https://wa.me/552139008295?text=${encodeURIComponent('Olá! Li o artigo "' + p.title + '" e gostaria de falar com um especialista da MB Finance.')}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Falar com um especialista
    </a>
  </div>
${artMainClose}
<footer class="footer"><p>© ${yr} MB Finance. Todos os direitos reservados.</p></footer>
</body>
</html>`;
}

function buildSitemapXML(posts, domain) {
    const today_str = today();
    const urls = [
        `  <url><loc>${domain}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
        `  <url><loc>${domain}/blog.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
        ...posts.map(p => `  <url><loc>${domain}/artigo-${p.slug}.html</loc><lastmod>${p.date || today_str}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function buildBlogHTML(featured, gridPosts, allPosts, domain) {
    const yr = new Date().getFullYear();
    const canonical = (domain || '') + '/blog.html';
    const banners = getBannersConfig();
    const hasSidebar = !!(banners.slot1 || banners.slot2);
    const blogSidebarCSS = hasSidebar ? '.page-wrap{max-width:1280px;margin:0 auto;padding:56px 24px 80px;display:flex;gap:36px;align-items:flex-start;}.main{max-width:none!important;padding:0!important;margin:0!important;flex:1;min-width:0;}.ad-sidebar{width:320px;flex-shrink:0;position:sticky;top:120px;}.ad-slot{margin-bottom:20px;}@media(max-width:1100px){.page-wrap{flex-direction:column;}.ad-sidebar{width:100%;position:static;}}' : '';
    const blogSidebarHTML = hasSidebar ? '<aside class="ad-sidebar">' + (banners.slot1 ? '<div class="ad-slot">' + banners.slot1 + '</div>' : '') + (banners.slot2 ? '<div class="ad-slot">' + banners.slot2 + '</div>' : '') + '</aside>' : '';
    const blogMainOpen  = hasSidebar ? '<div class="page-wrap"><main class="main">' : '<main class="main">';
    const blogMainClose = hasSidebar ? '</main>' + blogSidebarHTML + '</div>' : '</main>';
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog MB Finance | Crédito, Finanças e Gestão Empresarial</title>
<meta name="description" content="Artigos sobre crédito empresarial, gestão financeira, conta PJ e oportunidades de mercado. Conteúdo exclusivo da MB Finance para empresários.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="Blog MB Finance | Crédito e Finanças Empresariais">
<meta property="og:description" content="Artigos sobre crédito empresarial, gestão financeira e oportunidades para empresas.">
<meta property="og:url" content="${canonical}">
<link rel="icon" type="image/png" href="https://i.ibb.co/MDGzVRmC/logo-mb-finance.png">
<link rel="stylesheet" href="../tailwind.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',sans-serif;background:#f8fafc;color:#1a2332;}
.navbar{position:sticky;top:0;z-index:100;background:#003956;}
.navbar-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;}
.logo{font-size:22px;font-weight:900;letter-spacing:-0.5px;text-decoration:none;}
.logo span:first-child{color:#fff;}.logo span:last-child{color:#0099dd;}
.nav-back{color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px;transition:color .2s;}
.nav-back:hover{color:#fff;}
.hero{background:#003956;padding:64px 24px 80px;}
.hero-inner{max-width:1200px;margin:0 auto;}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(0,153,221,0.15);color:#0099dd;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;padding:6px 14px;border-radius:999px;border:1px solid rgba(0,153,221,0.25);margin-bottom:24px;}
.hero-tag::before{content:'';width:6px;height:6px;background:#0099dd;border-radius:50%;}
.hero-title{font-family:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;font-size:clamp(36px,5vw,60px);font-weight:900;color:#fff;line-height:1.1;margin-bottom:20px;}
.hero-title span{color:#0099dd;}
.hero-sub{color:rgba(255,255,255,0.55);font-size:17px;line-height:1.7;max-width:560px;}
.search-box{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:10px 16px;max-width:600px;margin-top:32px;transition:border-color .2s;}
.search-box:focus-within{border-color:#0099dd;background:rgba(255,255,255,0.12);}
.search-box svg{color:rgba(255,255,255,0.4);flex-shrink:0;}
.search-box input{flex:1;background:none;border:none;outline:none;color:#fff;font-size:15px;font-family:'Inter',sans-serif;}
.search-box input::placeholder{color:rgba(255,255,255,0.35);}
.search-box button{background:#0099dd;color:#fff;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;}
.filter-bar{background:#fff;border-bottom:1px solid #e8edf2;position:sticky;top:64px;z-index:90;}
.filter-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:4px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
.filter-inner::-webkit-scrollbar{display:none;}
.filter-inner::after{content:'';flex:0 0 24px;}
.filter-btn{white-space:nowrap;flex:0 0 auto;padding:16px 18px;font-size:13px;font-weight:700;color:#64748b;border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;}
.filter-btn:hover{color:#003956;}.filter-btn.active{color:#0099dd;border-bottom-color:#0099dd;}
.main{max-width:1200px;margin:0 auto;padding:56px 24px 80px;}
.featured{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);margin-bottom:56px;border:1px solid #e8edf2;cursor:pointer;transition:box-shadow .2s;}
.featured:hover{box-shadow:0 8px 40px rgba(0,57,86,0.12);}
.featured-image{min-height:380px;position:relative;display:flex;align-items:flex-end;padding:32px;}
.featured-image-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 60%);}
.featured-badge{position:relative;z-index:1;background:#0099dd;color:#fff;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:5px 12px;border-radius:999px;display:inline-block;}
.featured-content{padding:48px 40px;display:flex;flex-direction:column;justify-content:center;}
.article-category{font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#0099dd;margin-bottom:14px;}
.featured-title{font-family:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;font-size:28px;font-weight:700;color:#003956;line-height:1.3;margin-bottom:16px;}
.featured-excerpt{font-size:15px;color:#64748b;line-height:1.7;margin-bottom:28px;}
.article-meta{display:flex;align-items:center;gap:16px;font-size:12px;color:#94a3b8;font-weight:600;}
.article-meta span{display:flex;align-items:center;gap:5px;}
.read-btn{display:inline-flex;align-items:center;gap:8px;background:#003956;color:#fff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;border:none;cursor:pointer;transition:all .2s;margin-top:28px;width:fit-content;}
.read-btn:hover{background:#0099dd;}
.section-title{font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#0099dd;margin-bottom:24px;display:flex;align-items:center;gap:10px;}
.section-title::after{content:'';flex:1;height:1px;background:#e8edf2;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:56px;}
.card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8edf2;transition:all .3s;cursor:pointer;}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,57,86,0.1);border-color:#0099dd;}
.card-thumb{height:180px;background-size:cover;background-position:center;}
.card-body{padding:24px;}
.card-category{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#0099dd;margin-bottom:10px;}
.card-title{font-size:16px;font-weight:800;color:#003956;line-height:1.4;margin-bottom:10px;}
.card-excerpt{font-size:13px;color:#64748b;line-height:1.6;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.card-footer{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#94a3b8;font-weight:600;padding-top:16px;border-top:1px solid #f1f5f9;}
.card-read-time{display:flex;align-items:center;gap:4px;}
.no-results{text-align:center;padding:48px 24px;color:#94a3b8;font-size:15px;display:none;grid-column:1/-1;}
.newsletter{background:#003956;border-radius:20px;padding:56px 48px;text-align:center;margin-bottom:56px;position:relative;overflow:hidden;}
.newsletter::before{content:'';position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(0,153,221,0.15) 0%,transparent 70%);}
.newsletter h3{font-family:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;font-size:32px;font-weight:700;color:#fff;margin-bottom:12px;position:relative;}
.newsletter p{color:rgba(255,255,255,0.55);font-size:15px;margin-bottom:32px;position:relative;}
.newsletter-form{display:flex;gap:12px;max-width:480px;margin:0 auto;position:relative;}
.newsletter-input{flex:1;padding:14px 20px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:#fff;font-size:14px;outline:none;}
.newsletter-btn{padding:14px 28px;background:#0099dd;color:#fff;font-size:14px;font-weight:700;border:none;border-radius:10px;cursor:pointer;}
.footer{background:#000;padding:32px 24px;text-align:center;}
.footer p{color:rgba(255,255,255,0.25);font-size:12px;}
@media (max-width:768px){.filter-inner{padding:0 12px;gap:0;}.filter-inner::after{flex-basis:12px;}.filter-btn{padding:16px 14px;font-size:12px;}}
${blogSidebarCSS}
</style>
</head>
<body>
<nav class="navbar">
  <div class="navbar-inner">
    <a href="../mb-finance-completo.html" class="logo"><span>mb</span><span>finance.</span></a>
    <a href="../mb-finance-completo.html" class="nav-back">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Voltar ao site
    </a>
  </div>
</nav>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-tag">Conteúdo exclusivo</div>
    <h1 class="hero-title">Inteligência financeira para<br>o seu <span>negócio crescer</span></h1>
    <p class="hero-sub">Análises, guias práticos e insights sobre crédito empresarial, gestão financeira e oportunidades de mercado.</p>
    <div class="search-box">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
      <input type="text" id="search-input" placeholder="Buscar artigos..." oninput="searchCards(this.value)">
      <button onclick="searchCards(document.getElementById('search-input').value)">Buscar</button>
    </div>
  </div>
</section>
<div class="filter-bar">
  <div class="filter-inner">
    <button class="filter-btn active" onclick="filterCat(this,'todos')">Todos</button>
    <button class="filter-btn" onclick="filterCat(this,'credito')">Crédito Empresarial</button>
    <button class="filter-btn" onclick="filterCat(this,'gestao')">Gestão Financeira</button>
    <button class="filter-btn" onclick="filterCat(this,'conta-pj')">Conta PJ</button>
    <button class="filter-btn" onclick="filterCat(this,'mercado')">Mercado</button>
    <button class="filter-btn" onclick="filterCat(this,'antecipacao')">Antecipação</button>
    <button class="filter-btn" onclick="filterCat(this,'noticias')">Notícias</button>
  </div>
</div>
${blogMainOpen}
  <p class="section-title">Destaque</p>
  ${featuredHTML(featured)}
  <p class="section-title">Artigos recentes</p>
  <div class="grid-3" id="grid">
    ${gridPosts.length ? gridPosts.map(cardHTML).join('\n') : '<p style="color:#94a3b8;grid-column:1/-1;text-align:center;padding:40px">Nenhum artigo adicional publicado ainda.</p>'}
    <div id="no-results" class="no-results">Nenhum artigo encontrado.</div>
  </div>
  <div class="newsletter">
    <h3>Receba os melhores conteúdos</h3>
    <p>Análises e artigos sobre finanças empresariais direto no seu e-mail, sem spam.</p>
    <div class="newsletter-form">
      <input type="email" class="newsletter-input" placeholder="seu@email.com.br">
      <button class="newsletter-btn">Quero receber</button>
    </div>
  </div>
${blogMainClose}
<footer class="footer"><p>© ${yr} MB Finance. Todos os direitos reservados.</p></footer>
<script>
function searchCards(q){q=q.toLowerCase().trim();var cards=document.querySelectorAll('[data-cat]');var v=0;cards.forEach(function(c){var show=!q||c.textContent.toLowerCase().includes(q);c.style.display=show?'':'none';if(show)v++;});document.getElementById('no-results').style.display=v===0?'block':'none';if(q)document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});document.querySelector('.filter-btn').classList.add('active');}
function filterCat(btn,cat){document.getElementById('search-input').value='';document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');document.querySelectorAll('[data-cat]').forEach(function(el){el.style.display=(cat==='todos'||el.getAttribute('data-cat')===cat)?'':'none';});}
<\/script>
</body>
</html>`;
}

// Export to window
window.loadPosts = loadPosts;
window.loadLocalPosts = loadLocalPosts;
window.persistLocal = persistLocal;
window.newPost = newPost;
window.editPost = editPost;
window.savePost = savePost;
window.deleteCurrentPost = deleteCurrentPost;
window.showForm = showForm;
window.showWelcome = showWelcome;
window.clearForm = clearForm;
window.fillForm = fillForm;
window.showToast = showToast;
window.updateImgPreview = updateImgPreview;
window.switchImgTab = switchImgTab;
window.handleFileUpload = handleFileUpload;
window.handleDrop = handleDrop;
window.getImageValue = getImageValue;
window.spellClose = spellClose;
window.spellProceed = spellProceed;
window.checkSpelling = checkSpelling;
window.cmd = cmd;
window.insertLink = insertLink;
window.previewPost = previewPost;
window.closePreview = closePreview;
window.updateCharCount = updateCharCount;
window.updateSeoPreview = updateSeoPreview;
window.exportBlog = exportBlog;
window.configureOfficialBlog = configureOfficialBlog;
window.syncOfficialBlog = syncOfficialBlog;
window.renderSidebar = renderSidebar;
window.getBannersConfig = getBannersConfig;

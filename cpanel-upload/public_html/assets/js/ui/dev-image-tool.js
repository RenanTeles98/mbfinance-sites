// Dev tool: visual image repositioner (Ctrl+Shift+D to toggle)

(function () {
    const TARGET_IMG_ID   = 'dev-hero-img';
    const TARGET_WRAP_ID  = 'dev-hero-wrap';

    let panel = null;
    let visible = false;

    function getEl(id) { return document.getElementById(id); }

    function buildPanel() {
        const wrap = getEl(TARGET_WRAP_ID);
        const img  = getEl(TARGET_IMG_ID);
        if (!wrap || !img) return;

        // Read current values
        const currentTop = wrap.style.top || '0px';
        const currentObjPos = img.style.objectPosition || 'center center';

        panel = document.createElement('div');
        panel.id = 'dev-image-panel';
        panel.innerHTML = `
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;color:#0099dd;">
                🛠 Dev: Repositionar Imagem
            </div>

            <label style="display:block;margin-bottom:4px;font-size:12px;">Top do container</label>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <input type="range" id="dev-top" min="-10" max="20" step="0.5" value="4"
                    style="flex:1;accent-color:#0099dd;">
                <span id="dev-top-val" style="min-width:50px;font-size:12px;font-family:monospace;">4rem</span>
            </div>

            <label style="display:block;margin-bottom:4px;font-size:12px;">Object-position X (%)</label>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <input type="range" id="dev-ox" min="0" max="100" step="1" value="50"
                    style="flex:1;accent-color:#0099dd;">
                <span id="dev-ox-val" style="min-width:50px;font-size:12px;font-family:monospace;">50%</span>
            </div>

            <label style="display:block;margin-bottom:4px;font-size:12px;">Object-position Y (%)</label>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                <input type="range" id="dev-oy" min="0" max="100" step="1" value="50"
                    style="flex:1;accent-color:#0099dd;">
                <span id="dev-oy-val" style="min-width:50px;font-size:12px;font-family:monospace;">50%</span>
            </div>

            <button id="dev-copy-btn"
                style="width:100%;padding:8px;background:#0099dd;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                Copiar valores
            </button>
            <div id="dev-copy-msg" style="font-size:11px;color:#4ade80;text-align:center;margin-top:8px;min-height:16px;"></div>
        `;

        Object.assign(panel.style, {
            position:     'fixed',
            bottom:       '24px',
            left:         '24px',
            zIndex:       '99999',
            background:   'rgba(4,15,26,0.97)',
            border:       '1px solid rgba(0,153,221,0.35)',
            borderRadius: '14px',
            padding:      '18px 20px',
            width:        '280px',
            color:        '#fff',
            fontFamily:   'sans-serif',
            boxShadow:    '0 8px 40px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
        });

        document.body.appendChild(panel);

        // Init slider values from current styles
        const topRem = parseFloat(currentTop) || 4;
        document.getElementById('dev-top').value = topRem;
        document.getElementById('dev-top-val').textContent = topRem + 'rem';

        const parts = currentObjPos.split(' ');
        const ox = parseFloat(parts[0]) || 50;
        const oy = parseFloat(parts[1]) || 50;
        document.getElementById('dev-ox').value = ox;
        document.getElementById('dev-ox-val').textContent = ox + '%';
        document.getElementById('dev-oy').value = oy;
        document.getElementById('dev-oy-val').textContent = oy + '%';

        // Live update
        function update() {
            const top = document.getElementById('dev-top').value;
            const ox  = document.getElementById('dev-ox').value;
            const oy  = document.getElementById('dev-oy').value;

            document.getElementById('dev-top-val').textContent = top + 'rem';
            document.getElementById('dev-ox-val').textContent  = ox  + '%';
            document.getElementById('dev-oy-val').textContent  = oy  + '%';

            wrap.style.top             = top + 'rem';
            img.style.objectPosition   = ox + '% ' + oy + '%';
        }

        ['dev-top','dev-ox','dev-oy'].forEach(id => {
            document.getElementById(id).addEventListener('input', update);
        });

        // Copy button
        document.getElementById('dev-copy-btn').addEventListener('click', () => {
            const top = document.getElementById('dev-top').value;
            const ox  = document.getElementById('dev-ox').value;
            const oy  = document.getElementById('dev-oy').value;

            const text =
                `top: ${top}rem\n` +
                `object-position: ${ox}% ${oy}%`;

            navigator.clipboard.writeText(text).then(() => {
                const msg = document.getElementById('dev-copy-msg');
                msg.textContent = '✓ Copiado!';
                setTimeout(() => msg.textContent = '', 2000);
            });
        });
    }

    function togglePanel() {
        if (!panel) { buildPanel(); visible = true; return; }
        visible = !visible;
        panel.style.display = visible ? 'block' : 'none';
    }

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            togglePanel();
        }
    });
})();

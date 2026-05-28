(function () {

    const WA_NUMBER = '552139008295';

    // ── Sub-produtos INSS ─────────────────────────────────────────────────────

    const INSS_SUBPRODUCTS = [
        {
            id: 'verbas_indenizatorias',
            label: 'Exclusão de Verbas Indenizatórias',
            desc: 'Sua empresa pode estar pagando INSS sobre rubricas que não deveriam entrar no cálculo — como aviso prévio indenizado, vale-transporte e férias indenizadas. A análise recupera os últimos 5 anos.',
        },
        {
            id: 'teto_contribuicao',
            label: 'Teto de Contribuição INSS',
            desc: 'Colaboradores com salário acima do teto legal não devem ter INSS calculado sobre o valor excedente. Se isso ocorreu na sua folha, há crédito a recuperar.',
        },
        {
            id: 'desoneracao_folha',
            label: 'Desoneração da Folha (CPRB)',
            desc: 'Empresas elegíveis podem substituir os 20% sobre a folha por uma alíquota menor sobre o faturamento. Se sua empresa não aproveitou esse benefício corretamente, há valores a reaver.',
        },
        {
            id: 'nao_sei',
            label: 'Não sei ao certo',
            desc: 'Nosso especialista avalia o perfil da sua empresa e identifica qual modalidade se aplica melhor ao seu caso.',
        },
    ];

    // ── Produtos e perguntas ──────────────────────────────────────────────────

    const PRODUCTS = {
        inss: {
            id: 'inss',
            label: 'INSS',
            desc: 'Recupere valores pagos a mais de INSS nos últimos 5 anos.',
            icon: `<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
            questions: [
                {
                    id: 'segmento',
                    text: 'Qual é o setor da sua empresa?',
                    options: [
                        { label: 'Comércio',         value: 'Comércio' },
                        { label: 'Indústria',         value: 'Indústria' },
                        { label: 'Construção Civil',  value: 'Construção Civil' },
                        { label: 'Serviços',          value: 'Serviços' },
                        { label: 'Tecnologia',        value: 'Tecnologia' },
                        { label: 'Outro',             value: 'Outro' },
                    ],
                    disqualify: null,
                },
                {
                    id: 'mei',
                    text: 'Sua empresa é MEI?',
                    options: [
                        { label: 'Não — somos ME, EPP ou maior', value: 'Não' },
                        { label: 'Sim — somos MEI',               value: 'Sim' },
                    ],
                    disqualify: v => v === 'Sim',
                    disqualifyMsg: 'A análise de INSS é para empresas acima do MEI. Como MEI, o recolhimento é unificado no DAS e não se aplica a essa análise.',
                },
                {
                    id: 'funcionarios',
                    text: 'Quantos funcionários registrados sua empresa tem?',
                    options: [
                        { label: 'Menos de 10',  value: 'Menos de 10' },
                        { label: 'De 10 a 30',   value: 'De 10 a 30' },
                        { label: 'De 31 a 100',  value: 'De 31 a 100' },
                        { label: 'Mais de 100',  value: 'Mais de 100' },
                    ],
                    disqualify: v => v === 'Menos de 10',
                    disqualifyMsg: 'Para que a análise de INSS seja viável, a empresa precisa ter pelo menos 10 funcionários registrados. Com uma folha menor, o valor a recuperar normalmente não cobre o processo.',
                },
                {
                    id: 'tempo_cnpj',
                    text: 'Há quanto tempo seu CNPJ está ativo?',
                    options: [
                        { label: 'Menos de 5 anos', value: 'Menos de 5 anos' },
                        { label: 'De 5 a 10 anos',  value: 'De 5 a 10 anos' },
                        { label: 'Mais de 10 anos', value: 'Mais de 10 anos' },
                    ],
                    disqualify: v => v === 'Menos de 5 anos',
                    disqualifyMsg: 'A análise cobre os últimos 5 anos de recolhimento, por isso precisamos de no mínimo 5 anos de CNPJ ativo para encontrar valores a recuperar.',
                },
                {
                    id: 'valor_inss',
                    text: 'Quanto sua empresa recolhe de INSS por mês, aproximadamente?',
                    options: [
                        { label: 'Menos de R$ 10 mil',     value: 'Menos de R$ 10 mil' },
                        { label: 'R$ 10 mil a R$ 30 mil',   value: 'R$ 10 mil a R$ 30 mil' },
                        { label: 'R$ 30 mil a R$ 100 mil',  value: 'R$ 30 mil a R$ 100 mil' },
                        { label: 'Acima de R$ 100 mil',     value: 'Acima de R$ 100 mil' },
                    ],
                    disqualify: v => v === 'Menos de R$ 10 mil',
                    disqualifyMsg: 'Para que a recuperação seja financeiramente viável, o recolhimento mensal mínimo é de R$ 10 mil. Com valores menores, o crédito recuperado não cobre os custos do processo.',
                },
                {
                    id: 'pagamento_dia',
                    text: 'Os recolhimentos de INSS da sua empresa estão em dia?',
                    options: [
                        { label: 'Sim, está tudo em dia',         value: 'Em dia' },
                        { label: 'Não, há atrasos ou pendências', value: 'Com pendências' },
                    ],
                    disqualify: v => v === 'Com pendências',
                    disqualifyMsg: 'Para prosseguir com a análise, os pagamentos precisam estar regulares. Assim que normalizar as pendências, entre em contato — ficaremos felizes em ajudar.',
                },
            ],
        },

        pis_cofins: {
            id: 'pis_cofins',
            label: 'PIS / COFINS',
            desc: 'Recupere créditos sobre produtos que sua empresa compra e revende.',
            icon: `<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>`,
            questions: [
                {
                    id: 'segmento',
                    text: 'Qual é o segmento da sua empresa?',
                    subtitle: 'Este produto é exclusivo para o setor varejista.',
                    options: [
                        { label: 'Supermercado / Alimentação', value: 'Supermercado / Alimentação' },
                        { label: 'Farmácia / Drogaria',         value: 'Farmácia / Drogaria' },
                        { label: 'Moda / Calçados',             value: 'Moda / Calçados' },
                        { label: 'Eletro / Informática',        value: 'Eletro / Informática' },
                        { label: 'Outro tipo de varejo',        value: 'Outro varejo' },
                        { label: 'Serviços / Não é varejo',     value: 'Serviços' },
                    ],
                    disqualify: v => v === 'Serviços',
                    disqualifyMsg: 'O PIS/COFINS é exclusivo para empresas do varejo. Para outros segmentos, temos outros produtos que podem se adequar melhor ao seu perfil.',
                },
                {
                    id: 'revenda_produtos',
                    text: 'Sua empresa compra e revende produtos?',
                    subtitle: 'A análise de PIS/COFINS depende dos itens comercializados pela empresa.',
                    options: [
                        { label: 'Sim, compra e revende produtos', value: 'Compra e revende produtos' },
                        { label: 'Vende produtos e serviços',      value: 'Produtos e serviços' },
                        { label: 'Não, vende apenas serviços',      value: 'Apenas serviços' },
                    ],
                    disqualify: v => v === 'Apenas serviços',
                    disqualifyMsg: 'A análise de PIS/COFINS depende da compra e revenda de produtos. Para empresas de serviços, podemos avaliar outro caminho mais adequado.',
                },
            ],
        },
    };

    // ── Estado ────────────────────────────────────────────────────────────────

    let state = {
        product:    null,
        subProduct: null,
        step:       0,
        answers:    {},
        contact:    { nome: '', telefone: '', cnpj: '' },
    };

    // ── Injeção de CSS ────────────────────────────────────────────────────────

    function injectStyles() {
        const s = document.createElement('style');
        s.textContent = `
            #trib-overlay {
                position: fixed; inset: 0; z-index: 10000;
                background: rgba(4,15,26,0.82);
                backdrop-filter: blur(6px);
                display: flex; align-items: center; justify-content: center;
                padding: 16px;
                opacity: 0; pointer-events: none;
                transition: opacity 0.25s;
            }
            #trib-overlay.open { opacity: 1; pointer-events: all; }

            #trib-modal {
                background: #0a1929;
                border: 1px solid rgba(0,153,221,0.2);
                border-radius: 20px;
                width: 100%; max-width: 520px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 36px 32px 32px;
                position: relative;
                box-shadow: 0 32px 80px rgba(0,0,0,0.6);
                transform: translateY(16px);
                transition: transform 0.28s cubic-bezier(.22,.68,0,1.2);
            }
            #trib-overlay.open #trib-modal { transform: translateY(0); }

            #trib-close {
                position: absolute; top: 16px; right: 18px;
                background: none; border: none; cursor: pointer;
                color: rgba(255,255,255,0.35); font-size: 22px; line-height: 1;
                transition: color 0.2s;
            }
            #trib-close:hover { color: #fff; }

            .trib-progress {
                display: flex; gap: 6px; margin-bottom: 28px;
            }
            .trib-progress-dot {
                height: 3px; flex: 1; border-radius: 99px;
                background: rgba(255,255,255,0.1);
                transition: background 0.3s;
            }
            .trib-progress-dot.active { background: #0099dd; }
            .trib-progress-dot.done   { background: rgba(0,153,221,0.45); }

            .trib-label {
                font-size: 11px; font-weight: 700; letter-spacing: 2px;
                text-transform: uppercase; color: #0099dd; margin-bottom: 10px;
            }
            .trib-title {
                font-size: clamp(1.1rem,3vw,1.35rem); font-weight: 700;
                color: #fff; margin: 0 0 6px; line-height: 1.3;
            }
            .trib-subtitle {
                font-size: 13px; color: rgba(255,255,255,0.45);
                margin: 0 0 22px;
            }

            .trib-options {
                display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
                margin-bottom: 8px;
            }
            .trib-options.single-col { grid-template-columns: 1fr; }

            .trib-option {
                background: rgba(255,255,255,0.04);
                border: 1.5px solid rgba(255,255,255,0.1);
                border-radius: 12px; padding: 14px 16px;
                color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 500;
                cursor: pointer; text-align: left;
                transition: all 0.18s; display: flex; align-items: center; gap: 10px;
            }
            .trib-option:hover {
                border-color: #0099dd;
                background: rgba(0,153,221,0.08);
                color: #fff;
            }
            .trib-option.selected {
                border-color: #0099dd;
                background: rgba(0,153,221,0.14);
                color: #fff;
            }

            .trib-subprod-card {
                background: rgba(255,255,255,0.04);
                border: 1.5px solid rgba(255,255,255,0.1);
                border-radius: 14px; padding: 16px 18px;
                cursor: pointer; text-align: left; width: 100%;
                transition: all 0.18s;
                display: flex; flex-direction: column; gap: 5px;
            }
            .trib-subprod-card:hover,
            .trib-subprod-card.selected {
                border-color: #0099dd;
                background: rgba(0,153,221,0.1);
            }
            .trib-subprod-card .sp-label {
                font-size: 14px; font-weight: 700; color: #fff;
            }
            .trib-subprod-card .sp-desc {
                font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.55;
            }

            .trib-input-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
            .trib-input-wrap { display: flex; flex-direction: column; gap: 6px; }
            .trib-input-label { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 600; }
            .trib-input {
                width: 100%; padding: 13px 14px;
                background: rgba(255,255,255,0.05);
                border: 1.5px solid rgba(255,255,255,0.1);
                border-radius: 10px; color: #fff; font-size: 14px;
                outline: none; box-sizing: border-box;
                transition: border-color 0.2s;
                font-family: inherit;
            }
            .trib-input:focus { border-color: rgba(0,153,221,0.6); }
            .trib-input::placeholder { color: rgba(255,255,255,0.2); }

            .trib-product-card {
                background: rgba(255,255,255,0.04);
                border: 1.5px solid rgba(255,255,255,0.1);
                border-radius: 14px; padding: 20px;
                cursor: pointer; transition: all 0.2s;
                display: flex; flex-direction: column; gap: 8px;
            }
            .trib-product-card:hover,
            .trib-product-card.selected {
                border-color: #0099dd;
                background: rgba(0,153,221,0.1);
            }
            .trib-product-card .card-name { font-size: 15px; font-weight: 700; color: #fff; }
            .trib-product-card .card-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; }
            .trib-option-icon {
                width: 36px; height: 36px; border-radius: 10px;
                background: rgba(0,153,221,0.12);
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0; color: #0099dd;
            }

            .trib-btn {
                width: 100%; padding: 15px;
                background: #0099dd; color: #fff;
                border: none; border-radius: 12px;
                font-size: 15px; font-weight: 700; cursor: pointer;
                display: flex; align-items: center; justify-content: center; gap: 10px;
                transition: background 0.2s, transform 0.15s;
                margin-top: 16px;
            }
            .trib-btn:hover { background: #0077b6; transform: translateY(-1px); }
            .trib-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

            .trib-btn-ghost {
                background: none; border: none; color: rgba(255,255,255,0.35);
                font-size: 13px; cursor: pointer; padding: 10px 0 0;
                display: block; width: 100%; text-align: center;
                transition: color 0.2s;
            }
            .trib-btn-ghost:hover { color: #fff; }

            .trib-result { text-align: center; padding: 8px 0; }
            .trib-result-icon {
                width: 64px; height: 64px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 20px; font-size: 28px;
            }
            .trib-result-icon.success { background: rgba(0,153,221,0.15); }
            .trib-result-icon.fail    { background: rgba(255,100,100,0.1); }
            .trib-result h2 { font-size: 1.3rem; font-weight: 700; color: #fff; margin: 0 0 10px; }
            .trib-result p  { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; margin: 0 0 24px; }

            @media (max-width: 480px) {
                #trib-modal { padding: 28px 20px 24px; }
                .trib-options { grid-template-columns: 1fr; }
            }
        `;
        document.head.appendChild(s);
    }

    // ── DOM helpers ───────────────────────────────────────────────────────────

    function getOverlay() { return document.getElementById('trib-overlay'); }

    function setContent(html, callback) {
        const body = document.getElementById('trib-body');
        body.style.opacity = '0';
        body.style.transform = 'translateX(12px)';
        setTimeout(() => {
            body.innerHTML = html;
            body.style.transition = 'opacity 0.22s, transform 0.22s';
            requestAnimationFrame(() => {
                body.style.opacity = '1';
                body.style.transform = 'translateX(0)';
            });
            if (callback) callback();
        }, 180);
    }

    function buildProgressBar(total, current) {
        if (total <= 1) return '';
        let dots = '';
        for (let i = 0; i < total; i++) {
            const cls = i < current ? 'done' : i === current ? 'active' : '';
            dots += `<div class="trib-progress-dot ${cls}"></div>`;
        }
        return `<div class="trib-progress">${dots}</div>`;
    }

    // ── Telas ─────────────────────────────────────────────────────────────────

    function showProductSelect() {
        state = { product: null, subProduct: null, step: 0, answers: {}, contact: { nome: '', telefone: '', cnpj: '' } };
        setContent(`
            <div class="trib-label">Análise gratuita</div>
            <h2 class="trib-title">Qual produto tem interesse?</h2>
            <p class="trib-subtitle">Selecione para iniciarmos sua pré-qualificação.</p>
            <div class="trib-options" style="grid-template-columns:1fr 1fr;margin-bottom:0;">
                ${Object.values(PRODUCTS).map(p => `
                    <div class="trib-product-card" data-product="${p.id}">
                        <div class="trib-option-icon">${p.icon}</div>
                        <div class="card-name">${p.label}</div>
                        <div class="card-desc">${p.desc}</div>
                    </div>
                `).join('')}
            </div>
            <button class="trib-btn" id="trib-next-product" disabled>Continuar →</button>
        `, () => {
            document.querySelectorAll('.trib-product-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.trib-product-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    state.product = card.dataset.product;
                    document.getElementById('trib-next-product').disabled = false;
                });
            });

            document.getElementById('trib-next-product').addEventListener('click', () => {
                if (!state.product) return;
                if (state.product === 'inss') {
                    showSubProductSelect();
                } else {
                    showDataForm();
                }
            });
        });
    }

    function showSubProductSelect() {
        setContent(`
            <div class="trib-label">INSS Patronal</div>
            <h2 class="trib-title">Com qual modalidade sua empresa se identifica?</h2>
            <p class="trib-subtitle">Trabalhamos com três tipos de recuperação de INSS. Selecione o que mais se aplica.</p>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:8px;">
                ${INSS_SUBPRODUCTS.map(sp => `
                    <button class="trib-subprod-card" data-sub="${sp.id}">
                        <span class="sp-label">${sp.label}</span>
                        <span class="sp-desc">${sp.desc}</span>
                    </button>
                `).join('')}
            </div>
            <button class="trib-btn-ghost" id="trib-sub-back">← Voltar</button>
        `, () => {
            document.querySelectorAll('.trib-subprod-card').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.subProduct = btn.dataset.sub;
                    showDataForm();
                });
            });
            document.getElementById('trib-sub-back').addEventListener('click', showProductSelect);
        });
    }

    function showDataForm() {
        setContent(`
            <div class="trib-label">Seus dados</div>
            <h2 class="trib-title">Precisamos de algumas informações</h2>
            <p class="trib-subtitle">Para enviar o diagnóstico personalizado da sua empresa.</p>
            <div class="trib-input-group">
                <div class="trib-input-wrap">
                    <label class="trib-input-label">Nome completo *</label>
                    <input id="trib-nome" class="trib-input" type="text" placeholder="Seu nome completo" autocomplete="name">
                </div>
                <div class="trib-input-wrap">
                    <label class="trib-input-label">Telefone / WhatsApp *</label>
                    <input id="trib-telefone" class="trib-input" type="tel" placeholder="(00) 00000-0000" autocomplete="tel">
                </div>
                <div class="trib-input-wrap">
                    <label class="trib-input-label">CNPJ da empresa *</label>
                    <input id="trib-cnpj" class="trib-input" type="text" placeholder="00.000.000/0000-00" maxlength="18">
                </div>
            </div>
            <button class="trib-btn" id="trib-data-next" disabled>Continuar →</button>
            <button class="trib-btn-ghost" id="trib-data-back">← Voltar</button>
        `, () => {
            const nome     = document.getElementById('trib-nome');
            const telefone = document.getElementById('trib-telefone');
            const cnpj     = document.getElementById('trib-cnpj');
            const nextBtn  = document.getElementById('trib-data-next');

            function checkFields() {
                nextBtn.disabled = !(nome.value.trim() && telefone.value.trim().length >= 8 && cnpj.value.trim().length >= 14);
            }

            // Máscara CNPJ
            cnpj.addEventListener('input', () => {
                let v = cnpj.value.replace(/\D/g, '').slice(0, 14);
                if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
                else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
                else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
                else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
                cnpj.value = v;
                checkFields();
            });

            // Máscara telefone
            telefone.addEventListener('input', () => {
                let v = telefone.value.replace(/\D/g, '').slice(0, 11);
                if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                telefone.value = v;
                checkFields();
            });

            nome.addEventListener('input', checkFields);

            nextBtn.addEventListener('click', () => {
                state.contact = {
                    nome:     nome.value.trim(),
                    telefone: telefone.value.trim(),
                    cnpj:     cnpj.value.trim(),
                };
                state.step = 0;
                showQuestion();
            });

            document.getElementById('trib-data-back').addEventListener('click', () => {
                state.product === 'inss' ? showSubProductSelect() : showProductSelect();
            });
        });
    }

    function showQuestion() {
        const product   = PRODUCTS[state.product];
        const questions = product.questions;
        const q         = questions[state.step];
        const total     = questions.length;
        const current   = state.step;
        const isSingleCol = q.options.length <= 2;

        setContent(`
            ${buildProgressBar(total, current)}
            <div class="trib-label">${product.label} · Pergunta ${current + 1} de ${total}</div>
            <h2 class="trib-title">${q.text}</h2>
            ${q.subtitle ? `<p class="trib-subtitle">${q.subtitle}</p>` : '<p class="trib-subtitle">Toque em uma opção para continuar.</p>'}
            <div class="trib-options ${isSingleCol ? 'single-col' : ''}" id="trib-opts">
                ${q.options.map(o => `
                    <button class="trib-option" data-value="${o.value}">${o.label}</button>
                `).join('')}
            </div>
            ${current > 0 ? `<button class="trib-btn-ghost" id="trib-back">← Voltar</button>` : `<button class="trib-btn-ghost" id="trib-back">← Voltar</button>`}
        `, () => {
            document.querySelectorAll('.trib-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.value;

                    if (q.disqualify && q.disqualify(val)) {
                        state.answers[q.id] = val;
                        showDisqualified(q.disqualifyMsg);
                        return;
                    }

                    state.answers[q.id] = val;

                    if (state.step < total - 1) {
                        state.step++;
                        showQuestion();
                    } else {
                        showQualified();
                    }
                });
            });

            const backBtn = document.getElementById('trib-back');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    if (state.step === 0) {
                        showDataForm();
                    } else {
                        state.step--;
                        showQuestion();
                    }
                });
            }
        });
    }

    function showQualified() {
        const product   = PRODUCTS[state.product];
        const contact   = state.contact || {};
        const subProd   = INSS_SUBPRODUCTS.find(s => s.id === state.subProduct);

        const lines = [
            `Olá! Fiz a pré-qualificação pelo site e gostaria de saber mais sobre *${product.label}*.`,
            '',
            '*Dados de contato:*',
            `• Nome: *${contact.nome || '-'}*`,
            `• Telefone: *${contact.telefone || '-'}*`,
            `• CNPJ: *${contact.cnpj || '-'}*`,
            '',
            ...(subProd ? [`*Modalidade de interesse:* ${subProd.label}`, ''] : []),
            '*Respostas da pré-qualificação:*',
            ...product.questions.map(q => `• ${q.text.replace('?', '')}: *${state.answers[q.id] || '-'}*`),
        ];
        const msg   = encodeURIComponent(lines.join('\n'));
        const waUrl = `https://wa.me/${WA_NUMBER}?text=${msg}`;

        setContent(`
            <div class="trib-result">
                <div class="trib-result-icon success" style="font-size:32px;">🎯</div>
                <h2>Sua empresa está apta!</h2>
                <p style="margin-bottom:16px;">Sua empresa se enquadra para receber um <strong style="color:#fff;">diagnóstico completo de ${product.label}</strong> — com uma estimativa real de quanto você tem a recuperar.</p>
                <div style="background:rgba(0,153,221,0.1);border:1px solid rgba(0,153,221,0.25);border-radius:12px;padding:14px 16px;margin-bottom:20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#0099dd;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Como funciona</div>
                    <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
                        Fale com nosso especialista agora pelo WhatsApp e em até <strong style="color:#fff;">5 dias úteis</strong> você recebe o diagnóstico com o valor estimado de crédito disponível para sua empresa — sem custo e sem compromisso.
                    </div>
                </div>
                <a href="${waUrl}" target="_blank" rel="noopener" class="trib-btn" style="text-decoration:none;">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Quero meu diagnóstico gratuito
                </a>
                <button class="trib-btn-ghost" id="trib-restart">Analisar outro produto</button>
            </div>
        `, () => {
            document.getElementById('trib-restart').addEventListener('click', showProductSelect);
        });
    }

    function showDisqualified(msg) {
        setContent(`
            <div class="trib-result">
                <div class="trib-result-icon fail">🙁</div>
                <h2>Perfil não se enquadra</h2>
                <p>${msg}</p>
                <button class="trib-btn" id="trib-other-product">Ver outro produto</button>
                <button class="trib-btn-ghost" id="trib-close-disq">Fechar</button>
            </div>
        `, () => {
            document.getElementById('trib-other-product').addEventListener('click', showProductSelect);
            document.getElementById('trib-close-disq').addEventListener('click', closeModal);
        });
    }

    // ── Modal open / close ────────────────────────────────────────────────────

    function openModal(productId) {
        let overlay = getOverlay();
        if (!overlay) buildOverlay();
        overlay = getOverlay();
        if (productId && PRODUCTS[productId]) {
            state = { product: productId, subProduct: null, step: 0, answers: {}, contact: { nome: '', telefone: '', cnpj: '' } };
            if (productId === 'inss') {
                showSubProductSelect();
            } else {
                showDataForm();
            }
        } else {
            showProductSelect();
        }
        requestAnimationFrame(() => overlay.classList.add('open'));
    }

    function closeModal() {
        const overlay = getOverlay();
        if (overlay) overlay.classList.remove('open');
    }

    function buildOverlay() {
        injectStyles();
        const overlay = document.createElement('div');
        overlay.id = 'trib-overlay';
        overlay.innerHTML = `
            <div id="trib-modal">
                <button id="trib-close" aria-label="Fechar">✕</button>
                <div id="trib-body"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
        document.getElementById('trib-close').addEventListener('click', closeModal);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }

    // ── Bind nos CTAs ─────────────────────────────────────────────────────────

    window.openTributosModal = openModal;

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-trib-modal]').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(el.dataset.tribProduct);
            });
        });
    });

})();

# Contexto do Projeto

## Sessao 2026-05-13

### O que foi feito
- Adicionada a metrica "Leads Gerados" no painel de metricas do site em `public/pages/blog-admin.html`.
- O card mostra cliques para abrir a Conta PJ no site.
- A API de analytics agora busca `eventCount` no GA4 para eventos de lead.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-analytics.js`
- `lib/ga4.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-13.md`
- `CHANGELOG.md`

### Estado atual
- O painel exibe cinco cards de KPI: Leads Gerados, Usuarios Totais, Usuarios Ativos, Sessoes e Visualizacoes.
- A metrica de leads considera os eventos GA4 `lead_modal_open` e `conta_pj_lead_click`.
- O build de producao foi executado com sucesso.

### Proximo passo recomendado
- Confirmar no GA4/GTM se o clique especifico da Conta PJ esta sendo enviado como `conta_pj_lead_click`; se nao estiver, criar ou ajustar esse evento no site principal para separar Conta PJ de outros produtos.

## Sessao 2026-05-18

### O que foi feito
- Investigada falha no painel de metricas do site exibindo `invalid_grant` e `account not found` ao autenticar no Google Analytics.
- A API de GA4 passou a traduzir esse erro em mensagem operacional, indicando que a service account configurada em `GA4_CLIENT_EMAIL` nao existe mais ou nao foi encontrada.

### Arquivos modificados
- `lib/ga4.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-18.md`
- `CHANGELOG.md`

### Estado atual
- O build de producao executa com sucesso.
- O problema das metricas nao e de consulta dos relatorios: a falha acontece na autenticacao OAuth/JWT antes de acessar o GA4.
- Para restaurar os dados reais no painel publicado, e necessario atualizar as variaveis `GA4_CLIENT_EMAIL` e `GA4_PRIVATE_KEY` no Vercel com uma service account valida e garantir acesso dessa conta na propriedade GA4.

### Proximo passo recomendado
- Gerar uma nova chave de service account no Google Cloud, adicionar o e-mail dessa service account como usuario/leitor na propriedade GA4 correta e atualizar as variaveis de ambiente no Vercel.

## Sessao 2026-05-25

### O que foi feito
- Refeita a estrutura das telas do painel administrativo do blog para evitar abas com area principal em branco.
- Adicionada a tela "Campanhas" com KPIs, pipeline editorial e foco semanal.
- Renomeada a aba "Newsletter" para "E-mails", alinhando com a nomenclatura usada na interface.
- Ajustado o switch de abas para voltar para "Metricas do site" quando uma aba nao tiver painel correspondente.
- Adicionada renderizacao dinamica das campanhas a partir dos posts existentes.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-core.js`
- `public/assets/js/admin/admin-newsletter.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-25.md`
- `CHANGELOG.md`

### Estado atual
- O admin tem painel visivel para Campanhas, Blog, E-mails, Publicidade, Calendario Editorial, Gerador IA e Metricas.
- A navegacao nao deve mais deixar a tela vazia quando uma aba inexistente ou quebrada for acionada.
- O build de producao foi executado com sucesso.

### Proximo passo recomendado
- Validar visualmente o painel publicado apos deploy, especialmente em desktop largo e telas menores, para confirmar que as abas exibem conteudo acima da dobra.

## Sessao 2026-05-26

### O que foi feito
- Aumentada a largura da coluna lateral de publicacoes na aba Blog do admin.
- A lista de posts passou a usar mais espaco horizontal, com titulos em ate duas linhas e metadados com quebra controlada.
- Adicionado comportamento responsivo para empilhar a lista acima do editor em telas menores.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-26.md`
- `CHANGELOG.md`

### Estado atual
- A barra de publicacoes do admin usa largura responsiva `clamp(340px, 24vw, 420px)`.
- O editor continua ocupando o restante da tela com `min-width: 0`, evitando estouro horizontal.
- O build de producao foi executado com sucesso; permaneceram apenas warnings antigos de `<img>` no blog publico.

### Proximo passo recomendado
- Validar visualmente a aba Blog em desktop e notebook para confirmar se a nova largura esta confortavel para a rotina de edicao.

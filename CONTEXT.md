# CONTEXT.md â€” Estado Atual do Projeto

> Ãšltima atualizaÃ§Ã£o: 2026-04-27
> Atualizado por: IA - Codex

---

## Estado Atual

### O que estÃ¡ funcionando

- [x] Home principal (`public/mb-finance-completo.html`) â€” refatorada com separaÃ§Ã£o total de CSS/JS
- [x] CSS extraÃ­do para `public/assets/css/main.css`
- [x] JS modularizado em `public/assets/js/` (infra / use-cases / ui)
- [x] Imagens organizadas em `public/images/` (incluindo subpastas `premios/` e `icones-premios/`)
- [x] HTMLs secundÃ¡rios organizados em `public/pages/`
- [x] Caminhos atualizados em todos os arquivos apÃ³s reorganizaÃ§Ã£o
- [x] Blog (`/blog`) rodando em Next.js com Upstash Redis em produÃ§Ã£o
- [x] PÃ¡gina `/sobre` rodando em Next.js
- [x] Smooth scroll com Lenis
- [x] Parallax no hero e na seÃ§Ã£o "Como Funciona"
- [x] Carrossel de parceiros (marquee animado)
- [x] Accordion de produtos e FAQ
- [x] Modal de lead com roteamento para WhatsApp
- [x] Modal de parceria
- [x] Menu mobile + dropdown de produtos
- [x] BotÃ£o WhatsApp fixo
- [x] Deploy no Vercel via push para master
- [x] `public/pages/termos-de-uso.html` com texto auxiliar do hero ajustado para branco com 90% de opacidade
- [x] `public/pages/politica-de-privacidade.html` com texto auxiliar do hero ajustado para branco com 90% de opacidade
- [x] SeÃ§Ã£o `Escala` da timeline em `public/pages/sobre.html` com texto e Ã­cone invertidos e checkpoint alinhado ao eixo principal
- [x] Painel Administrativo do Blog (`public/pages/blog-admin.html`) totalmente funcional
- [x] CalendÃ¡rio Editorial Visual para planejamento mensal de posts
- [x] Sistema de Agendamento (campo de Hora + Status Inteligente: Publicado/Agendado/Rascunho)
- [x] MÃ©tricas do Google Analytics 4 integradas por post no painel administrativo
- [x] Gerador de ConteÃºdo IA integrado ao CMS para sugestÃ£o automÃ¡tica de pautas
- [x] Radar Google Trends (Real-time) acoplado ao painel administrativo para anÃ¡lise de nicho
- [x] Portal de Recrutamento padronizado (`https://mbfinance.inhire.app/vagas`) em todo o ecossistema (Next.js + Legado)
- [x] Conformidade LGPD concluÃ­da em todo o site (Banner de cookies + bloqueio de GA4)
- [x] Refinamento do Navbar (Fundo branco no hover e logo dinÃ¢mico)
- [x] **Tipografia do Hero**
  - TÃ­tulo principal alterado para Inter Bold (700) para maior autoridade visual.
- [x] **Layout de Produtos**
  - [x] SeÃ§Ã£o "Nossos Produtos" convertida para grid de duas colunas com cards independentes sÃ³lidos (fundo branco)
- [x] AtualizaÃ§Ã£o de marca: mb negÃ³cios e mb tributos (casing minÃºsculo) em todo o site.
- [x] Deploy para GitHub e Vercel concluÃ­do.

### O que estÃ¡ pendente / incompleto

- [ ] Filtrar posts agendados no Blog (Next.js) â€” atualmente todos aparecem independente da data futura
- [ ] `public/pages/sobre.html` ainda com CSS/JS inline â€” precisa refatorar
- [ ] `public/pages/blog.html` ainda com CSS/JS inline â€” precisa refatorar
- [ ] `public/pages/politica-de-privacidade.html` e `termos-de-uso.html` â€” refatorar
- [ ] NÃºmero de WhatsApp ainda fictÃ­cio â€” substituir pelo nÃºmero real
- [ ] Logos dos bancos parceiros â€” adicionar na seÃ§Ã£o de parceiros
- [ ] Links de redes sociais no rodapÃ© â€” apontar para perfis reais
- [ ] Depoimentos fictÃ­cios â€” substituir por depoimentos reais
- [ ] Depoimentos fictÃ­cios â€” substituir por depoimentos reais

### O que estÃ¡ quebrado / com bug

_(nenhum bug conhecido em produÃ§Ã£o no momento)_

---

## Onde o trabalho parou (Ãºltima sessÃ£o â€” 2026-04-20)

### Painel Administrativo (Blog CMS) - ESTABILIZADO
- **Arquitetura:** Modularizada em 9 arquivos JS em `public/assets/js/admin/`.
- **UI/UX:** Sistema de abas isolado via `.admin-screen` e `#admin-body`. Problemas de sobreposiÃ§Ã£o resolvidos.
- **Menu:** Ordem de prioridade definida (MÃ©tricas > Blog > Newsletter > Publicidade).
- **AutenticaÃ§Ã£o:** Ativa e persistente via `localStorage`.
- **Funcionalidades:** Analytics (GA4), Blog (CRUD), Newsletter (Advanced UI), CalendÃ¡rio Editorial, Gerador IA (Trends).

Arquivos modificados nesta sessÃ£o:
- `public/pages/blog-admin.html`
- `public/pages/termos-de-uso.html`
- `public/mb-finance-completo.html` (VÃ­deo de fundo atualizado para `cidade-sem-avioes.mp4`)
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `docs/sessions/2026-04-20.md`

- [x] ModularizaÃ§Ã£o completa do Painel Administrativo (`public/pages/blog-admin.html`)
- [x] SeparaÃ§Ã£o da lÃ³gica em mÃ³dulos: `state`, `utils`, `blog`, `newsletter`, `calendar`, `analytics`, `ai`, `banners` e `core`.
- [x] Limpeza total de scripts legados e duplicados no dashboard.

PrÃ³ximo passo recomendado: Ajustar o endpoint do Blog no Next.js para respeitar a data/hora e nÃ£o exibir posts agendados (futuros). Outro ponto fundamental Ã© iniciar a refatoraÃ§Ã£o das pÃ¡ginas de polÃ­tica de privacidade e termos de uso para o padrÃ£o modular.


---

## Arquitetura resumida

- **Frontend principal:** HTML estÃ¡tico (`public/mb-finance-completo.html`) com CSS/JS externos em `public/assets/`
- **Framework:** Next.js 14 (App Router) â€” usado para blog e pÃ¡gina sobre
- **Estilo:** Tailwind CSS + custom tokens + `main.css`
- **AnimaÃ§Ãµes:** Lenis (smooth scroll), CSS @keyframes, IntersectionObserver
- **Blog:** Next.js + Upstash Redis (produÃ§Ã£o) / JSON local (dev)
- **Analytics:** Google Analytics 4
- **Deploy:** Vercel (push para master = deploy automÃ¡tico)
- **CaptaÃ§Ã£o de leads:** Modal â†’ WhatsApp (principal) + Google Sheets (backup)

---

## Branch e commits recentes

- Branch principal: `master`
- Ãšltimo conjunto de commits: ajustes visuais nas pÃ¡ginas legais e na timeline do `sobre`
- Rollback disponÃ­vel via Vercel dashboard ou `git revert`

---

## Atualizacao de sessao - 2026-04-27

### Meta Pixel na home principal
- Inserido o snippet oficial do Meta Pixel no `<head>` de `public/mb-finance-completo.html`.
- Pixel configurado com `fbq('init', '1303767088303655')` e evento `PageView`.
- Nao houve alteracao de layout, CSS ou fluxos de CTA.

Arquivos modificados nesta sessao:
- `public/mb-finance-completo.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-04-27.md`

Estado atual: home principal com Meta Pixel instalado e pronta para deploy.

Onde o trabalho parou: aguardando validacao em producao apos deploy.

Proximo passo recomendado: validar o disparo do `PageView` no Meta Pixel Helper ou no Gerenciador de Eventos da Meta.

---

## Atualizacao de sessao - 2026-04-27 - Pixel global

### Meta Pixel em paginas publicas
- Criado `public/assets/js/infra/meta-pixel.js` para centralizar o Pixel em HTMLs estaticos.
- Criado `components/MetaPixel.tsx` para reutilizar o Pixel nas rotas Next.js publicas.
- Aplicado o Pixel na home, paginas secundarias publicas, artigos legados, blog e pagina sobre.
- `public/pages/blog-admin.html` ficou fora do rastreamento para evitar dados administrativos em campanhas.

Arquivos principais modificados nesta etapa:
- `public/assets/js/infra/meta-pixel.js`
- `components/MetaPixel.tsx`
- `public/mb-finance-completo.html`
- `public/pages/*.html` publicos, exceto `blog-admin.html`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/sobre/page.tsx`

Estado atual: Pixel unico `1303767088303655` instalado nas paginas publicas relevantes.

Validacao: `npm run build` executado com sucesso; restaram apenas avisos preexistentes de lint/performance.

Proximo passo recomendado: apos deploy, conferir uma pagina HTML secundaria e uma rota Next.js (`/blog` ou `/sobre`) no Meta Pixel Helper.

---

## Atualizacao de sessao - 2026-04-27 - Google Ads tag

- Criado `public/assets/js/infra/google-ads-tag.js` para centralizar a Google tag nos HTMLs estaticos.
- Criado `components/GoogleAdsTag.tsx` para reutilizar a tag nas rotas Next.js publicas.
- Aplicada a Google tag `AW-18112641661` na home, paginas secundarias publicas, artigos legados, blog e pagina sobre.
- `public/pages/blog-admin.html` ficou fora do rastreamento para evitar dados administrativos em campanhas.

Estado atual: Google Ads tag `AW-18112641661` instalada nas paginas publicas relevantes.

Validacao: `npm run build` executado com sucesso; restaram apenas avisos preexistentes de lint/performance.

Proximo passo recomendado: apos deploy, validar a tag pelo Tag Assistant do Google em uma pagina HTML secundaria e uma rota Next.js (`/blog` ou `/sobre`).

---

## Atualizacao de sessao - 2026-04-27 - CSP Google Ads

- Ajustada a `Content-Security-Policy` em `vercel.json` para permitir os dominios necessarios da Google tag e Google Ads.
- Dominios liberados incluem `googletagmanager.com`, `google-analytics.com`, `googleadservices.com`, `doubleclick.net`, `google.com` e `google.com.br` nas diretivas adequadas.
- Motivo: o Tag Assistant indicou bloqueio de CSP, apesar de encontrar a tag `AW-18112641661`.

Estado atual: CSP pronta para permitir carregamento, conexoes e frames necessarios do Google Ads/Tag Assistant.

Validacao: `vercel.json` validado como JSON e `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, recarregar o site com Ctrl+Shift+R e validar novamente no Tag Assistant.

---

## Atualizacao de sessao - 2026-04-27 - CSP Meta Pixel

- Corrigida a `Content-Security-Policy` em `vercel.json` para permitir o Meta Pixel apos o ajuste da CSP do Google Ads.
- Dominios liberados: `connect.facebook.net` em `script-src` e `connect-src`, e `www.facebook.com` em `connect-src`.
- Motivo: o Meta Pixel Helper deixou de encontrar o pixel porque o navegador passou a bloquear o carregamento de `https://connect.facebook.net/en_US/fbevents.js`.

Estado atual: CSP contempla Google Ads/Tag Assistant e Meta Pixel.

Validacao: `vercel.json` validado como JSON e `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, recarregar a home com Ctrl+Shift+R e validar no Meta Pixel Helper.

---

## Atualizacao de sessao - 2026-04-27 - Meta Pixel inline na home

- A home (`public/mb-finance-completo.html`) voltou a usar o snippet oficial inline do Meta Pixel no `<head>`.
- O arquivo central `public/assets/js/infra/meta-pixel.js` permanece para as demais paginas publicas HTML.
- Motivo: o Meta Pixel Helper continuou sem detectar o pixel na home no navegador do dono, mesmo com CSP corrigida e arquivo central publicado.

Estado atual: home com snippet oficial inline e sem duplicidade de `fbq('init')`.

Validacao: contagem de `fbq('init', '1303767088303655')` na home = 1; `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, recarregar com Ctrl+Shift+R e validar novamente no Meta Pixel Helper.

---

## Atualizacao de sessao - 2026-04-27 - Meta Pixel inline no blog legado

- A pagina legada do blog (`public/pages/blog.html`) voltou a usar o snippet oficial inline do Meta Pixel no `<head>`.
- Motivo: o Meta Pixel Helper nao detectou o Pixel nessa pagina quando ela usava o arquivo central `public/assets/js/infra/meta-pixel.js`.
- A pagina continua com a Google Ads tag externa `../assets/js/infra/google-ads-tag.js`.

Arquivos modificados nesta etapa:
- `public/pages/blog.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-04-27.md`

Estado atual: blog legado com snippet oficial inline e sem duplicidade de `fbq('init')`.

Validacao: `public/pages/blog.html` possui exatamente um `fbq('init', '1303767088303655')`; `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, recarregar `https://mbfinance-sites.vercel.app/pages/blog.html` com Ctrl+Shift+R e validar no Meta Pixel Helper.

---

## Atualizacao de sessao - 2026-04-27 - Tags na raiz do site

- A rota raiz (`/`) deixou de usar `redirect()` server-side puro para `/mb-finance-completo.html`.
- Criada uma pagina ponte em `app/page.tsx` que carrega `GoogleAdsTag` e `MetaPixel` antes de redirecionar o visitante para a home HTML.
- Motivo: o resumo de cobertura do Google Tag mostrava `mbfinance-sites.vercel.app/` como "Sem tag", mesmo com `/mb-finance-completo.html` marcado como "Com tag".

Arquivos modificados nesta etapa:
- `app/page.tsx`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-04-27.md`

Estado atual: raiz publica preparada para carregar as tags antes do redirecionamento automatico.

Validacao: `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, validar `https://mbfinance-sites.vercel.app/` no Tag Assistant e aguardar a cobertura atualizar.

---

## Atualizacao de sessao - 2026-04-27 - Google Tag Manager

- Instalado o Google Tag Manager `GTM-MDST4NTK`.
- Nos HTMLs publicos, o script foi inserido no topo do `<head>` e o `noscript` logo apos a abertura do `<body>`.
- No Next.js, o GTM foi adicionado ao `app/layout.tsx`, cobrindo as rotas renderizadas pelo App Router.
- `public/pages/blog-admin.html` permaneceu sem GTM para evitar rastreamento do painel administrativo legado.

Arquivos modificados nesta etapa:
- `app/layout.tsx`
- `public/mb-finance-completo.html`
- `public/pages/*.html` publicos, exceto `blog-admin.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-04-27.md`

Estado atual: GTM instalado no site publico com container `GTM-MDST4NTK`.

Validacao: 13 HTMLs publicos contem `GTM-MDST4NTK`; `public/pages/blog-admin.html` nao contem GTM; `npm run build` executado com sucesso.

Proximo passo recomendado: apos deploy, validar no Tag Assistant se o container `GTM-MDST4NTK` aparece na home, no blog e em uma pagina secundaria.
---

## Atualizacao de sessao - 2026-05-05 - Blog em subdominio Vercel

- Criada a pasta `blog-pages/` como projeto Next.js independente para deploy do blog na Vercel.
- A nova base do blog inclui rotas `/blog`, `/blog/[slug]`, `/admin`, APIs do blog/newsletter/analytics, `content/blog-posts.json`, componentes necessarios, sitemap e robots proprios.
- Configurado o dominio canonico do blog como `https://blog.mbfinance.com.br` via `blog-pages/lib/site.ts`.
- A raiz do projeto do blog (`/`) redireciona para `/blog`.
- Adicionados redirects na Vercel do blog para URLs legadas como `/blog.html`, `/pages/blog.html`, `/blog-admin.html` e artigos antigos.
- O `public/pages/blog.html` do site estatico virou uma pagina leve de redirecionamento para `https://blog.mbfinance.com.br/blog`, com `noindex, follow`.
- Links de BLOG na home e paginas estaticas principais foram atualizados para `https://blog.mbfinance.com.br/blog`.
- O sitemap principal removeu a URL antiga `/blog`; o blog separado agora gera seu proprio `https://blog.mbfinance.com.br/sitemap.xml`.
- A rota `/admin` do projeto separado agora redireciona para `public/pages/blog-admin.html`, usando a versao atual do painel administrativo HTML modular.
- Copiados para `blog-pages/public/` os arquivos `pages/blog-admin.html`, `tailwind.min.css` e `assets/js/admin/*.js`.

Arquivos/pastas principais criados ou modificados:
- `blog-pages/`
- `public/pages/blog.html`
- `public/mb-finance-completo.html`
- `public/pages/sobre.html`
- `public/pages/capital-de-giro.html`
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-blog.js`
- `public/sitemap.xml`
- `blog-pages/public/pages/blog-admin.html`
- `blog-pages/public/assets/js/admin/*.js`
- `blog-pages/public/tailwind.min.css`
- `blog-pages/next.config.mjs`

Estado atual: pasta `blog-pages/` pronta para ser conectada na Vercel como projeto separado do blog.

Validacao: `next build` executado dentro de `blog-pages/` com sucesso usando as dependencias locais; restaram apenas avisos preexistentes de uso de `<img>`.

Onde o trabalho parou: falta configurar na Vercel o projeto apontando para `blog-pages/`, adicionar as variaveis de ambiente e conectar o dominio `blog.mbfinance.com.br`.

Proximo passo recomendado: na Vercel, criar/importar o projeto usando a pasta `blog-pages/`, configurar `blog.mbfinance.com.br`, apontar o DNS do subdominio e cadastrar `https://blog.mbfinance.com.br/sitemap.xml` no Google Search Console.

### Ajuste complementar - pagina publica do blog

- Substituida a listagem antiga em React do `/blog` por `blog-pages/components/BlogIndexClient.tsx`, reproduzindo a versao visual atual do blog: hero grande, busca, filtros por categoria, banner de contagem, destaque, cards recentes, newsletter e rodape completo.
- `blog-pages/app/blog/page.tsx` agora busca posts publicados e entrega a renderizacao para o componente client, mantendo filtros e busca funcionando no navegador.
- Validacao: `next build` em `blog-pages/` executado com sucesso; restaram apenas avisos nao bloqueantes de uso de `<img>`.

### Ajuste complementar - encoding do admin

- Corrigido mojibake no painel administrativo atual (`blog-admin.html`) em `blog-pages/public/pages/` e no arquivo fonte em `public/pages/`.
- Textos como "MÃ©tricas do site", "CalendÃ¡rio Editorial", "TrÃ¡fego diÃ¡rio", "PÃ¡ginas mais acessadas", "PaÃ­ses", "GÃªnero", "Faixa etÃ¡ria" e "DistribuiÃ§Ã£o por categoria" voltaram a aparecer com acentuaÃ§Ã£o correta.
- Validacao: busca por padrÃµes `Ãƒ`, `Ã‚`, `ï¿½`, `vocÂª` e `Å“` nao encontrou residuos no HTML do admin; `next build` em `blog-pages/` executado com sucesso.

### Ajuste complementar - Supabase

- `blog-pages/lib/blog-store.ts` passou a usar Supabase Postgres quando `SUPABASE_URL` e `SUPABASE_ANON_KEY` estiverem configuradas.
- Escritas administrativas usam `SUPABASE_SERVICE_ROLE_KEY` quando configurada, mantendo a anon key sem permissao de escrita via RLS.
- Criados `blog-pages/supabase-blog.sql` e `blog-pages/SUPABASE.md` com tabela `blog_posts`, indices, trigger de `updated_at`, RLS e instrucoes de variaveis na Vercel.
- `blog-pages/.env.example` foi atualizado com `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
- Validacao: `next build` em `blog-pages/` executado com sucesso.

### Ajuste complementar - conexao Supabase local

- `blog-pages/lib/blog-store.ts` agora considera o Supabase configurado quando existe `SUPABASE_URL` e pelo menos uma chave (`SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_ANON_KEY`).
- `blog-pages/app/api/blog/sync/route.ts` deixou de depender diretamente do Upstash Redis e passou a usar `readBlogPosts`/`writeBlogPosts`, gravando no Supabase quando as variaveis estiverem configuradas.
- Verificado que `blog-pages/.env.local` carrega `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
- O SQL `blog-pages/supabase-blog.sql` foi executado no Supabase e a tabela `public.blog_posts` passou a responder via REST com status `200`.
- Os 5 posts iniciais de `blog-pages/content/blog-posts.json` foram enviados para `public.blog_posts`.
- Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>`.

Estado atual: codigo conectado ao Supabase via REST server-side, tabela criada e posts iniciais gravados no banco.

Onde o trabalho parou: falta cadastrar as mesmas variaveis no projeto da Vercel quando o deploy do blog for criado/importado.

Proximo passo recomendado: configurar as variaveis de ambiente na Vercel e validar publicacao pelo painel `/admin`.

### Ajuste complementar - pasta sem espaco para Vercel

- Criada a pasta `blog-pages/` como copia do projeto do blog para evitar erro de build da Vercel com nomes de serverless functions contendo espaco.
- Motivo: a Vercel falhou com `A Serverless Function has an invalid name: "Blog pages/___next_launcher.cjs"` porque o caminho `Blog pages` continha espaco.
- Validacao: `npm run build` executado em `blog-pages/` com sucesso.

Estado atual: a Vercel deve apontar o Root Directory para `blog-pages`.

Proximo passo recomendado: publicar a pasta `blog-pages/` no GitHub, ajustar o Root Directory do projeto na Vercel para `blog-pages` e fazer novo redeploy.

### Ajuste complementar - admin usa API do proprio dominio

- Corrigido `blog-pages/public/assets/js/admin/admin-blog.js` para usar `window.location.origin` como base padrao da API quando nenhuma URL foi configurada no localStorage.
- Motivo: em producao o painel abria como "Somente local" e nao carregava os posts do Supabase ate o usuario clicar em "Configurar API".
- Validacao: `npm run build` em `blog-pages/` executado com sucesso.

Estado atual: ao abrir `https://blog.mbfinance.com.br/admin`, o painel deve buscar automaticamente `https://blog.mbfinance.com.br/api/blog/posts`.

### Ajuste complementar - publicacao pelo admin

- Corrigido `blog-pages/public/assets/js/admin/admin-blog.js` para carregar posts usando o token admin no GET e para nao mostrar sucesso quando a sincronizacao com a API falhar.
- `syncOfficialBlog` agora le a resposta de erro da API quando o PUT falha e mantem o status visual em alerta.
- `blog-pages/app/api/blog/posts/route.ts` agora retorna erro JSON quando a escrita no storage falha.
- Validacao: `npm run build` em `blog-pages/` executado com sucesso.

Estado atual: ao salvar um post no painel, a publicacao oficial precisa retornar sucesso antes de mostrar "Post salvo e publicado".

---

## Atualizacao de sessao - 2026-05-06 - Link do Blog no menu

- Atualizado `public/pages/credito-rapido.html` para apontar os links de Blog do menu desktop, menu mobile e rodape para `https://blog.mbfinance.com.br/blog`.
- A home principal (`public/mb-finance-completo.html`) ja estava com o link correto no menu desktop e mobile.

Arquivos modificados nesta sessao:
- `public/pages/credito-rapido.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-06.md`

Estado atual: links publicos de Blog no site estatico validado apontam para o subdominio oficial.

Onde o trabalho parou: alteracao pronta para deploy.

Proximo passo recomendado: apos deploy, testar o clique no Blog na pagina de Credito Rapido em desktop e mobile.

### Ajuste complementar - BLOG do menu principal

- Adicionado `id="nav-nav-blog"` ao link BLOG da home principal em `public/mb-finance-completo.html` para identificar o botao mostrado no menu desktop.
- Adicionado o item `BLOG` em `components/Navbar.tsx` apontando diretamente para `https://blog.mbfinance.com.br/blog`, cobrindo tambem a navbar React caso ela seja usada em alguma rota publica.

Estado atual: o botao BLOG do menu principal e a navbar React apontam explicitamente para `https://blog.mbfinance.com.br/blog`.

Proximo passo recomendado: apos novo deploy, testar o botao BLOG da home com cache limpo.


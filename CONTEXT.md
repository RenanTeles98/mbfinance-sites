# CONTEXT.md â€” Estado Atual do Projeto

> Ãšltima atualizaÃ§Ã£o: 2026-04-27
> Atualizado por: IA - Codex

---

## Estado Atual

### Sessao 2026-05-14 - Periodos das metricas GA4

- [x] Corrigida a API `blog-pages/app/api/analytics/overview/route.ts` para repassar `startDate` e `endDate` enviados pelo painel.
- [x] Corrigido `blog-pages/lib/ga4.ts` para aplicar o periodo selecionado em todas as consultas GA4 do resumo, leads, tendencias, paginas, regioes, demografia, canais e eventos.
- [x] O selo do painel passa a receber `rangeLabel` calculado pelo backend, como `Hoje`, `Ontem`, `Ultimos 7 dias` ou `Ultimos 30 dias`.
- [x] Periodo anterior de comparacao agora e calculado a partir do periodo selecionado, em vez de ficar fixo em 60-31 dias atras.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: validar em producao que os endpoints com `startDate`/`endDate` diferentes retornam `rangeLabel` e metricas diferentes para MB Negocios.

### Sessao 2026-05-14 - Contagem de eventos GA4

- [x] Adicionada a metrica `eventCount` ao resumo GA4 em `blog-pages/lib/ga4.ts`.
- [x] O card antes chamado "Visualizacoes" passou a exibir "Contagem de eventos", alinhado com a tela padrao do GA4.
- [x] Visualizacoes de pagina continuam disponiveis nos indicadores de trafego e no ranking de paginas.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: validar em producao o periodo personalizado 2026-05-11 ate 2026-05-11 para confirmar `Usuarios ativos = 38` e `Contagem de eventos = 254`.

### Sessao 2026-05-14 - Cards maiores no funil GA4

- [x] Aumentado o tamanho visual dos cards de metricas do painel em `blog-pages/public/pages/blog-admin.html`.
- [x] Grade alterada para cards com largura minima maior, mais espacamento, padding maior e numeros mais legiveis.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: publicar e conferir o painel em desktop para validar se a proporcao ficou confortavel.

### Sessao 2026-05-14 - Origem / midia / campanha UTM

- [x] Substituido o painel "Origem do trafego" por "Origem / midia / campanha UTM".
- [x] `blog-pages/lib/ga4.ts` agora consulta `sessionSource`, `sessionMedium`, `sessionCampaignName` e `sessionDefaultChannelGroup`.
- [x] O painel exibe origem, midia, campanha, canal, sessoes, usuarios e eventos.
- [x] Trafego direto e Google passam a aparecer como origem/midia dentro do mesmo card.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: validar em producao que o card lista Google, direto, parceiros, WhatsApp, SMS e UTMs quando houver dados no GA4.

### Sessao 2026-05-14 - Metricas estrategicas GA4

- [x] Adicionados relatórios GA4 para canal com mais leads, taxa de conversao por canal, conversao por campanha UTM, qualidade do trafego, dispositivos e landing pages.
- [x] `blog-pages/lib/ga4.ts` passou a retornar `channelConversions`, `campaignConversions`, `deviceBreakdown`, `landingPages`, `userTypes`, `pagesPerSession` e `funnelConversionRate`.
- [x] `blog-pages/public/assets/js/admin/admin-analytics.js` ganhou renderizadores para tabelas estrategicas e qualidade do trafego.
- [x] `blog-pages/public/pages/blog-admin.html` recebeu novos paineis na pagina de metricas do site.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: publicar e validar em producao a resposta da API com os novos arrays estrategicos.

### Sessao 2026-05-14 - Remocao de painel redundante

- [x] Removido o painel visivel "Indicadores de trafego" da pagina de metricas do site.
- [x] Mantido um elemento tecnico oculto `ga-highlights` para preservar compatibilidade com o JavaScript legado durante carregamento.
- [x] Build local do `blog-pages` validado com `npm run build`.

Proximo passo recomendado: publicar e validar visualmente que a pagina ficou menos repetitiva.

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

---

## Atualizacao de sessao - 2026-05-07 - Google Analytics do dominio real

- Atualizado o Measurement ID do Google Analytics 4 de `G-16ZB759EFL` para `G-3C1G7JNB9L`, vinculado ao dominio real `mbfinance.com.br`.
- A troca foi aplicada nas paginas publicas HTML que tinham snippet direto de GA4, nas paginas que definem `window._ga4_id` e nos carregadores de consentimento LGPD.
- O carregamento via `public/assets/js/ui/cookie-banner.js` e `public/assets/js/bundle.js` continua respeitando o consentimento de cookies antes de injetar o `gtag`.
- Google Ads `AW-18112641661` e GTM `GTM-MDST4NTK` nao foram alterados.

Arquivos principais modificados nesta sessao:
- `public/index.html`
- `public/assets/js/ui/cookie-banner.js`
- `public/assets/js/bundle.js`
- `public/pages/*.html` com GA4
- `public/pages/artigos do blog/*.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-07.md`

Estado atual: nao ha mais ocorrencias de `G-16ZB759EFL` nos arquivos publicos de execucao; o novo ID `G-3C1G7JNB9L` esta presente nos pontos publicos de GA4.

Onde o trabalho parou: alteracao pronta para validacao em producao apos deploy/publicacao.

Proximo passo recomendado: apos publicar, aceitar cookies em uma aba anonima e validar no Tag Assistant ou DebugView do GA4 se `G-3C1G7JNB9L` dispara em `mbfinance.com.br`.


---

## Atualizacao de sessao - 2026-05-12 - Tags centralizadas no Google Tag Manager

- Removidos os snippets diretos de Meta Pixel, Google Analytics 4 e Google Ads dos HTMLs publicos, rotas Next.js e projeto separado do blog.
- Mantido o Google Tag Manager `GTM-MDST4NTK` como unico codigo de marketing carregado diretamente no site.
- Removidos os componentes `GoogleAdsTag` e `MetaPixel` da raiz e de `blog-pages/`, alem dos arquivos legados `public/assets/js/infra/google-ads-tag.js` e `public/assets/js/infra/meta-pixel.js`.
- `public/assets/js/ui/cookie-banner.js` e o bloco equivalente em `public/assets/js/bundle.js` deixaram de carregar GA4 diretamente e agora apenas registram consentimento e enviam `cookie_consent_update` para o `dataLayer`.
- Os eventos customizados em `public/assets/js/analytics-events.js` continuam enviando dados para `dataLayer`, para serem consumidos pelo GTM.

Arquivos principais modificados nesta sessao:
- `public/index.html`
- `public/pages/*.html` publicos e artigos legados
- `public/assets/js/ui/cookie-banner.js`
- `public/assets/js/bundle.js`
- `app/page.tsx`, `app/blog/*`, `app/sobre/page.tsx`
- `blog-pages/app/blog/*`
- Removidos: `components/GoogleAdsTag.tsx`, `components/MetaPixel.tsx`, `blog-pages/components/GoogleAdsTag.tsx`, `blog-pages/components/MetaPixel.tsx`, `public/assets/js/infra/google-ads-tag.js`, `public/assets/js/infra/meta-pixel.js`

Estado atual: codigo fonte publico carrega apenas o GTM como tag de marketing direta; GA4, Ads e Meta Pixel devem ser configurados dentro do container.

Validacao: `npm run build` na raiz e em `blog-pages/` executaram com sucesso; permaneceram apenas avisos preexistentes de `<img>`/hook.

Onde o trabalho parou: mudanca pronta para deploy e configuracao das tags dentro do Google Tag Manager.

Proximo passo recomendado: criar/publicar no GTM as tags GA4, Google Ads e Meta Pixel, usando os eventos de `dataLayer` ja enviados pelo site.

---

## Atualizacao de sessao - 2026-05-13 - GTM imediato na home

- Verificado que `public/pages/sobre.html` e o HTML publicado em `https://mbfinance.com.br/pages/sobre.html` ja possuem o Google Tag Manager `GTM-MDST4NTK` no `<head>` e o `noscript` logo apos a abertura do `<body>`.
- Identificado que a home (`public/index.html`) carregava o GTM com lazy load apos interacao do usuario ou timeout de 8 segundos, o que podia atrapalhar a deteccao no Tag Assistant.
- Alterado `public/index.html` para usar o snippet oficial imediato do GTM, alinhado ao padrao usado em `public/pages/sobre.html`.
- Mantida a decisao de nao recolocar Meta Pixel, GA4 ou Google Ads diretamente no codigo fonte; essas tags devem continuar dentro do container GTM.

Arquivos modificados nesta sessao:
- `public/index.html`
- `cpanel-upload/public_html/index.html`
- `cpanel-upload/mbfinance-cpanel-public_html.zip`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-13.md`

Estado atual: Sobre ja estava com GTM no fonte e em producao; home agora tambem carrega o GTM imediatamente no fonte e na copia de upload do Cpanel.

Validacao: `npm run build` executado com sucesso; restaram apenas avisos preexistentes de `<img>` e dependencia de hook.

Onde o trabalho parou: alteracao pronta para publicacao no Cpanel/GitHub conforme fluxo atual; o ZIP do Cpanel foi regenerado.

Proximo passo recomendado: apos publicar `public/index.html`, recarregar com Ctrl+Shift+R e validar no Tag Assistant em `https://mbfinance.com.br/index.html` e `https://mbfinance.com.br/pages/sobre.html`.

---

## Atualizacao de sessao - 2026-05-13 - Leads Conta PJ no blog admin

- Confirmado que o projeto Vercel `blog-mbfinace` usa `blog-pages/` como Root Directory.
- Adicionada a metrica "Leads Gerados" no painel administrativo publicado em `blog-pages/public/pages/blog-admin.html`.
- `blog-pages/lib/ga4.ts` passou a consultar `eventCount` para os eventos `conta_pj_lead_click` e `lead_modal_open`, respeitando o site e o intervalo selecionados no painel.
- `blog-pages/public/assets/js/admin/admin-analytics.js` agora preenche o novo card e inclui o indicador em "Indicadores de trafego".

Arquivos modificados nesta etapa:
- `blog-pages/lib/ga4.ts`
- `blog-pages/public/assets/js/admin/admin-analytics.js`
- `blog-pages/public/pages/blog-admin.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-13-leads-conta-pj.md`

Estado atual: metrica pronta para deploy no projeto correto do blog (`blog-mbfinace`).

Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>`.

Proximo passo recomendado: apos deploy, validar o card em `https://blog.mbfinance.com.br/admin` e confirmar no GTM/GA4 se o evento especifico `conta_pj_lead_click` esta publicado.

---

## Atualizacao de sessao - 2026-05-13 - Demografia GA4 no blog admin

- Ajustada a busca de genero e faixa etaria no painel administrativo do blog.
- `blog-pages/lib/ga4.ts` agora tenta o periodo selecionado e, se nao houver linhas, tenta automaticamente janelas de 90 e 365 dias para dados demograficos.
- A consulta demografica ficou isolada para nao derrubar o restante do painel caso o GA4 oculte esses dados por privacidade ou configuracao.
- `blog-pages/public/assets/js/admin/admin-analytics.js` agora exibe uma mensagem mais clara quando o GA4 ainda nao libera dados demograficos.

Estado atual: o painel tenta maximizar a chance de trazer genero/faixa etaria; se continuar vazio, a causa fica do lado de configuracao/limite de privacidade do GA4.

Validacao: `npm run build` em `blog-pages/` executado com sucesso.

Proximo passo recomendado: verificar no GA4 se "Dados fornecidos pelo Google"/Google Signals e coleta de dados demograficos estao ativados para a propriedade do site.

---

## Atualizacao de sessao - 2026-05-13 - Textos do painel administrativo em pt-BR

- Revisados os textos visiveis da ferramenta administrativa do blog em `blog-pages/`.
- Termos em ingles no painel foram substituidos por pt-BR: "Preview", "Views", "Property", "Status", "Post", "Newsletter" e rotulos de anuncios.
- Corrigida acentuacao em mensagens de analytics, demografia, trafego, publicacao e interface de blog.
- Mantidos nomes tecnicos de codigo, IDs, classes e eventos externos quando sao necessarios para funcionamento.

Arquivos modificados nesta etapa:
- `blog-pages/public/pages/blog-admin.html`
- `blog-pages/public/assets/js/admin/admin-analytics.js`
- `blog-pages/public/assets/js/admin/admin-blog.js`
- `blog-pages/public/assets/js/admin/admin-ai.js`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-13-traducao-painel-admin.md`

Estado atual: painel administrativo com textos principais normalizados em portugues brasileiro.

Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>` do Next.js.

---

## Atualizacao de sessao - 2026-05-14 - Configuracao GA4 por site

- Investigado o motivo do seletor exibir "MB Negocios (configurar GA4)".
- Confirmado que o painel marcava sites secundarios como nao configurados porque a API ainda usava apenas o GA4 principal (`GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, `GA4_PRIVATE_KEY`).
- `blog-pages/lib/ga4.ts` passou a resolver configuracao por site (`mb-finance`, `mb-negocios`, `fomenta`) e retornar a lista `sites` com status real de configuracao.
- `blog-pages/app/api/analytics/overview/route.ts` agora aceita `?site=...`.
- `blog-pages/app/api/analytics/campaigns/route.ts` tambem respeita `?site=...`.
- `blog-pages/.env.example` foi documentado para permitir MB Negocios/Fomenta usando apenas o `PROPERTY_ID` quando a service account principal ja tiver acesso.

Arquivos modificados nesta etapa:
- `blog-pages/lib/ga4.ts`
- `blog-pages/app/api/analytics/overview/route.ts`
- `blog-pages/app/api/analytics/campaigns/route.ts`
- `blog-pages/.env.example`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-14-ga4-sites.md`

Estado atual: codigo pronto para GA4 multi-site; para MB Negocios sair de "configurar GA4", falta preencher a variavel `GA4_MB_NEGOCIOS_PROPERTY_ID` no Vercel e garantir acesso da service account na propriedade GA4 correspondente.

Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>` do Next.js.

---

## Atualizacao de sessao - 2026-05-14 - Property ID do MB Negocios

- Recebido o ID de propriedade GA4 do MB Negocios: `536401937`.
- Recebido o Measurement ID do MB Negocios: `G-XS7HTFJKD6`.
- Como a CLI da Vercel nao esta autenticada nesta maquina, nao foi possivel gravar a variavel diretamente pelo terminal.
- `blog-pages/lib/ga4.ts` passou a usar `536401937` como fallback para `GA4_MB_NEGOCIOS_PROPERTY_ID`.
- `blog-pages/.env.example` foi atualizado com o Property ID e referencia do Measurement ID para configuracao de tag/GTM.

Estado atual: apos deploy, o painel tentara consultar MB Negocios na propriedade GA4 `536401937` usando a service account principal. Se essa service account tiver acesso de leitura nessa propriedade, o aviso "configurar GA4" deve desaparecer.

Validacao: `npm run build` em `blog-pages/` executado com sucesso.

Proximo passo recomendado: validar visualmente `https://blog.mbfinance.com.br/admin` apos publicacao para encontrar qualquer texto residual carregado por dados externos.

---

## Atualizacao de sessao - 2026-05-13 - Origem do trafego em pt-BR

- Corrigidos os nomes dos canais de origem do trafego que vinham do GA4 em ingles.
- `blog-pages/public/assets/js/admin/admin-analytics.js` agora traduz canais como Direct, Referral, Organic Social, Organic Search, Unassigned, Cross-network e Paid Search.
- Adicionado icone "i" ao componente "Origem do trafego" em `blog-pages/public/pages/blog-admin.html`, com explicacao acessivel via `aria-label` e `title`.

Arquivos modificados nesta etapa:
- `blog-pages/public/pages/blog-admin.html`
- `blog-pages/public/assets/js/admin/admin-analytics.js`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-13-origem-trafego-admin.md`

Estado atual: o card de origem do trafego mostra rotulos em pt-BR e possui ajuda contextual.

Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>` do Next.js.

Proximo passo recomendado: validar visualmente no admin publicado se todos os canais retornados pelo GA4 estao cobertos pelo mapa de traducao.

---

## Atualizacao de sessao - 2026-05-13 - Ajuda por canal de trafego

- Ajustado o icone "i" do componente "Origem do trafego" para aparecer ao lado de cada canal, e nao mais no titulo geral.
- Cada canal agora possui uma explicacao propria: Direto, Referencia, Social organico, Busca organica, Nao classificado, Rede cruzada, Busca paga, Social pago, Display e E-mail.
- Mantida a traducao dos nomes retornados pelo GA4 na camada de apresentacao.

Arquivos modificados nesta etapa:
- `blog-pages/public/pages/blog-admin.html`
- `blog-pages/public/assets/js/admin/admin-analytics.js`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-13-ajuda-canais-trafego.md`

Estado atual: cada origem de trafego renderizada no painel tem seu proprio icone de informacao contextual.

Validacao: `npm run build` em `blog-pages/` executado com sucesso; restaram apenas avisos preexistentes de `<img>` do Next.js.

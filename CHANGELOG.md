# CHANGELOG.md â€” HistÃ³rico de MudanÃ§as

> Formato: [versÃ£o ou data] â€” O que mudou

---

## 2026-04-27 - Meta Pixel

### Adicionado
- Meta Pixel no `<head>` de `public/mb-finance-completo.html` com ID `1303767088303655` e evento `PageView`.

---

## 2026-04-14 â€” RefatoraÃ§Ã£o estrutural + organizaÃ§Ã£o

### Adicionado
- `public/assets/css/main.css` â€” todo o CSS extraÃ­do do HTML principal (614 linhas)
- `public/assets/js/infra/sheets.js` â€” integraÃ§Ã£o com Google Sheets
- `public/assets/js/infra/storage.js` â€” backup em localStorage
- `public/assets/js/ui/scroll.js` â€” smooth scroll + Lenis
- `public/assets/js/ui/navbar.js` â€” navbar scroll effect, menu mobile, dropdown
- `public/assets/js/ui/accordion.js` â€” accordion de produtos + FAQ
- `public/assets/js/ui/animations.js` â€” parallax, etapas animadas, carrossel
- `public/assets/js/use-cases/lead.js` â€” modal de lead + roteamento WhatsApp
- `public/assets/js/use-cases/partnership.js` â€” modal de parceria
- `public/images/` â€” pasta centralizada para todas as imagens (14 arquivos + 2 subpastas)
- `public/pages/` â€” pasta centralizada para HTMLs secundÃ¡rios (11 arquivos)
- `AGENTS.md` â€” protocolo de colaboraÃ§Ã£o com IA
- `CONTEXT.md` â€” estado atual do projeto
- `DECISIONS.md` â€” registro de decisÃµes tÃ©cnicas (5 ADRs)
- `TODO.md` â€” tarefas priorizadas
- `CHANGELOG.md` â€” este arquivo
- `docs/sessions/` â€” pasta para logs de sessÃ£o

### Modificado
- `public/mb-finance-completo.html` â€” removidos 4 blocos `<style>` e 8 blocos `<script>` inline; HTML caiu de 2712 para 1597 linhas; caminhos de imagens e pÃ¡ginas atualizados
- `CLAUDE.md` â€” documentada a refatoraÃ§Ã£o e o padrÃ£o para replicar nas outras pages
- `app/blog/[slug]/page.tsx` â€” caminhos de imagem e links de pÃ¡gina atualizados
- `app/sobre/page.tsx` â€” caminhos de imagem atualizados

### Removido
- PNGs/JPGs da raiz de `public/` (movidos para `public/images/`)
- HTMLs secundÃ¡rios da raiz de `public/` (movidos para `public/pages/`)

---

## Antes de 2026-04-14 â€” HistÃ³rico anterior

_(nÃ£o documentado â€” projeto existia antes da adoÃ§Ã£o do CHANGELOG)_

Principais marcos conhecidos:
- Blog migrado para Next.js com Upstash Redis
- PÃ¡gina `/sobre` migrada para Next.js
- Home mantida em HTML estÃ¡tico (estratÃ©gia Strangler Fig)
- Overflow horizontal mobile corrigido
- Smooth scroll com Lenis adicionado


## 2026-04-27 - Meta Pixel global

### Adicionado
- `public/assets/js/infra/meta-pixel.js` para carregar o Meta Pixel nos HTMLs estaticos.
- `components/MetaPixel.tsx` para carregar o Pixel nas paginas publicas do Next.js.

### Modificado
- Meta Pixel expandido para home, paginas secundarias publicas, artigos legados, blog e pagina sobre.
- `blog-admin.html` mantido fora do rastreamento.

## 2026-04-27 - Google Ads tag

### Adicionado
- `public/assets/js/infra/google-ads-tag.js` para carregar a Google tag nos HTMLs estaticos.
- `components/GoogleAdsTag.tsx` para carregar a tag nas paginas publicas do Next.js.

### Modificado
- Google tag `AW-18112641661` aplicada na home, paginas secundarias publicas, artigos legados, blog e pagina sobre.
- `blog-admin.html` mantido fora do rastreamento.

## 2026-04-27 - CSP Google Ads

### Modificado
- `vercel.json` atualizado para permitir os dominios necessarios da Google tag, Google Ads, Google Analytics e DoubleClick na Content Security Policy.

## 2026-04-27 - CSP Meta Pixel

### Corrigido
- `vercel.json` atualizado para permitir os dominios necessarios do Meta Pixel na Content Security Policy.

## 2026-04-27 - Meta Pixel inline na home

### Corrigido
- Home voltou a usar o snippet oficial inline do Meta Pixel para melhorar a deteccao pelo Meta Pixel Helper.

## 2026-04-27 - Meta Pixel inline no blog legado

### Corrigido
- `public/pages/blog.html` voltou a usar o snippet oficial inline do Meta Pixel para melhorar a deteccao pelo Meta Pixel Helper.

## 2026-04-27 - Tags na raiz do site

### Corrigido
- Rota raiz (`/`) agora carrega Meta Pixel e Google Ads tag antes de redirecionar para `/mb-finance-completo.html`.

## 2026-04-27 - Google Tag Manager

### Adicionado
- Google Tag Manager `GTM-MDST4NTK` no site publico, incluindo script no `<head>` e `noscript` apos abertura do `<body>`.
## 2026-05-05 - Blog em subdominio

### Adicionado
- Projeto separado do blog em `blog-pages/` para deploy na Vercel.
- Sitemap, robots, redirects e canonicals proprios para `https://blog.mbfinance.com.br`.

### Modificado
- Links de BLOG no site estatico agora apontam para `https://blog.mbfinance.com.br/blog`.
- `public/pages/blog.html` virou redirecionamento `noindex, follow` para o blog oficial.
- `/admin` no projeto `blog-pages/` agora abre a versao atual do painel administrativo HTML modular.
- `/blog` no projeto `blog-pages/` agora usa a versao visual atual da pagina publica do blog com busca, filtros, destaque, cards e rodape completo.
- `blog-pages` agora suporta Supabase Postgres como banco persistente para posts do blog.
- A sincronizacao do blog em `blog-pages/app/api/blog/sync/route.ts` agora usa a camada oficial de storage, permitindo gravar no Supabase quando configurado.
- Tabela `public.blog_posts` criada no Supabase e populada com os 5 posts iniciais do blog.
- Criada a pasta `blog-pages/` sem espaco para evitar erro de serverless function invalid name na Vercel.

---


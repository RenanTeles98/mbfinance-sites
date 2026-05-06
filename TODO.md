# TODO.md â€” Tarefas Pendentes

> Prioridade: ðŸ”´ CrÃ­tico | ðŸŸ¡ Importante | ðŸŸ¢ Backlog

---

## ðŸ”´ CrÃ­tico (fazer antes do prÃ³ximo push sÃ©rio)

- [x] **Filtrar posts agendados no Blog (Next.js)** - Implementado no `lib/blog-store.ts` e API.

- [x] **Substituir nÃºmero de WhatsApp fictÃ­cio pelo nÃºmero real** - Centralizado em `lib/constants.ts`.

- [x] **Banner de consentimento de cookies (LGPD)**
  - Implementado em todas as pÃ¡ginas do ecossistema (Next.js + Legado).
  - PersistÃªncia em localStorage e bloqueio de GA4 antes do consentimento.

- [x] **Refinamento Visual do Navbar**
  - Implementado fundo branco e troca de logo ao passar o mouse (hover).
  - Garante legibilidade do menu de produtos em qualquer posiÃ§Ã£o de scroll.

- [x] **Tipografia do Hero**
  - TÃ­tulo principal alterado para Inter Bold (700) para maior autoridade visual.

- [x] **Layout de Produtos**
  - SeÃ§Ã£o convertida para grid de 2 colunas com **cards independentes sÃ³lidos** (fundo branco, sombra).
  - LÃ³gica de accordion alterada para permitir mÃºltiplos itens abertos simultaneamente.

---

## ðŸŸ¡ Importante (prÃ³ximas sessÃµes)

### ConteÃºdo real
- [ ] Substituir depoimentos fictÃ­cios por depoimentos reais de clientes
- [ ] Adicionar logos dos bancos parceiros na seÃ§Ã£o de parceiros (carrossel)
- [ ] Atualizar links de redes sociais no rodapÃ© (`public/mb-finance-completo.html` + `public/pages/`)

### CMS Inteligente (Melhorias)
- [x] **Modularizar scripts do blog-admin.html** - LÃ³gica extraÃ­da para mÃ³dulos em `public/assets/js/admin/` e UI de abas estabilizada (ADR-013).
- [ ] **Validar Radar Trends em Mobile** - Verificar se o iframe do Google Trends comporta-se adequadamente em telas menores.
- [ ] **Aumentar base de tÃ³picos da IA** - Criar um arquivo de configuraÃ§Ã£o para expandir as ideias sugeridas pelo gerador.

### RefatoraÃ§Ã£o dos HTMLs secundÃ¡rios

- [ ] Refatorar `public/pages/sobre.html`
  - Extrair CSS â†’ `public/assets/css/sobre.css` (ou adicionar em `main.css` se compartilhado)
  - Extrair JS â†’ camadas `ui/`, `use-cases/`, `infra/`
  - Atualizar paths para `../assets/` e `../images/`
  - Preservar o ajuste visual do bloco `Escala` na timeline durante o refactor

- [ ] Refatorar `public/pages/blog.html`
  - Mesmos passos acima

- [ ] Refatorar `public/pages/politica-de-privacidade.html`
  - Hero-meta jÃ¡ ajustado para branco 90% em 2026-04-15; migrar para `public/assets/` no refactor

- [ ] Refatorar `public/pages/termos-de-uso.html`
  - Hero-meta jÃ¡ ajustado para branco 90% em 2026-04-15; migrar para `public/assets/` no refactor

### SEO
- [ ] Adicionar `sitemap.xml` apontando para todas as pages
- [ ] Verificar e corrigir `robots.txt`
- [ ] Open Graph tags em todas as pages (`og:image`, `og:description`)
- [ ] Meta descriptions Ãºnicas em cada page HTML

### Performance
- [ ] Converter imagens PNG/JPG para WebP
- [ ] Adicionar `loading="lazy"` nas imagens abaixo da dobra
- [ ] Verificar Lighthouse score (target: > 90)

---

## ðŸŸ¢ Backlog (futuro)

### MigraÃ§Ã£o Next.js (Strangler Fig)
- [ ] Migrar seÃ§Ã£o Hero para componente React
- [ ] Migrar seÃ§Ã£o Produtos para componente React
- [ ] Migrar seÃ§Ã£o Depoimentos para componente React
- [ ] Eventualmente eliminar `mb-finance-completo.html` totalmente

### Funcionalidades
- [ ] PÃ¡gina de agradecimento apÃ³s captura de lead
- [ ] Tracking de eventos GA4
- [ ] IntegraÃ§Ã£o com ferramenta de email marketing

### Infraestrutura
- [ ] Configurar `robots.txt` para bloquear `/admin`
- [ ] Adicionar error pages customizadas (404, 500) no Next.js

---

## Atualizacao 2026-04-27

### Marketing e mensuracao
- [x] Instalar Meta Pixel na home principal (`public/mb-finance-completo.html`) com ID `1303767088303655`.
- [ ] Validar disparo do evento `PageView` apos deploy no Meta Pixel Helper / Gerenciador de Eventos.
- [ ] Avaliar eventos de conversao futuros para CTAs de WhatsApp.

### Marketing e mensuracao - atualizacao global
- [x] Expandir o Meta Pixel para paginas publicas relevantes do site.
- [x] Manter o painel administrativo fora do rastreamento de campanhas.
- [ ] Validar o Pixel Helper apos deploy em `/mb-finance-completo.html`, `/pages/sobre.html`, `/blog` e um artigo.
- [ ] Implementar eventos futuros para cliques de WhatsApp (`Contact` ou `Lead`).

### Google Ads tag
- [x] Instalar Google tag `AW-18112641661` nas paginas publicas relevantes.
- [x] Manter o painel administrativo fora do rastreamento de campanhas.
- [x] Corrigir a rota raiz (`/`) para carregar tags antes de redirecionar para a home HTML.
- [ ] Validar a tag apos deploy no Tag Assistant do Google.
- [ ] Configurar eventos de conversao para cliques de WhatsApp quando a conta do Google Ads estiver pronta.

### Google Tag Manager
- [x] Instalar o container `GTM-MDST4NTK` no site publico.
- [x] Inserir o bloco `<noscript>` logo apos a abertura do `<body>` nos HTMLs publicos.
- [ ] Validar o container `GTM-MDST4NTK` no Tag Assistant apos deploy.

### CSP Google Ads
- [x] Ajustar CSP no `vercel.json` para permitir dominios da Google tag e Google Ads.
- [ ] Validar novamente no Tag Assistant apos deploy do Vercel.

### CSP Meta Pixel
- [x] Ajustar CSP no `vercel.json` para permitir dominios do Meta Pixel.
- [ ] Validar novamente no Meta Pixel Helper apos deploy do Vercel.

### Meta Pixel home
- [x] Restaurar snippet oficial inline do Meta Pixel na home para compatibilidade com Pixel Helper.
- [ ] Validar novamente a home no Meta Pixel Helper apos deploy.

### Meta Pixel blog legado
- [x] Restaurar snippet oficial inline do Meta Pixel em `public/pages/blog.html` para compatibilidade com Pixel Helper.
- [ ] Validar novamente `https://mbfinance-sites.vercel.app/pages/blog.html` no Meta Pixel Helper apos deploy.
---

## Atualizacao 2026-05-05 - Blog em subdominio

- [x] Criar projeto separado do blog em `blog-pages/` para deploy na Vercel.
- [x] Configurar canonicals, sitemap e robots do blog para `https://blog.mbfinance.com.br`.
- [x] Redirecionar `public/pages/blog.html` do Cpanel para o blog oficial na Vercel.
- [x] Preparar persistencia do blog em Supabase Postgres.
- [x] Executar `blog-pages/supabase-blog.sql` no SQL Editor do Supabase.
- [x] Revalidar conexao Supabase apos executar o SQL; `public.blog_posts` respondeu com status `200`.
- [x] Popular `public.blog_posts` com os 5 posts iniciais de `blog-pages/content/blog-posts.json`.
- [x] Preencher `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` do projeto do blog para permitir escrita administrativa local pelo painel.
- [x] Criar pasta `blog-pages/` sem espaco para compatibilidade com serverless functions da Vercel.
- [x] Corrigir admin para usar automaticamente a API do proprio dominio em producao.
- [x] Corrigir fluxo de publicacao do admin para avisar falha de sync e usar token admin no carregamento dos posts.
- [ ] Preencher `SUPABASE_SERVICE_ROLE_KEY` tambem na Vercel quando o projeto do blog for criado/importado.
- [ ] Ajustar Root Directory na Vercel para `blog-pages`.
- [ ] Configurar DNS do subdominio `blog.mbfinance.com.br`.
- [ ] Adicionar variaveis de ambiente na Vercel (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BLOG_ADMIN_TOKEN`, URLs publicas e credenciais opcionais de GA4/Resend).
- [ ] Enviar `https://blog.mbfinance.com.br/sitemap.xml` no Google Search Console.

---

## Atualizacao 2026-05-06 - Links do Blog

- [x] Corrigir links de Blog em `public/pages/credito-rapido.html` para `https://blog.mbfinance.com.br/blog`.
- [x] Garantir que o BLOG do menu principal da home e da navbar React aponte para `https://blog.mbfinance.com.br/blog`.
- [ ] Validar em producao o clique no menu desktop e mobile da pagina de Credito Rapido apos deploy.


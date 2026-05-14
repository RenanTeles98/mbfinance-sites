# TODO.md â€” Tarefas Pendentes

> Prioridade: ðŸ”´ CrÃ­tico | ðŸŸ¡ Importante | ðŸŸ¢ Backlog

---

## ðŸ”´ CrÃ­tico (fazer antes do prÃ³ximo push sÃ©rio)

- [x] **Corrigir periodo das metricas GA4 no painel**
  - API de analytics passa a respeitar `startDate` e `endDate`.
  - Consultas GA4 deixam de usar periodo fixo de 30 dias.
  - Validar deploy em producao apos push.

- [x] **Alinhar metricas do painel com a tela do GA4**
  - Card de visualizacoes substituido por "Contagem de eventos".
  - Backend passa a retornar `eventCount` no resumo e na serie diaria.
  - Visualizacoes de pagina permanecem como indicador complementar.

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

---

## Atualizacao 2026-05-07 - Google Analytics

- [x] Substituir o Measurement ID antigo `G-16ZB759EFL` pelo novo `G-3C1G7JNB9L` nas paginas publicas.
- [x] Manter o bloqueio LGPD: GA4 continua carregando apenas apos aceite de cookies nas paginas que usam `cookie-banner.js` ou `bundle.js`.
- [ ] Validar em producao no Tag Assistant / DebugView se o GA4 `G-3C1G7JNB9L` dispara em `mbfinance.com.br`.


---

## Atualizacao 2026-05-12 - Tags via Google Tag Manager

- [x] Remover Meta Pixel direto do codigo fonte publico.
- [x] Remover Google Ads direto do codigo fonte publico.
- [x] Remover GA4 direto dos HTMLs, componentes e loaders JS.
- [x] Manter apenas o GTM `GTM-MDST4NTK` como tag de marketing instalada diretamente.
- [x] Enviar aceite/recusa do banner LGPD para `dataLayer` via evento `cookie_consent_update`.
- [x] Trocar o GTM com lazy load da home por carregamento imediato para facilitar deteccao no Tag Assistant.
- [x] Conferir que `public/pages/sobre.html` ja possui o GTM no codigo fonte e no HTML publicado.
- [ ] Configurar no GTM a tag GA4 com o Measurement ID oficial.
- [ ] Configurar no GTM a tag Google Ads com o Conversion ID oficial.
- [ ] Configurar no GTM o Meta Pixel com o Pixel ID oficial.
- [ ] Publicar o container no GTM e validar em producao no Tag Assistant / Meta Pixel Helper.

---

## Atualizacao 2026-05-13 - Leads Conta PJ no admin

- [x] Adicionar card "Leads Gerados" no painel publicado do blog (`blog-pages/`).
- [x] Consultar GA4 por eventos de lead dentro do intervalo selecionado no painel.
- [ ] Validar em producao se o card carrega em `https://blog.mbfinance.com.br/admin`.
- [ ] Confirmar/publicar no GTM o evento especifico `conta_pj_lead_click` para separar Conta PJ de outros produtos.

---

## Atualizacao 2026-05-13 - Demografia GA4

- [x] Adicionar fallback de 90/365 dias para genero e faixa etaria no painel.
- [x] Impedir que falha/ocultacao de dados demograficos derrube o restante das metricas.
- [ ] Validar em producao se o GA4 retorna dados apos o fallback.
- [ ] Conferir no GA4 se dados demograficos/Google Signals estao ativados.

---

## Atualizacao 2026-05-13 - Textos do painel administrativo

- [x] Traduzir termos visiveis em ingles no admin do blog para pt-BR.
- [x] Corrigir acentuacao de mensagens de analytics, blog, anuncios e e-mails.
- [x] Validar build do projeto `blog-pages/` apos a troca de textos.
- [x] Traduzir canais de origem do trafego retornados pelo GA4.
- [x] Adicionar icone de informacao ao lado de cada canal no componente "Origem do trafego".
- [x] Criar explicacoes especificas para cada canal principal do GA4.
- [ ] Revisar visualmente o admin publicado para localizar textos residuais vindos de dados externos ou cache do navegador.
- [ ] Ampliar o mapa de traducao se o GA4 retornar novos canais nao previstos.

---

## Atualizacao 2026-05-14 - GA4 por site

- [x] Fazer a API de analytics respeitar o site selecionado (`mb-finance`, `mb-negocios`, `fomenta`).
- [x] Retornar status real de configuracao GA4 para cada site no seletor.
- [x] Permitir que MB Negocios/Fomenta reutilizem a service account principal quando apenas o `PROPERTY_ID` for diferente.
- [x] Aplicar `GA4_MB_NEGOCIOS_PROPERTY_ID=536401937` como fallback no codigo.
- [ ] Preencher `GA4_MB_NEGOCIOS_PROPERTY_ID=536401937` tambem no Vercel quando a CLI estiver autenticada.
- [ ] Garantir no GA4 que a service account principal tem acesso de leitura à propriedade MB Negocios.
- [ ] Validar em producao que "MB Negocios (configurar GA4)" desapareceu apos deploy/env.

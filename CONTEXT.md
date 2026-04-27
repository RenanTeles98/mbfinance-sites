# CONTEXT.md — Estado Atual do Projeto

> Última atualização: 2026-04-27
> Atualizado por: IA - Codex

---

## Estado Atual

### O que está funcionando

- [x] Home principal (`public/mb-finance-completo.html`) — refatorada com separação total de CSS/JS
- [x] CSS extraído para `public/assets/css/main.css`
- [x] JS modularizado em `public/assets/js/` (infra / use-cases / ui)
- [x] Imagens organizadas em `public/images/` (incluindo subpastas `premios/` e `icones-premios/`)
- [x] HTMLs secundários organizados em `public/pages/`
- [x] Caminhos atualizados em todos os arquivos após reorganização
- [x] Blog (`/blog`) rodando em Next.js com Upstash Redis em produção
- [x] Página `/sobre` rodando em Next.js
- [x] Smooth scroll com Lenis
- [x] Parallax no hero e na seção "Como Funciona"
- [x] Carrossel de parceiros (marquee animado)
- [x] Accordion de produtos e FAQ
- [x] Modal de lead com roteamento para WhatsApp
- [x] Modal de parceria
- [x] Menu mobile + dropdown de produtos
- [x] Botão WhatsApp fixo
- [x] Deploy no Vercel via push para master
- [x] `public/pages/termos-de-uso.html` com texto auxiliar do hero ajustado para branco com 90% de opacidade
- [x] `public/pages/politica-de-privacidade.html` com texto auxiliar do hero ajustado para branco com 90% de opacidade
- [x] Seção `Escala` da timeline em `public/pages/sobre.html` com texto e ícone invertidos e checkpoint alinhado ao eixo principal
- [x] Painel Administrativo do Blog (`public/pages/blog-admin.html`) totalmente funcional
- [x] Calendário Editorial Visual para planejamento mensal de posts
- [x] Sistema de Agendamento (campo de Hora + Status Inteligente: Publicado/Agendado/Rascunho)
- [x] Métricas do Google Analytics 4 integradas por post no painel administrativo
- [x] Gerador de Conteúdo IA integrado ao CMS para sugestão automática de pautas
- [x] Radar Google Trends (Real-time) acoplado ao painel administrativo para análise de nicho
- [x] Portal de Recrutamento padronizado (`https://mbfinance.inhire.app/vagas`) em todo o ecossistema (Next.js + Legado)
- [x] Conformidade LGPD concluída em todo o site (Banner de cookies + bloqueio de GA4)
- [x] Refinamento do Navbar (Fundo branco no hover e logo dinâmico)
- [x] **Tipografia do Hero**
  - Título principal alterado para Inter Bold (700) para maior autoridade visual.
- [x] **Layout de Produtos**
  - [x] Seção "Nossos Produtos" convertida para grid de duas colunas com cards independentes sólidos (fundo branco)
- [x] Atualização de marca: mb negócios e mb tributos (casing minúsculo) em todo o site.
- [x] Deploy para GitHub e Vercel concluído.

### O que está pendente / incompleto

- [ ] Filtrar posts agendados no Blog (Next.js) — atualmente todos aparecem independente da data futura
- [ ] `public/pages/sobre.html` ainda com CSS/JS inline — precisa refatorar
- [ ] `public/pages/blog.html` ainda com CSS/JS inline — precisa refatorar
- [ ] `public/pages/politica-de-privacidade.html` e `termos-de-uso.html` — refatorar
- [ ] Número de WhatsApp ainda fictício — substituir pelo número real
- [ ] Logos dos bancos parceiros — adicionar na seção de parceiros
- [ ] Links de redes sociais no rodapé — apontar para perfis reais
- [ ] Depoimentos fictícios — substituir por depoimentos reais
- [ ] Depoimentos fictícios — substituir por depoimentos reais

### O que está quebrado / com bug

_(nenhum bug conhecido em produção no momento)_

---

## Onde o trabalho parou (última sessão — 2026-04-20)

### Painel Administrativo (Blog CMS) - ESTABILIZADO
- **Arquitetura:** Modularizada em 9 arquivos JS em `public/assets/js/admin/`.
- **UI/UX:** Sistema de abas isolado via `.admin-screen` e `#admin-body`. Problemas de sobreposição resolvidos.
- **Menu:** Ordem de prioridade definida (Métricas > Blog > Newsletter > Publicidade).
- **Autenticação:** Ativa e persistente via `localStorage`.
- **Funcionalidades:** Analytics (GA4), Blog (CRUD), Newsletter (Advanced UI), Calendário Editorial, Gerador IA (Trends).

Arquivos modificados nesta sessão:
- `public/pages/blog-admin.html`
- `public/pages/termos-de-uso.html`
- `public/mb-finance-completo.html` (Vídeo de fundo atualizado para `cidade-sem-avioes.mp4`)
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `docs/sessions/2026-04-20.md`

- [x] Modularização completa do Painel Administrativo (`public/pages/blog-admin.html`)
- [x] Separação da lógica em módulos: `state`, `utils`, `blog`, `newsletter`, `calendar`, `analytics`, `ai`, `banners` e `core`.
- [x] Limpeza total de scripts legados e duplicados no dashboard.

Próximo passo recomendado: Ajustar o endpoint do Blog no Next.js para respeitar a data/hora e não exibir posts agendados (futuros). Outro ponto fundamental é iniciar a refatoração das páginas de política de privacidade e termos de uso para o padrão modular.


---

## Arquitetura resumida

- **Frontend principal:** HTML estático (`public/mb-finance-completo.html`) com CSS/JS externos em `public/assets/`
- **Framework:** Next.js 14 (App Router) — usado para blog e página sobre
- **Estilo:** Tailwind CSS + custom tokens + `main.css`
- **Animações:** Lenis (smooth scroll), CSS @keyframes, IntersectionObserver
- **Blog:** Next.js + Upstash Redis (produção) / JSON local (dev)
- **Analytics:** Google Analytics 4
- **Deploy:** Vercel (push para master = deploy automático)
- **Captação de leads:** Modal → WhatsApp (principal) + Google Sheets (backup)

---

## Branch e commits recentes

- Branch principal: `master`
- Último conjunto de commits: ajustes visuais nas páginas legais e na timeline do `sobre`
- Rollback disponível via Vercel dashboard ou `git revert`

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

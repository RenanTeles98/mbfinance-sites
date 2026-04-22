# CONTEXT.md — Estado Atual do Projeto

> Última atualização: 2026-04-22
> Atualizado por: IA - Antigravity

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

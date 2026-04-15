# CONTEXT.md — Estado Atual do Projeto

> Última atualização: 2026-04-15
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

### O que está pendente / incompleto

- [ ] `public/pages/sobre.html` ainda com CSS/JS inline — precisa refatorar
- [ ] `public/pages/blog.html` ainda com CSS/JS inline — precisa refatorar
- [ ] `public/pages/politica-de-privacidade.html` e `termos-de-uso.html` — refatorar
- [ ] Número de WhatsApp ainda fictício — substituir pelo número real
- [ ] Logos dos bancos parceiros — adicionar na seção de parceiros
- [ ] Links de redes sociais no rodapé — apontar para perfis reais
- [ ] Depoimentos fictícios — substituir por depoimentos reais
- [ ] Banner de consentimento de cookies (LGPD)

### O que está quebrado / com bug

_(nenhum bug conhecido em produção no momento)_

---

## Onde o trabalho parou (última sessão — 2026-04-15)

Sessão focada em:
1. Ajuste visual pontual em `public/pages/termos-de-uso.html`
2. Ajuste visual pontual em `public/pages/politica-de-privacidade.html`
3. Aumento da opacidade do texto auxiliar do hero para branco com 90%
4. Correção do atributo `class` do parágrafo do hero para garantir aplicação do estilo

Arquivos modificados nesta sessão:
- `public/pages/politica-de-privacidade.html`
- `public/pages/termos-de-uso.html`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `docs/sessions/2026-04-15.md`

Próximo passo recomendado: refatorar `public/pages/termos-de-uso.html` e `public/pages/politica-de-privacidade.html` para remover CSS inline/local e seguir o padrão de `public/assets/`.

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
- Último conjunto de commits: refatoração do `mb-finance-completo.html`, reorganização de `public/`
- Rollback disponível via Vercel dashboard ou `git revert`

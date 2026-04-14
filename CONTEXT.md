# CONTEXT.md — Estado Atual do Projeto

> Última atualização: 2026-04-14
> Atualizado por: IA - Claude Sonnet 4.6

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

## Onde o trabalho parou (última sessão — 2026-04-14)

Sessão focada em:
1. Refatoração completa do `mb-finance-completo.html` (separação CSS/JS)
2. Reorganização da pasta `public/` (imagens → `images/`, HTMLs → `pages/`)
3. Atualização de todos os caminhos afetados
4. Push para git e deploy no Vercel
5. Documentação do padrão no `CLAUDE.md`
6. Análise do Software Architect Vault e implementação das ferramentas úteis

Próximo passo recomendado: refatorar `public/pages/sobre.html` seguindo o mesmo padrão de `mb-finance-completo.html`.

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

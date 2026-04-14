# CHANGELOG.md — Histórico de Mudanças

> Formato: [versão ou data] — O que mudou

---

## 2026-04-14 — Refatoração estrutural + organização

### Adicionado
- `public/assets/css/main.css` — todo o CSS extraído do HTML principal (614 linhas)
- `public/assets/js/infra/sheets.js` — integração com Google Sheets
- `public/assets/js/infra/storage.js` — backup em localStorage
- `public/assets/js/ui/scroll.js` — smooth scroll + Lenis
- `public/assets/js/ui/navbar.js` — navbar scroll effect, menu mobile, dropdown
- `public/assets/js/ui/accordion.js` — accordion de produtos + FAQ
- `public/assets/js/ui/animations.js` — parallax, etapas animadas, carrossel
- `public/assets/js/use-cases/lead.js` — modal de lead + roteamento WhatsApp
- `public/assets/js/use-cases/partnership.js` — modal de parceria
- `public/images/` — pasta centralizada para todas as imagens (14 arquivos + 2 subpastas)
- `public/pages/` — pasta centralizada para HTMLs secundários (11 arquivos)
- `AGENTS.md` — protocolo de colaboração com IA
- `CONTEXT.md` — estado atual do projeto
- `DECISIONS.md` — registro de decisões técnicas (5 ADRs)
- `TODO.md` — tarefas priorizadas
- `CHANGELOG.md` — este arquivo
- `docs/sessions/` — pasta para logs de sessão

### Modificado
- `public/mb-finance-completo.html` — removidos 4 blocos `<style>` e 8 blocos `<script>` inline; HTML caiu de 2712 para 1597 linhas; caminhos de imagens e páginas atualizados
- `CLAUDE.md` — documentada a refatoração e o padrão para replicar nas outras pages
- `app/blog/[slug]/page.tsx` — caminhos de imagem e links de página atualizados
- `app/sobre/page.tsx` — caminhos de imagem atualizados

### Removido
- PNGs/JPGs da raiz de `public/` (movidos para `public/images/`)
- HTMLs secundários da raiz de `public/` (movidos para `public/pages/`)

---

## Antes de 2026-04-14 — Histórico anterior

_(não documentado — projeto existia antes da adoção do CHANGELOG)_

Principais marcos conhecidos:
- Blog migrado para Next.js com Upstash Redis
- Página `/sobre` migrada para Next.js
- Home mantida em HTML estático (estratégia Strangler Fig)
- Overflow horizontal mobile corrigido
- Smooth scroll com Lenis adicionado

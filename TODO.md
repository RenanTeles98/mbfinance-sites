# TODO.md — Tarefas Pendentes

> Prioridade: 🔴 Crítico | 🟡 Importante | 🟢 Backlog

---

## 🔴 Crítico (fazer antes do próximo push sério)

- [ ] **Filtrar posts agendados no Blog (Next.js)** - Crítico para que o agendamento funcione (atualmente todos os posts são visíveis)
  - Modificar o endpoint da API no Next.js para comparar data atual com 'date' e 'time' do post.

- [ ] **Substituir número de WhatsApp fictício pelo número real**
  - Buscar em: `public/mb-finance-completo.html`, `public/assets/js/use-cases/lead.js`, `public/assets/js/use-cases/partnership.js`, todos os HTMLs em `public/pages/`, componentes Next.js

- [ ] **Banner de consentimento de cookies (LGPD)**
  - O site coleta dados via Google Analytics e localStorage — exige consentimento
  - Mínimo: banner com aceitar/recusar e bloqueio do GA antes do aceite

---

## 🟡 Importante (próximas sessões)

### Conteúdo real
- [ ] Substituir depoimentos fictícios por depoimentos reais de clientes
- [ ] Adicionar logos dos bancos parceiros na seção de parceiros (carrossel)
- [ ] Atualizar links de redes sociais no rodapé (`public/mb-finance-completo.html` + `public/pages/`)

### Refatoração dos HTMLs secundários

- [ ] Refatorar `public/pages/sobre.html`
  - Extrair CSS → `public/assets/css/sobre.css` (ou adicionar em `main.css` se compartilhado)
  - Extrair JS → camadas `ui/`, `use-cases/`, `infra/`
  - Atualizar paths para `../assets/` e `../images/`
  - Preservar o ajuste visual do bloco `Escala` na timeline durante o refactor

- [ ] Refatorar `public/pages/blog.html`
  - Mesmos passos acima

- [ ] Refatorar `public/pages/politica-de-privacidade.html`
  - Hero-meta já ajustado para branco 90% em 2026-04-15; migrar para `public/assets/` no refactor

- [ ] Refatorar `public/pages/termos-de-uso.html`
  - Hero-meta já ajustado para branco 90% em 2026-04-15; migrar para `public/assets/` no refactor

### SEO
- [ ] Adicionar `sitemap.xml` apontando para todas as pages
- [ ] Verificar e corrigir `robots.txt`
- [ ] Open Graph tags em todas as pages (`og:image`, `og:description`)
- [ ] Meta descriptions únicas em cada page HTML

### Performance
- [ ] Converter imagens PNG/JPG para WebP
- [ ] Adicionar `loading="lazy"` nas imagens abaixo da dobra
- [ ] Verificar Lighthouse score (target: > 90)

---

## 🟢 Backlog (futuro)

### Migração Next.js (Strangler Fig)
- [ ] Migrar seção Hero para componente React
- [ ] Migrar seção Produtos para componente React
- [ ] Migrar seção Depoimentos para componente React
- [ ] Eventualmente eliminar `mb-finance-completo.html` totalmente

### Funcionalidades
- [ ] Página de agradecimento após captura de lead
- [ ] Tracking de eventos GA4
- [ ] Integração com ferramenta de email marketing

### Infraestrutura
- [ ] Configurar `robots.txt` para bloquear `/admin`
- [ ] Adicionar error pages customizadas (404, 500) no Next.js

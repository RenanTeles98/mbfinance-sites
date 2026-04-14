# TODO.md — Tarefas Pendentes

> Prioridade: 🔴 Crítico | 🟡 Importante | 🟢 Backlog

---

## 🔴 Crítico (fazer antes do próximo push sério)

- [ ] **Substituir número de WhatsApp fictício pelo número real**
  - Buscar em: `public/mb-finance-completo.html`, `public/assets/js/use-cases/lead.js`, `public/assets/js/use-cases/partnership.js`, todos os HTMLs em `public/pages/`, componentes Next.js
  - Comando sugerido: `grep -r "5511" public/ components/ app/`

- [ ] **Banner de consentimento de cookies (LGPD)**
  - O site coleta dados via Google Analytics e localStorage — exige consentimento
  - Mínimo: banner com aceitar/recusar, bloquear GA antes do aceite

---

## 🟡 Importante (próximas sessões)

### Conteúdo real
- [ ] Substituir depoimentos fictícios por depoimentos reais de clientes
- [ ] Adicionar logos dos bancos parceiros na seção de parceiros (carrossel)
- [ ] Atualizar links de redes sociais no rodapé (`public/mb-finance-completo.html` + `public/pages/`)

### Refatoração dos HTMLs secundários
Seguir o mesmo padrão do `mb-finance-completo.html` (ver `CLAUDE.md` seção "Refatoração"):

- [ ] Refatorar `public/pages/sobre.html`
  - Extrair CSS → `public/assets/css/sobre.css` (ou adicionar em `main.css` se compartilhado)
  - Extrair JS → camadas `ui/`, `use-cases/`, `infra/`
  - Atualizar paths para `../assets/` e `../images/`

- [ ] Refatorar `public/pages/blog.html`
  - Mesmos passos acima

- [ ] Refatorar `public/pages/politica-de-privacidade.html`
- [ ] Refatorar `public/pages/termos-de-uso.html`

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
- [ ] Página de agradecimento após captura de lead (melhora rastreamento de conversão)
- [ ] Tracking de eventos GA4 (clique no WhatsApp, abertura de modal, scroll depth)
- [ ] Integração com ferramenta de email marketing (ex: Mailchimp, Brevo)

### Infraestrutura
- [ ] Configurar `robots.txt` para bloquear `/admin`
- [ ] Adicionar error pages customizadas (404, 500) no Next.js

---

## Checklist Pré-Launch (próximo deploy sério)

Baseado no vault de arquitetura:

### Segurança
- [ ] SSL/TLS ativo (Vercel garante automaticamente)
- [ ] Secrets em variáveis de ambiente no Vercel (não no código)
- [ ] `.env` não commitado no repositório
- [ ] URL do Google Sheets ofuscada (já feito com `atob()`)

### Performance
- [ ] Core Web Vitals passando
- [ ] Imagens otimizadas (WebP, lazy loading)

### Legal / LGPD
- [ ] Política de Privacidade publicada e linkada
- [ ] Termos de Uso publicados e linkados
- [ ] Banner de cookies funcional
- [ ] Canal de contato para exercer direitos LGPD

### Negócio
- [ ] Analytics (GA4) configurado e disparando eventos
- [ ] Número de WhatsApp correto em todos os CTAs
- [ ] Favicon correto
- [ ] Open Graph tags (para compartilhamento em redes sociais)

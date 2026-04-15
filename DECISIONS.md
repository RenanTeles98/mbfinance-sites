# DECISIONS.md — Registro de Decisões Técnicas

> Cada decisão importante fica registrada aqui com contexto e alternativas.
> Formato: ADR (Architecture Decision Record)

---

## ADR-001: HTML estático como página principal em vez de migrar tudo para Next.js

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O site nasceu como HTML puro. Migrar tudo de uma vez para Next.js seria arriscado (site em produção, sem testes, prazo indefinido) e desnecessário — a home não precisa de server-side rendering nem de componentes reativos complexos.

### Decisão

Manter a home em HTML estático (`public/mb-finance-completo.html`) e adotar a estratégia **Strangler Fig**: migrar gradualmente para Next.js conforme a necessidade surgir.

### Alternativas Consideradas

#### Alternativa A: Migração total para Next.js de uma vez
- **Pros:** código unificado, DX melhor, Framer Motion disponível
- **Contras:** alto risco de quebrar o site em produção, grande esforço sem ROI imediato
- **Motivo da rejeição:** risco desproporcional ao benefício

#### Alternativa B: Strangler Fig (escolhida)
- **Pros:** zero downtime, migração incremental, risco controlado
- **Contras:** dois mundos coexistindo (HTML + Next.js) = complexidade temporária
- **Por que foi escolhida:** pragmática para o estágio atual do projeto

### Consequências Positivas
- Site continua no ar durante toda a evolução
- Blog e `/sobre` já rodam em Next.js — padrão validado
- Dá para migrar seção por seção quando fizer sentido

### Consequências Negativas
- Dois padrões coexistindo (HTML + React)
- Paths de assets precisam de atenção especial (`public/` vs `/`)

---

## ADR-002: Clean Architecture no JavaScript do HTML legado

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O `mb-finance-completo.html` tinha 2712 linhas com 4 blocos `<style>` e 8 blocos `<script>` inline. Impossível de manter, testar ou reutilizar.

### Decisão

Extrair todo CSS e JS do HTML, organizando em camadas por responsabilidade:

```text
public/assets/
├── css/main.css
└── js/
    ├── infra/        ← chamadas externas (Sheets, localStorage)
    ├── use-cases/    ← regras de negócio (lead, parceria)
    └── ui/           ← interação com DOM (navbar, accordion, animações)
```

### Alternativas Consideradas

#### Alternativa A: Bundler (Webpack/Vite) com módulos ES
- **Pros:** imports explícitos, tree-shaking, hot reload
- **Contras:** adiciona build step ao HTML estático, overhead desnecessário
- **Motivo da rejeição:** complexidade não justificada para o volume de JS atual

#### Alternativa B: Arquivos separados por responsabilidade (escolhida)
- **Pros:** zero build step, fácil de entender, funciona diretamente no browser
- **Contras:** sem imports explícitos — dependências por convenção de ordem de carregamento
- **Por que foi escolhida:** simples, funcional, suficiente

### Consequências Positivas
- HTML ficou com 1597 linhas (redução de 41%)
- CSS e JS são editáveis sem mexer no HTML
- Padrão documentado e replicável para todas as outras pages

### Ordem de carregamento obrigatória
```html
<script src="lenis.min.js"></script>
<script src="assets/js/infra/sheets.js"></script>
<script src="assets/js/infra/storage.js"></script>
<script src="assets/js/ui/scroll.js"></script>
<script src="assets/js/ui/navbar.js"></script>
<script src="assets/js/ui/accordion.js"></script>
<script src="assets/js/ui/animations.js"></script>
<script src="assets/js/use-cases/lead.js"></script>
<script src="assets/js/use-cases/partnership.js"></script>
```

---

## ADR-003: Upstash Redis para armazenamento do blog

**Data:** 2026-04-14 (registrado retrospectivamente)
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O blog precisa de um lugar para armazenar os posts. O projeto roda no Vercel, que não tem sistema de arquivos persistente. Banco de dados relacional seria overkill para o volume de posts.

### Decisão

Usar Upstash Redis (Vercel KV) como storage dos posts em produção, com fallback para JSON local em desenvolvimento.

### Alternativas Consideradas

#### Alternativa A: Banco relacional (PostgreSQL/Supabase)
- **Pros:** queries flexíveis, relações, maduro
- **Contras:** overkill para blog simples, custo maior, latência maior no Vercel
- **Motivo da rejeição:** complexidade desnecessária para o volume

#### Alternativa B: Sanity / Contentful (CMS headless)
- **Pros:** interface admin pronta, bom DX
- **Contras:** dependência externa, custo, curva de aprendizado para dono não-técnico
- **Motivo da rejeição:** o admin customizado já resolve

#### Alternativa C: Upstash Redis (escolhida)
- **Pros:** serverless-native, integração nativa Vercel, gratuito na escala atual, simples
- **Contras:** sem queries complexas, não é banco relacional
- **Por que foi escolhida:** perfeito para o caso de uso (key-value de posts)

### Variáveis de ambiente necessárias
```env
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

---

## ADR-004: Vercel como plataforma de deploy

**Data:** 2026-04-14 (registrado retrospectivamente)
**Status:** Aceita

### Contexto

Projeto Next.js precisa de hospedagem que suporte SSR e serverless functions.

### Decisão

Deploy no Vercel com CI/CD automático via push para `master`.

### Consequências
- Push para master = deploy automático (sem pipeline manual)
- Rollback disponível via dashboard Vercel
- Variáveis de ambiente gerenciadas no painel Vercel
- Integração nativa com Upstash Redis (Vercel KV)

---

## ADR-005: Google Sheets como CRM de leads (via Apps Script)

**Data:** 2026-04-14 (registrado retrospectivamente)
**Status:** Aceita

### Contexto

Leads capturados no modal precisam ser armazenados em algum lugar acessível ao dono (não-técnico).

### Decisão

Enviar leads para Google Sheets via Google Apps Script (webhook GET). URL do script ofuscada com `atob()` no `sheets.js`.

### Alternativas Consideradas

- **CRM dedicado (HubSpot, RD Station):** custo + curva de aprendizado
- **Email (EmailJS):** sem visão consolidada
- **Google Sheets (escolhida):** familiar ao dono, gratuito, zero infra

### Consequências
- localStorage usado como backup caso o fetch falhe
- URL do script ofuscada (não é criptografia, apenas não fica em plain text)

---

## ADR-006: Ajustes visuais pontuais nas páginas legais permanecem locais até a refatoração

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

As páginas legais ainda usam CSS local no próprio HTML. Surgiu uma demanda pequena e imediata para aumentar a opacidade do texto auxiliar do hero em `public/pages/termos-de-uso.html`.

### Decisão

Aplicar o ajuste visual diretamente no CSS local existente da página legal, sem ampliar o escopo para a refatoração estrutural completa nesta sessão.

### Alternativas Consideradas

- **Extrair CSS agora para `public/assets/`:** mais alinhado ao padrão final, mas desproporcional para um ajuste pontual
- **Ajuste local no arquivo atual (escolhida):** resolve imediatamente com risco baixo e sem mexer na arquitetura

### Consequências

- Mantém rapidez para correções visuais pequenas nas páginas legais legadas
- A refatoração completa dessas páginas continua pendente

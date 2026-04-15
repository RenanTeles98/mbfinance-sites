# DECISIONS.md — Registro de Decisões Técnicas

> Cada decisão importante fica registrada aqui com contexto e alternativas.
> Formato: ADR (Architecture Decision Record)

---

## ADR-001: HTML estático como página principal em vez de migrar tudo para Next.js

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O site nasceu como HTML puro. Migrar tudo de uma vez para Next.js seria arriscado e desnecessário para o estágio atual do projeto.

### Decisão

Manter a home em HTML estático (`public/mb-finance-completo.html`) e adotar a estratégia **Strangler Fig**: migrar gradualmente para Next.js conforme a necessidade surgir.

### Alternativas Consideradas

- **Migração total para Next.js:** unificaria a base, mas com alto risco e esforço desproporcional
- **Strangler Fig (escolhida):** permite evolução incremental com risco controlado

### Consequências

- O site continua no ar durante a evolução
- Dois padrões coexistem temporariamente (HTML legado + Next.js)

---

## ADR-002: Clean Architecture no JavaScript do HTML legado

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O `mb-finance-completo.html` tinha estilos e scripts inline demais, dificultando manutenção e reaproveitamento.

### Decisão

Extrair CSS e JS do HTML, organizando o JavaScript em `infra/`, `use-cases/` e `ui/` dentro de `public/assets/`.

### Alternativas Consideradas

- **Bundler com módulos ES:** mais robusto, mas com complexidade desnecessária para o estágio atual
- **Arquivos separados por responsabilidade (escolhida):** simples, sem build step e suficiente para o volume atual

### Consequências

- HTML mais limpo
- CSS e JS editáveis sem voltar a colocar lógica inline

---

## ADR-003: Upstash Redis para armazenamento do blog

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O blog precisava de persistência compatível com o ambiente serverless da Vercel.

### Decisão

Usar Upstash Redis (Vercel KV) em produção, com fallback para JSON local em desenvolvimento.

### Consequências

- Solução simples e suficiente para o volume atual de posts

---

## ADR-004: Vercel como plataforma de deploy

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O projeto precisa de hospedagem compatível com Next.js, páginas estáticas e deploy contínuo simples.

### Decisão

Deploy no Vercel com CI/CD automático via push para `master`.

### Consequências

- Push para `master` gera deploy automático
- Rollback fica disponível no painel da Vercel

---

## ADR-005: Google Sheets como CRM de leads (via Apps Script)

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

Os leads precisavam cair em uma ferramenta simples e acessível ao dono do projeto.

### Decisão

Enviar leads para Google Sheets via Google Apps Script, com fallback local em `localStorage`.

### Consequências

- Operação simples para o dono
- Menos complexidade do que introduzir um CRM completo

---

## ADR-006: Ajustes visuais pontuais nas páginas legais permanecem locais até a refatoração

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

As páginas legais ainda usam CSS local no próprio HTML. Surgiu uma demanda pequena e imediata para aumentar a opacidade do texto auxiliar do hero em `public/pages/termos-de-uso.html` e `public/pages/politica-de-privacidade.html`.

### Decisão

Aplicar o ajuste visual diretamente no CSS local existente dessas páginas, sem ampliar o escopo para a refatoração estrutural completa nesta sessão.

### Alternativas Consideradas

- **Extrair CSS agora para `public/assets/`:** mais alinhado ao padrão final, mas desproporcional para um ajuste pontual
- **Ajuste local no arquivo atual (escolhida):** resolve imediatamente com risco baixo e sem mexer na arquitetura

### Consequências

- Mantém rapidez para correções visuais pequenas nas páginas legais legadas
- A refatoração completa dessas páginas continua pendente

---

## ADR-007: O bloco "Escala" da timeline do Sobre volta ao eixo visual padrão

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

No bloco `Escala` (`2020-2022`) da timeline em `public/pages/sobre.html`, o texto estava no lado oposto do ícone e o checkpoint havia sido deslocado para baixo da linha horizontal, criando desalinhamento visual em relação aos demais marcos.

### Decisão

Recolocar o bloco `Escala` no fluxo padrão da timeline: conteúdo à esquerda, ícone à direita e checkpoint alinhado novamente ao eixo horizontal principal.

### Alternativas Consideradas

- **Manter o layout invertido e ajustar só o checkpoint:** corrigiria parcialmente o problema, mas preservaria um padrão inconsistente no bloco
- **Voltar ao layout padrão (escolhida):** simplifica a composição e melhora a leitura visual da sequência

### Consequências

- O bloco `Escala` fica consistente com a linguagem visual dos outros marcos da timeline
- O eixo da timeline volta a parecer contínuo e intencional

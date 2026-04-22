# DECISIONS.md â€” Registro de DecisÃµes TÃ©cnicas

> Cada decisÃ£o importante fica registrada aqui com contexto e alternativas.
> Formato: ADR (Architecture Decision Record)

---

## ADR-001: HTML estÃ¡tico como pÃ¡gina principal em vez de migrar tudo para Next.js

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O site nasceu como HTML puro. Migrar tudo de uma vez para Next.js seria arriscado e desnecessÃ¡rio para o estÃ¡gio atual do projeto.

### DecisÃ£o

Manter a home em HTML estÃ¡tico (`public/mb-finance-completo.html`) e adotar a estratÃ©gia **Strangler Fig**: migrar gradualmente para Next.js conforme a necessidade surgir.

### Alternativas Consideradas

- **MigraÃ§Ã£o total para Next.js:** unificaria a base, mas com alto risco e esforÃ§o desproporcional
- **Strangler Fig (escolhida):** permite evoluÃ§Ã£o incremental com risco controlado

### ConsequÃªncias

- O site continua no ar durante a evoluÃ§Ã£o
- Dois padrÃµes coexistem temporariamente (HTML legado + Next.js)

---

## ADR-002: Clean Architecture no JavaScript do HTML legado

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O `mb-finance-completo.html` tinha estilos e scripts inline demais, dificultando manutenÃ§Ã£o e reaproveitamento.

### DecisÃ£o

Extrair CSS e JS do HTML, organizando o JavaScript em `infra/`, `use-cases/` e `ui/` dentro de `public/assets/`.

### Alternativas Consideradas

- **Bundler com mÃ³dulos ES:** mais robusto, mas com complexidade desnecessÃ¡ria para o estÃ¡gio atual
- **Arquivos separados por responsabilidade (escolhida):** simples, sem build step e suficiente para o volume atual

### ConsequÃªncias

- HTML mais limpo
- CSS e JS editÃ¡veis sem voltar a colocar lÃ³gica inline

---

## ADR-003: Upstash Redis para armazenamento do blog

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O blog precisava de persistÃªncia compatÃ­vel com o ambiente serverless da Vercel.

### DecisÃ£o

Usar Upstash Redis (Vercel KV) em produÃ§Ã£o, com fallback para JSON local em desenvolvimento.

### ConsequÃªncias

- SoluÃ§Ã£o simples e suficiente para o volume atual de posts

---

## ADR-004: Vercel como plataforma de deploy

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O projeto precisa de hospedagem compatÃ­vel com Next.js, pÃ¡ginas estÃ¡ticas e deploy contÃ­nuo simples.

### DecisÃ£o

Deploy no Vercel com CI/CD automÃ¡tico via push para `master`.

### ConsequÃªncias

- Push para `master` gera deploy automÃ¡tico
- Rollback fica disponÃ­vel no painel da Vercel

---

## ADR-005: Google Sheets como CRM de leads (via Apps Script)

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

Os leads precisavam cair em uma ferramenta simples e acessÃ­vel ao dono do projeto.

### DecisÃ£o

Enviar leads para Google Sheets via Google Apps Script, com fallback local em `localStorage`.

### ConsequÃªncias

- OperaÃ§Ã£o simples para o dono
- Menos complexidade do que introduzir um CRM completo

---

## ADR-006: Ajustes visuais pontuais nas pÃ¡ginas legais permanecem locais atÃ© a refatoraÃ§Ã£o

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

As pÃ¡ginas legais ainda usam CSS local no prÃ³prio HTML. Surgiu uma demanda pequena e imediata para aumentar a opacidade do texto auxiliar do hero em `public/pages/termos-de-uso.html` e `public/pages/politica-de-privacidade.html`.

### DecisÃ£o

Aplicar o ajuste visual diretamente no CSS local existente dessas pÃ¡ginas, sem ampliar o escopo para a refatoraÃ§Ã£o estrutural completa nesta sessÃ£o.

### Alternativas Consideradas

- **Extrair CSS agora para `public/assets/`:** mais alinhado ao padrÃ£o final, mas desproporcional para um ajuste pontual
- **Ajuste local no arquivo atual (escolhida):** resolve imediatamente com risco baixo e sem mexer na arquitetura

### ConsequÃªncias

- MantÃ©m rapidez para correÃ§Ãµes visuais pequenas nas pÃ¡ginas legais legadas
- A refatoraÃ§Ã£o completa dessas pÃ¡ginas continua pendente

---

## ADR-007: O bloco "Escala" da timeline do Sobre volta ao eixo visual padrÃ£o

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

No bloco `Escala` (`2020-2022`) da timeline em `public/pages/sobre.html`, o texto estava no lado oposto do Ã­cone e o checkpoint havia sido deslocado para baixo da linha horizontal, criando desalinhamento visual em relaÃ§Ã£o aos demais marcos.

### DecisÃ£o

Recolocar o bloco `Escala` no fluxo padrÃ£o da timeline: conteÃºdo Ã  esquerda, Ã­cone Ã  direita e checkpoint alinhado novamente ao eixo horizontal principal.

### Alternativas Consideradas

- **Manter o layout invertido e ajustar sÃ³ o checkpoint:** corrigiria parcialmente o problema, mas preservaria um padrÃ£o inconsistente no bloco
- **Voltar ao layout padrÃ£o (escolhida):** simplifica a composiÃ§Ã£o e melhora a leitura visual da sequÃªncia

### ConsequÃªncias

- O bloco `Escala` fica consistente com a linguagem visual dos outros marcos da timeline
- O eixo da timeline volta a parecer contÃ­nuo e intencional

---

## ADR-008: SimplificaÃ§Ã£o do Menu Administrativo do Blog

**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O menu administrativo do blog (`public/pages/blog-admin.html`) continha as seÃ§Ãµes "Podcast" e "Banners". "Podcast" ainda era um placeholder ("Em breve") e "Banners" causava certa confusÃ£o semÃ¢ntica.

### DecisÃ£o

Remover o item "Podcast" e renomear "Banners" para "Publicidade" para melhor alinhamento com a finalidade de gerenciar slots de anÃºncios.

### ConsequÃªncias

- Menu mais limpo e focado no conteÃºdo atual.
- Melhor clareza sobre a funcionalidade de gerenciamento de anÃºncios.


---

## ADR-009: Implementação do Calendário Editorial e Status de Agendamento
**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto
O usuário precisava de uma forma visual de planejar o conteúdo mensal do blog e agendar posts para datas e horários futuros para automação.

### Decisão
Implementar uma aba de **Calendário Editorial** (visão de matriz mensal) no painel administrativo e expandir o schema de posts para incluir um campo 'time'. Implementar uma lógica de status baseada na data atual:
- **Publicado:** Data no passado e 'published' true.
- **Agendado:** Data no futuro e 'published' true.
- **Rascunho:** 'published' false.

### Consequências
- Maior controle editorial sobre o fluxo de postagens.
- Exigência de ajuste no frontend do blog (Next.js) para filtrar posts agendados e não exibi-los antes do tempo.

---

## ADR-010: Integração de Gerador de Conteúdo IA e Radar Google Trends
**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto
O fluxo de criação de conteúdo era manual e dependia de pesquisas externas de tendências. O usuário desejava centralizar a inteligência de pauta dentro do CMS.

### Decisão
Implementar uma aba "Gerador (IA)" que combina:
1. **Radar Google Trends:** Injeção de widgets oficiais do Google Trends via Iframe dinâmico para monitorar termos do nicho (Crédito, Mercado, etc).
2. **Gerador de Ideias:** Sistema de sugestão de pautas baseado nos pilares da MB Finance.
3. **Escrita Assistida:** Integração com o editor de posts para transformar ideias em rascunhos com um clique.

### Consequências
- Aumento drástico na produtividade editorial.
- Dependência de scripts externos (Google Trends) que podem ter políticas de CORS ou carregamento variável.
- Necessidade de futura expansão da base de prompts/tópicos para manter a relevância das sugestões.

---

## ADR-011: Unificakuo do Canal de Recrutamento (Inhire portal)

**Data:** 2026-04-20
**Status:** Aceita

### Contexto
## ADR-012: Padronização de Links de Recrutamento (Inhire)

**Data:** 2026-04-18
**Status:** Implementado

### Contexto
A MB Finance utiliza um portal externo de recrutamento (Inhire). Houve a necessidade de redirecionar todos os links legados de 'Trabalhe Conosco' que apontavam para âncoras internas (#vagas) ou caminhos relativos inexistentes.

### Decisão
Substituir todas as referências ao link de recrutamento nos rodapés (Next.js e HTML Legado) pela URL absoluta: `https://mbfinance.inhire.app/vagas`.

### Consequências
- Fluxo de candidatos centralizado no portal oficial.
- Eliminação de links quebrados em páginas secundárias.
- Recuperação estrutural da página de Termos de Uso (que apresentava corrupção de markup no rodapé).

## ADR-013: Arquitetura de Isolamento de Abas (Admin Dashboard)

**Data:** 2026-04-22
**Status:** Implementado

### Contexto
Após a modularização do `blog-admin.html`, as seções administrativas (Métricas, Blog, Newsletter, etc.) estavam sendo renderizadas simultaneamente ou sobrepostas, causando confusão visual e falhas na interação ("tudo misturado").

### Decisão
Implementar um padrão de **Single Page Application (SPA)** simplificado usando CSS e JS:
1. **Container Mestre:** Criar um `#admin-body` que envolve todas as telas.
2. **Abas Isoladas:** Cada seção administrativa deve ser um filho direto de `#admin-body` com a classe `.admin-screen`.
3. **Lógica Visual:**
   - `.admin-screen { display: none; }`
   - `.admin-screen.active { display: block; }` (ou `flex` para posts).
4. **Orquestração:** O `admin-core.js` gerencia a alternância de classes `active` tanto nos containers de tela quanto nos botões de navegação.

### Consequências
- **Positivas:** Isolamento total entre funcionalidades; navegação limpa e previsível; facilidade para adicionar novas telas.
- **Negativas:** Requer cuidado extra com o balanço de tags `div` durante refatorações.

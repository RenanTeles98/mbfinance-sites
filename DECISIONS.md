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

---

## ADR-014: Meta Pixel carregado no head da home principal

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
O dono do projeto solicitou a instalacao do Pixel do Facebook/Meta para mensuracao de trafego e campanhas na home principal do site.

### Decisao
Inserir o snippet oficial do Meta Pixel diretamente no `<head>` de `public/mb-finance-completo.html`, junto dos scripts de mensuracao ja existentes.

### Alternativas Consideradas
- **Criar arquivo JS externo em `public/assets/`:** manteria o padrao modular, mas o snippet de pixel e normalmente fornecido para carregamento no head e precisava ser instalado de forma direta.
- **Usar Tag Manager:** mais flexivel para marketing, mas adicionaria uma dependencia que nao foi solicitada nesta tarefa.

### Consequencias
- O evento `PageView` passa a ser enviado para o pixel `1303767088303655`.
- A validacao final depende do deploy e da checagem no Meta Pixel Helper ou Gerenciador de Eventos.

---

## ADR-015: Meta Pixel unico distribuido nas paginas publicas

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
A instalacao inicial do Meta Pixel cobria apenas a home. Para mensuracao correta de trafego, remarketing e jornadas que entram direto em blog, paginas secundarias ou artigos, o mesmo Pixel precisa estar nas paginas publicas relevantes.

### Decisao
Usar um unico Pixel (`1303767088303655`) em todo o site publico. Nos HTMLs estaticos, o carregamento foi centralizado em `public/assets/js/infra/meta-pixel.js`. Nas rotas Next.js publicas, foi criado o componente `components/MetaPixel.tsx` e aplicado em `/blog`, `/blog/[slug]` e `/sobre`.

### Alternativas Consideradas
- **Criar um Pixel por pagina:** descartado porque fragmentaria os dados e dificultaria otimizacao de campanhas.
- **Colocar o Pixel no layout global do Next.js:** mais simples, mas tambem rastrearia `/admin`, o que poderia poluir dados com acessos administrativos.

### Consequencias
- O mesmo Pixel coleta `PageView` nas paginas publicas relevantes.
- O painel administrativo legado (`blog-admin.html`) ficou fora do rastreamento por decisao intencional.
- Eventos de conversao em CTAs de WhatsApp continuam como proxima melhoria.

---

## ADR-016: Google Ads tag distribuida nas paginas publicas

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
O dono do projeto solicitou a instalacao da Google tag `AW-18112641661` para mensuracao de campanhas do Google Ads.

### Decisao
Aplicar a Google tag nas paginas publicas relevantes usando um arquivo central para HTMLs estaticos (`public/assets/js/infra/google-ads-tag.js`) e um componente React para rotas Next.js publicas (`components/GoogleAdsTag.tsx`).

### Alternativas Consideradas
- **Inserir o snippet inline em cada pagina:** mais direto, mas criaria duplicacao e dificultaria manutencao.
- **Colocar no layout global do Next.js:** mais simples para rotas Next, mas rastrearia `/admin`, o que poderia contaminar metricas de campanha.

### Consequencias
- A tag `AW-18112641661` passa a carregar nas paginas publicas relevantes.
- O painel administrativo continua fora do rastreamento.
- Eventos de conversao de WhatsApp ficam como proxima melhoria.

---

## ADR-017: CSP permite dominios necessarios da Google tag e Google Ads

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
A Google tag `AW-18112641661` foi instalada, mas o Tag Assistant exibiu alerta de Content Security Policy bloqueando scripts/conexoes do Google.

### Decisao
Atualizar a CSP em `vercel.json` para permitir scripts, conexoes e frames necessarios de Google Tag, Google Analytics, Google Ads e DoubleClick, mantendo `object-src 'none'` e escopo restrito aos dominios necessarios.

### Alternativas Consideradas
- **Remover a CSP:** resolveria o alerta, mas reduziria a seguranca do site.
- **Liberar `https:` genericamente em scripts/conexoes:** mais permissivo do que necessario.
- **Liberar dominios especificos (escolhida):** mantem protecao e permite funcionamento das tags.

### Consequencias
- Tag Assistant e Google Ads passam a ter permissao de carregar scripts/conexoes necessarios.
- A politica continua restritiva para fontes nao listadas.

---

## ADR-018: CSP permite dominios necessarios do Meta Pixel

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
A CSP foi ampliada para Google Ads, mas ainda nao permitia explicitamente `connect.facebook.net`, dominio que carrega o `fbevents.js` do Meta Pixel. Isso fez o Meta Pixel Helper deixar de encontrar o pixel.

### Decisao
Adicionar `https://connect.facebook.net` em `script-src` e `connect-src`, alem de `https://www.facebook.com` em `connect-src`, mantendo a CSP restritiva para origens nao listadas.

### Alternativas Consideradas
- **Remover a CSP:** resolveria o bloqueio, mas reduziria a seguranca do site.
- **Liberar todos os scripts externos com `https:`:** desnecessariamente amplo.
- **Liberar dominios especificos do Meta (escolhida):** corrige o Pixel mantendo a politica controlada.

### Consequencias
- O Meta Pixel pode carregar o `fbevents.js` e enviar eventos novamente.
- A CSP continua controlada por lista de dominios autorizados.

---

## ADR-019: Home usa snippet oficial inline do Meta Pixel

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
Mesmo com o arquivo central do Meta Pixel publicado e a CSP corrigida, o Meta Pixel Helper do navegador do dono continuou sem detectar o pixel na home.

### Decisao
Restaurar o snippet oficial inline do Meta Pixel diretamente no `<head>` da home (`public/mb-finance-completo.html`), mantendo o arquivo central para as demais paginas publicas.

### Alternativas Consideradas
- **Manter apenas o arquivo central:** tecnicamente correto, mas nao resolveu a validacao pratica do Pixel Helper na home.
- **Aplicar inline em todas as paginas:** aumentaria duplicacao desnecessaria.
- **Inline apenas na home (escolhida):** preserva compatibilidade na pagina mais critica e mantem manutencao centralizada nas demais.

### Consequencias
- A home volta ao formato oficial reconhecido anteriormente pelo Meta Pixel Helper.
- As demais paginas continuam usando o arquivo central `meta-pixel.js`.

---

## ADR-020: Blog legado usa snippet oficial inline do Meta Pixel

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
O Meta Pixel Helper nao detectou o Pixel na pagina legada do blog (`public/pages/blog.html`), que ainda usava o arquivo central `public/assets/js/infra/meta-pixel.js`. Essa pagina e a que aparece no navegador do dono com o hero "Inteligencia financeira para o seu negocio crescer".

### Decisao
Substituir o carregamento externo do Meta Pixel em `public/pages/blog.html` pelo snippet oficial inline diretamente no `<head>`, mantendo a Google Ads tag externa.

### Alternativas Consideradas
- **Manter apenas o arquivo central:** tecnicamente reutilizavel, mas nao resolveu a validacao pratica no Pixel Helper.
- **Migrar o blog legado para Next.js agora:** escopo maior do que a correcao necessaria.
- **Inline apenas no blog legado (escolhida):** corrige a pagina validada pelo dono com alteracao pequena e controlada.

### Consequencias
- O blog legado passa a seguir o mesmo padrao de compatibilidade adotado na home.
- Continua existindo alguma duplicacao do snippet oficial, aceita temporariamente para garantir rastreamento nas paginas criticas.

---

## ADR-021: Raiz do site carrega tags antes do redirecionamento

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
O resumo de cobertura do Google Tag mostrava `mbfinance-sites.vercel.app/` como "Sem tag", embora `/mb-finance-completo.html` estivesse com tag. A causa era a rota raiz do Next.js usar `redirect()` server-side puro, que nao entregava HTML com scripts de mensuracao.

### Decisao
Substituir o redirect server-side por uma pagina ponte em `app/page.tsx`, carregando `GoogleAdsTag` e `MetaPixel` e redirecionando automaticamente para `/mb-finance-completo.html` apos um curto intervalo.

### Alternativas Consideradas
- **Manter o redirect server-side:** rapido para o usuario, mas mantinha `/` sem tag na cobertura.
- **Migrar a home HTML para Next.js agora:** resolveria estruturalmente, mas seria escopo maior e mais arriscado.
- **Pagina ponte com tags (escolhida):** corrige a cobertura da raiz com alteracao pequena.

### Consequencias
- A raiz `/` passa a ter tags detectaveis antes de enviar o visitante para a home.
- O visitante pode ver uma tela rapida de "Redirecionando para o site..." por menos de um segundo.

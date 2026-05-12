# DECISIONS.md Ã¢â‚¬â€ Registro de DecisÃƒÂµes TÃƒÂ©cnicas

> Cada decisÃƒÂ£o importante fica registrada aqui com contexto e alternativas.
> Formato: ADR (Architecture Decision Record)

---

## ADR-001: HTML estÃƒÂ¡tico como pÃƒÂ¡gina principal em vez de migrar tudo para Next.js

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O site nasceu como HTML puro. Migrar tudo de uma vez para Next.js seria arriscado e desnecessÃƒÂ¡rio para o estÃƒÂ¡gio atual do projeto.

### DecisÃƒÂ£o

Manter a home em HTML estÃƒÂ¡tico (`public/mb-finance-completo.html`) e adotar a estratÃƒÂ©gia **Strangler Fig**: migrar gradualmente para Next.js conforme a necessidade surgir.

### Alternativas Consideradas

- **MigraÃƒÂ§ÃƒÂ£o total para Next.js:** unificaria a base, mas com alto risco e esforÃƒÂ§o desproporcional
- **Strangler Fig (escolhida):** permite evoluÃƒÂ§ÃƒÂ£o incremental com risco controlado

### ConsequÃƒÂªncias

- O site continua no ar durante a evoluÃƒÂ§ÃƒÂ£o
- Dois padrÃƒÂµes coexistem temporariamente (HTML legado + Next.js)

---

## ADR-002: Clean Architecture no JavaScript do HTML legado

**Data:** 2026-04-14
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O `mb-finance-completo.html` tinha estilos e scripts inline demais, dificultando manutenÃƒÂ§ÃƒÂ£o e reaproveitamento.

### DecisÃƒÂ£o

Extrair CSS e JS do HTML, organizando o JavaScript em `infra/`, `use-cases/` e `ui/` dentro de `public/assets/`.

### Alternativas Consideradas

- **Bundler com mÃƒÂ³dulos ES:** mais robusto, mas com complexidade desnecessÃƒÂ¡ria para o estÃƒÂ¡gio atual
- **Arquivos separados por responsabilidade (escolhida):** simples, sem build step e suficiente para o volume atual

### ConsequÃƒÂªncias

- HTML mais limpo
- CSS e JS editÃƒÂ¡veis sem voltar a colocar lÃƒÂ³gica inline

---

## ADR-003: Upstash Redis para armazenamento do blog

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O blog precisava de persistÃƒÂªncia compatÃƒÂ­vel com o ambiente serverless da Vercel.

### DecisÃƒÂ£o

Usar Upstash Redis (Vercel KV) em produÃƒÂ§ÃƒÂ£o, com fallback para JSON local em desenvolvimento.

### ConsequÃƒÂªncias

- SoluÃƒÂ§ÃƒÂ£o simples e suficiente para o volume atual de posts

---

## ADR-004: Vercel como plataforma de deploy

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

O projeto precisa de hospedagem compatÃƒÂ­vel com Next.js, pÃƒÂ¡ginas estÃƒÂ¡ticas e deploy contÃƒÂ­nuo simples.

### DecisÃƒÂ£o

Deploy no Vercel com CI/CD automÃƒÂ¡tico via push para `master`.

### ConsequÃƒÂªncias

- Push para `master` gera deploy automÃƒÂ¡tico
- Rollback fica disponÃƒÂ­vel no painel da Vercel

---

## ADR-005: Google Sheets como CRM de leads (via Apps Script)

**Data:** 2026-04-14
**Status:** Aceita

### Contexto

Os leads precisavam cair em uma ferramenta simples e acessÃƒÂ­vel ao dono do projeto.

### DecisÃƒÂ£o

Enviar leads para Google Sheets via Google Apps Script, com fallback local em `localStorage`.

### ConsequÃƒÂªncias

- OperaÃƒÂ§ÃƒÂ£o simples para o dono
- Menos complexidade do que introduzir um CRM completo

---

## ADR-006: Ajustes visuais pontuais nas pÃƒÂ¡ginas legais permanecem locais atÃƒÂ© a refatoraÃƒÂ§ÃƒÂ£o

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

As pÃƒÂ¡ginas legais ainda usam CSS local no prÃƒÂ³prio HTML. Surgiu uma demanda pequena e imediata para aumentar a opacidade do texto auxiliar do hero em `public/pages/termos-de-uso.html` e `public/pages/politica-de-privacidade.html`.

### DecisÃƒÂ£o

Aplicar o ajuste visual diretamente no CSS local existente dessas pÃƒÂ¡ginas, sem ampliar o escopo para a refatoraÃƒÂ§ÃƒÂ£o estrutural completa nesta sessÃƒÂ£o.

### Alternativas Consideradas

- **Extrair CSS agora para `public/assets/`:** mais alinhado ao padrÃƒÂ£o final, mas desproporcional para um ajuste pontual
- **Ajuste local no arquivo atual (escolhida):** resolve imediatamente com risco baixo e sem mexer na arquitetura

### ConsequÃƒÂªncias

- MantÃƒÂ©m rapidez para correÃƒÂ§ÃƒÂµes visuais pequenas nas pÃƒÂ¡ginas legais legadas
- A refatoraÃƒÂ§ÃƒÂ£o completa dessas pÃƒÂ¡ginas continua pendente

---

## ADR-007: O bloco "Escala" da timeline do Sobre volta ao eixo visual padrÃƒÂ£o

**Data:** 2026-04-15
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

No bloco `Escala` (`2020-2022`) da timeline em `public/pages/sobre.html`, o texto estava no lado oposto do ÃƒÂ­cone e o checkpoint havia sido deslocado para baixo da linha horizontal, criando desalinhamento visual em relaÃƒÂ§ÃƒÂ£o aos demais marcos.

### DecisÃƒÂ£o

Recolocar o bloco `Escala` no fluxo padrÃƒÂ£o da timeline: conteÃƒÂºdo ÃƒÂ  esquerda, ÃƒÂ­cone ÃƒÂ  direita e checkpoint alinhado novamente ao eixo horizontal principal.

### Alternativas Consideradas

- **Manter o layout invertido e ajustar sÃƒÂ³ o checkpoint:** corrigiria parcialmente o problema, mas preservaria um padrÃƒÂ£o inconsistente no bloco
- **Voltar ao layout padrÃƒÂ£o (escolhida):** simplifica a composiÃƒÂ§ÃƒÂ£o e melhora a leitura visual da sequÃƒÂªncia

### ConsequÃƒÂªncias

- O bloco `Escala` fica consistente com a linguagem visual dos outros marcos da timeline
- O eixo da timeline volta a parecer contÃƒÂ­nuo e intencional

---

## ADR-008: SimplificaÃƒÂ§ÃƒÂ£o do Menu Administrativo do Blog

**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto

O menu administrativo do blog (`public/pages/blog-admin.html`) continha as seÃƒÂ§ÃƒÂµes "Podcast" e "Banners". "Podcast" ainda era um placeholder ("Em breve") e "Banners" causava certa confusÃƒÂ£o semÃƒÂ¢ntica.

### DecisÃƒÂ£o

Remover o item "Podcast" e renomear "Banners" para "Publicidade" para melhor alinhamento com a finalidade de gerenciar slots de anÃƒÂºncios.

### ConsequÃƒÂªncias

- Menu mais limpo e focado no conteÃƒÂºdo atual.
- Melhor clareza sobre a funcionalidade de gerenciamento de anÃƒÂºncios.


---

## ADR-009: ImplementaÃ§Ã£o do CalendÃ¡rio Editorial e Status de Agendamento
**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto
O usuÃ¡rio precisava de uma forma visual de planejar o conteÃºdo mensal do blog e agendar posts para datas e horÃ¡rios futuros para automaÃ§Ã£o.

### DecisÃ£o
Implementar uma aba de **CalendÃ¡rio Editorial** (visÃ£o de matriz mensal) no painel administrativo e expandir o schema de posts para incluir um campo 'time'. Implementar uma lÃ³gica de status baseada na data atual:
- **Publicado:** Data no passado e 'published' true.
- **Agendado:** Data no futuro e 'published' true.
- **Rascunho:** 'published' false.

### ConsequÃªncias
- Maior controle editorial sobre o fluxo de postagens.
- ExigÃªncia de ajuste no frontend do blog (Next.js) para filtrar posts agendados e nÃ£o exibi-los antes do tempo.

---

## ADR-010: IntegraÃ§Ã£o de Gerador de ConteÃºdo IA e Radar Google Trends
**Data:** 2026-04-20
**Status:** Aceita
**Decisores:** Dono do projeto + IA

### Contexto
O fluxo de criaÃ§Ã£o de conteÃºdo era manual e dependia de pesquisas externas de tendÃªncias. O usuÃ¡rio desejava centralizar a inteligÃªncia de pauta dentro do CMS.

### DecisÃ£o
Implementar uma aba "Gerador (IA)" que combina:
1. **Radar Google Trends:** InjeÃ§Ã£o de widgets oficiais do Google Trends via Iframe dinÃ¢mico para monitorar termos do nicho (CrÃ©dito, Mercado, etc).
2. **Gerador de Ideias:** Sistema de sugestÃ£o de pautas baseado nos pilares da MB Finance.
3. **Escrita Assistida:** IntegraÃ§Ã£o com o editor de posts para transformar ideias em rascunhos com um clique.

### ConsequÃªncias
- Aumento drÃ¡stico na produtividade editorial.
- DependÃªncia de scripts externos (Google Trends) que podem ter polÃ­ticas de CORS ou carregamento variÃ¡vel.
- Necessidade de futura expansÃ£o da base de prompts/tÃ³picos para manter a relevÃ¢ncia das sugestÃµes.

---

## ADR-011: Unificakuo do Canal de Recrutamento (Inhire portal)

**Data:** 2026-04-20
**Status:** Aceita

### Contexto
## ADR-012: PadronizaÃ§Ã£o de Links de Recrutamento (Inhire)

**Data:** 2026-04-18
**Status:** Implementado

### Contexto
A MB Finance utiliza um portal externo de recrutamento (Inhire). Houve a necessidade de redirecionar todos os links legados de 'Trabalhe Conosco' que apontavam para Ã¢ncoras internas (#vagas) ou caminhos relativos inexistentes.

### DecisÃ£o
Substituir todas as referÃªncias ao link de recrutamento nos rodapÃ©s (Next.js e HTML Legado) pela URL absoluta: `https://mbfinance.inhire.app/vagas`.

### ConsequÃªncias
- Fluxo de candidatos centralizado no portal oficial.
- EliminaÃ§Ã£o de links quebrados em pÃ¡ginas secundÃ¡rias.
- RecuperaÃ§Ã£o estrutural da pÃ¡gina de Termos de Uso (que apresentava corrupÃ§Ã£o de markup no rodapÃ©).

## ADR-013: Arquitetura de Isolamento de Abas (Admin Dashboard)

**Data:** 2026-04-22
**Status:** Implementado

### Contexto
ApÃ³s a modularizaÃ§Ã£o do `blog-admin.html`, as seÃ§Ãµes administrativas (MÃ©tricas, Blog, Newsletter, etc.) estavam sendo renderizadas simultaneamente ou sobrepostas, causando confusÃ£o visual e falhas na interaÃ§Ã£o ("tudo misturado").

### DecisÃ£o
Implementar um padrÃ£o de **Single Page Application (SPA)** simplificado usando CSS e JS:
1. **Container Mestre:** Criar um `#admin-body` que envolve todas as telas.
2. **Abas Isoladas:** Cada seÃ§Ã£o administrativa deve ser um filho direto de `#admin-body` com a classe `.admin-screen`.
3. **LÃ³gica Visual:**
   - `.admin-screen { display: none; }`
   - `.admin-screen.active { display: block; }` (ou `flex` para posts).
4. **OrquestraÃ§Ã£o:** O `admin-core.js` gerencia a alternÃ¢ncia de classes `active` tanto nos containers de tela quanto nos botÃµes de navegaÃ§Ã£o.

### ConsequÃªncias
- **Positivas:** Isolamento total entre funcionalidades; navegaÃ§Ã£o limpa e previsÃ­vel; facilidade para adicionar novas telas.
- **Negativas:** Requer cuidado extra com o balanÃ§o de tags `div` durante refatoraÃ§Ãµes.

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

---

## ADR-022: Google Tag Manager instalado no site publico

**Data:** 2026-04-27
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto
O dono do projeto solicitou a instalacao do Google Tag Manager com container `GTM-MDST4NTK`, incluindo o script no topo do `<head>` e o bloco `noscript` imediatamente apos a abertura do `<body>`.

### Decisao
Instalar o GTM nos HTMLs publicos e no layout raiz do Next.js. Nos HTMLs estaticos, o snippet foi aplicado diretamente em cada arquivo publico. No Next.js, o snippet foi colocado em `app/layout.tsx` para cobrir as rotas do App Router.

### Alternativas Consideradas
- **Instalar apenas na home:** deixaria blog, artigos e paginas secundarias sem container.
- **Criar arquivo JS central:** nao atenderia a orientacao do Google de colar o snippet diretamente no `<head>` e o `noscript` no `<body>`.
- **Instalar em todas as paginas publicas (escolhida):** garante cobertura de campanhas e validacao pelo Tag Assistant.

### Consequencias
- O container `GTM-MDST4NTK` passa a carregar no site publico.
- `public/pages/blog-admin.html` permanece sem GTM para evitar metricas administrativas no HTML legado.
- O container deve ser validado pelo Tag Assistant apos deploy.
---

## ADR-016: Blog separado em subdominio Vercel

**Data:** 2026-05-05
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto

O site institucional foi publicado via Cpanel como arquivos estaticos. O blog, porem, depende de APIs, painel administrativo e persistencia para atualizacao frequente de conteudo, o que torna o Cpanel inadequado para a operacao diaria.

### Decisao

Criar um projeto separado em `blog-pages/` para hospedar o blog na Vercel, usando o subdominio oficial `https://blog.mbfinance.com.br`. O site estatico no Cpanel passa a apontar seus links de BLOG para esse subdominio, e a antiga URL `public/pages/blog.html` vira uma pagina de redirecionamento com `noindex, follow`.

### Alternativas Consideradas

- **Manter blog estatico no Cpanel:** exigiria exportacao manual a cada publicacao e aumentaria o risco operacional.
- **Migrar o site inteiro para Vercel agora:** unificaria a plataforma, mas ampliaria o escopo e nao era necessario para resolver o problema imediato.
- **Blog em subdominio na Vercel (escolhida):** preserva o site no Cpanel e deixa o blog/admin no ambiente adequado para API e atualizacao diaria.

### Consequencias

- O blog passa a ter sitemap proprio em `https://blog.mbfinance.com.br/sitemap.xml`.
- O Google deve tratar o blog como subdominio; sera necessario cadastrar o subdominio no Search Console.
- Links internos do site institucional precisam apontar para `https://blog.mbfinance.com.br/blog`.
- A versao `mbfinance-sites.vercel.app` nao deve ser promovida como URL publica/canonica.

---

## ADR-023: Persistencia do blog usa camada unica com Supabase prioritario

**Data:** 2026-05-05
**Status:** Implementado

### Contexto

O projeto separado do blog precisa publicar posts em producao pela API do Next.js. A rota de sincronizacao ainda dependia diretamente do Upstash Redis, enquanto `lib/blog-store.ts` ja tinha suporte a Supabase.

### Decisao

Centralizar leitura e escrita em `blog-pages/lib/blog-store.ts`. A rota `blog-pages/app/api/blog/sync/route.ts` passa a usar `readBlogPosts` e `writeBlogPosts`, permitindo que o mesmo fluxo grave em Supabase, Redis ou JSON conforme o ambiente.

### Alternativas Consideradas

- **Manter Redis direto no endpoint:** preservaria o comportamento antigo, mas ignoraria a nova persistencia em Supabase.
- **Criar uma segunda implementacao exclusiva para Supabase:** funcionaria, mas duplicaria regras de merge e fallback.
- **Usar a camada unica existente (escolhida):** reduz duplicacao e deixa o endpoint alinhado ao storage oficial do blog.

### Consequencias

- Supabase vira a persistencia prioritaria quando configurado.
- Redis e JSON continuam como fallback.
- A escrita administrativa em Supabase depende de `SUPABASE_SERVICE_ROLE_KEY` configurada no ambiente server-side.

---

## ADR-024: Pasta do projeto do blog sem espaco para deploy na Vercel

**Data:** 2026-05-05
**Status:** Implementado

### Contexto

O deploy do blog na Vercel falhou com `A Serverless Function has an invalid name: "Blog pages/___next_launcher.cjs"`. O espaco no caminho `Blog pages` entrou no nome interno da serverless function.

### Decisao

Usar `blog-pages/` como pasta do projeto do blog para deploy na Vercel.

### Alternativas Consideradas

- **Manter `Blog pages/`:** continuaria sujeito ao erro de nome invalido.
- **Alterar build commands com caminho escapado:** poderia compilar, mas ainda manteria o caminho com espaco no output interno.
- **Pasta sem espaco (escolhida):** remove a causa do erro e simplifica a configuracao da Vercel.

### Consequencias

- O Root Directory da Vercel deve ser `blog-pages`.
- Referencias de documentacao passam a usar `blog-pages/`.

---

## ADR-025: Links de Blog apontam para o subdominio oficial

**Data:** 2026-05-06
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto

O blog passou a operar em `https://blog.mbfinance.com.br/blog`. Algumas paginas estaticas ainda podiam manter links antigos para `/blog`, criando risco de levar o usuario para a rota interna anterior.

### Decisao

Padronizar os links visiveis de Blog no site estatico para `https://blog.mbfinance.com.br/blog`.

### Alternativas Consideradas

- **Manter `/blog`:** dependeria de redirecionamentos internos e poderia apontar para uma rota antiga.
- **Usar URL absoluta do subdominio (escolhida):** garante acesso direto ao blog oficial.

### Consequencias

- Menos ambiguidade entre blog legado, blog Next.js antigo e blog oficial em subdominio.
- Menus publicos passam a levar diretamente ao ambiente oficial do blog.

### Atualizacao 2026-05-06

- O link BLOG da home HTML recebeu identificador `nav-nav-blog` e permanece com URL absoluta.
- A navbar React (`components/Navbar.tsx`) tambem passou a incluir BLOG com URL absoluta para cobrir rotas que usem esse componente.

---

## ADR-026: GA4 usa Measurement ID do dominio mbfinance.com.br

**Data:** 2026-05-07
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto

O Measurement ID antigo do Google Analytics estava vinculado ao site de Vercel. O dominio oficial da MB Finance e `mbfinance.com.br`, e o dono do projeto forneceu o novo snippet GA4 com ID `G-3C1G7JNB9L`.

### Decisao

Substituir o ID antigo `G-16ZB759EFL` por `G-3C1G7JNB9L` nos pontos publicos de GA4. Nas paginas que usam o banner LGPD, manter o carregamento condicional via `cookie-banner.js`/`bundle.js`, apenas trocando o ID carregado.

### Alternativas Consideradas

- **Colar o snippet direto em todas as paginas:** simples, mas quebraria o bloqueio de analytics antes do consentimento em paginas que usam LGPD.
- **Trocar somente os snippets diretos:** deixaria paginas com `window._ga4_id` e carregador central ainda apontando para o ID antigo.
- **Trocar o ID em todos os pontos de GA4 mantendo a arquitetura atual (escolhida):** preserva LGPD e atualiza a propriedade correta.

### Consequencias

- Eventos de GA4 passam a ser enviados para `G-3C1G7JNB9L` apos aceite de cookies.
- Google Ads e GTM continuam com seus IDs atuais.


---

## ADR-027: Tags de marketing centralizadas no Google Tag Manager

**Data:** 2026-05-12
**Status:** Implementado
**Decisores:** Dono do projeto + IA

### Contexto

O site tinha Meta Pixel, Google Analytics 4, Google Ads e Google Tag Manager instalados diretamente em diferentes pontos do codigo. Isso dificultava manutencao, remocao e inclusao de novas tags.

### Decisao

Manter apenas o Google Tag Manager `GTM-MDST4NTK` como codigo de marketing carregado diretamente no site. GA4, Google Ads e Meta Pixel devem ser criados e gerenciados dentro do container do GTM.

### Alternativas Consideradas

- **Manter tags diretas no codigo:** funcionava, mas continuava gerando duplicacao e manutencao manual.
- **Usar apenas arquivos JS centrais:** reduziria duplicacao, mas ainda exigiria deploy para qualquer mudanca de marketing.
- **Centralizar no GTM (escolhida):** permite adicionar, pausar e alterar tags sem editar o codigo fonte do site.

### Consequencias

- O codigo fonte fica mais simples e com menor risco de tags duplicadas.
- Mudancas de marketing passam a depender da publicacao do container no GTM.
- A CSP deve continuar permitindo os dominios das tags que o GTM dispara.
- O banner LGPD passa a enviar o status de consentimento para `dataLayer`, para uso nas regras do GTM.

# Contexto do Projeto

## Sessao de 2026-05-26 - Produtos reais na sidebar do blog

Foi alinhada a barra lateral de produtos da capa `/blog` com os produtos exibidos no site principal.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: a sidebar passou a listar Conta Corrente Empresarial, Maquina de Cartao, Seguros e Consorcios, Credito Rapido, Solucoes Tributarias, Telemedicina e Solucoes Personalizadas, alem de Todos.
- `app/api/analytics/gsc/route.ts`: removido parametro nao usado do GET para o build passar.
- `components/PostEngagement.tsx`: removido setter nao usado de comentarios para o build passar.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-26.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A sidebar usa os nomes e descricoes dos produtos do site principal.
- Produtos sem categoria editorial dedicada mantem a listagem geral para evitar tela vazia.
- A sidebar continua com comportamento sticky no desktop.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar no site publicado se a sidebar acompanha o scroll e se os produtos batem com a secao oficial do site principal.

## Sessão de 2026-05-05

Foi aplicada a auditoria editorial do Blog MB Finance.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: correção de acentuação na home do blog, filtros, newsletter e rodapé.
- `app/blog/page.tsx`: correção de metadados da página do blog.
- `app/layout.tsx`: correção de metadados globais.
- `app/blog/[slug]/page.tsx`: metadados de artigo, autor, schema `BlogPosting`, CTAs personalizados, links relacionados e enriquecimento idempotente de conteúdo por slug.
- `content/blog-posts.json`: enriquecimento editorial dos 5 artigos com links internos, exemplo numérico, nuance tributária, fontes externas, FAQ e pull quote.
- `types/blog.ts`: inclusão da categoria `gestao-tributaria`.
- `public/assets/js/admin/admin-blog.js`: correção de textos visíveis em alertas do admin.
- `public/assets/js/admin/admin-analytics.js`: correção de textos visíveis no analytics do admin.
- `.gitignore`: inclusão dos logs locais `.next-dev*.log`.

Estado atual:
- O build de produção passa com sucesso.
- Restam apenas avisos já existentes do Next sobre uso de `<img>` em vez de `next/image`.
- Os arquivos obrigatórios de contexto não existiam no checkout e foram criados nesta sessão.
- Commit `819a534` (`Apply blog audit fixes`) enviado para `origin/master`.
- Deploy manual na Vercel ficou bloqueado porque a CLI local não possui credenciais válidas e não há projeto `.vercel` linkado nesta pasta.

Onde o trabalho parou:
- Correções do relatório foram aplicadas no código e no conteúdo versionado.
- Não foi feita sincronização manual com Supabase/KV.

Próximo passo recomendado:
- Refazer `vercel login` ou fornecer um token válido para executar `vercel --prod --yes`.
- Se o ambiente de produção estiver lendo Supabase/KV, executar o fluxo de sincronização/publicação usado pelo projeto para enviar `content/blog-posts.json` atualizado ao storage ativo.
# Contexto do Projeto

## Sessao de 2026-05-05 - Analytics multisite

Foi corrigido o carregamento de metricas do GA4 no painel admin e preparada a consulta para multiplos sites da empresa.

Arquivos modificados:
- `lib/ga4.ts`: adicionada resolucao de propriedades GA4 por site, suporte a `GA4_SITES` em JSON e variaveis especificas por chave de site.
- `app/api/analytics/overview/route.ts`: endpoint passa a aceitar `?site=` e retorna a lista de sites disponiveis/configurados.
- `public/assets/js/admin/admin-state.js`: adicionada chave de estado para o site selecionado no analytics.
- `public/assets/js/admin/admin-analytics.js`: corrigida a URL da API para usar a base do painel, nao o dominio publico do site, e adicionada troca de site.
- `public/pages/blog-admin.html`: adicionado seletor de site na tela "Metricas do site".

Estado atual:
- O painel volta a consultar `/api/analytics/overview` no app Next correto, evitando a quebra causada por `mb_site_domain`.
- O seletor exibe `MB Finance`, `MB Negocios` e `Fomenta`.
- `MB Finance` continua compativel com as variaveis atuais `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL` e `GA4_PRIVATE_KEY`.
- Outros sites ficam prontos para ativacao quando suas propriedades GA4 forem adicionadas ao ambiente.
- `npm run build` passou com sucesso, mantendo apenas avisos ja existentes sobre `<img>` no Next.

Onde o trabalho parou:
- Codigo e UI estao prontos para multisite.
- Ainda nao foram configurados os IDs reais das propriedades GA4 dos outros bracos no ambiente.

Proximo passo recomendado:
- Configurar as variaveis de ambiente dos outros sites na Vercel e confirmar que a service account tem acesso de leitura em cada propriedade GA4.
## Sessao de 2026-05-06 - Ajustes de CLS da home

Foram aplicados ajustes estruturais na home principal para reduzir causas de Cumulative Layout Shift apontadas pelo PageSpeed.

Arquivos modificados:
- `../public/mb-finance-completo.html`: adicionadas dimensoes explicitas em logos/imagens principais e carregamento direto do CSS do banner de cookies.
- `../public/assets/css/main.css`: adicionadas reservas de layout para hero, logo e contadores animados; ajustado fallback de fontes para reduzir shift na troca de fonte.
- `../public/assets/js/bundle.js`: evitada troca repetida do `src` do logo quando o navbar atualiza no scroll/hover.
- `../public/assets/js/ui/navbar.js`: mantida a mesma correcao no arquivo fonte do navbar.

Estado atual:
- Hero tem altura estavel com `100svh`.
- Contadores do topo reservam largura antes da animacao numerica.
- Logos possuem largura/altura fixas para evitar deslocamento horizontal enquanto carregam ou trocam de variante.
- Imagens principais abaixo da dobra possuem `width`/`height` declarados.
- `npm run build` na raiz do projeto principal passou com sucesso.

Onde o trabalho parou:
- Ajustes de CLS foram aplicados no codigo local.
- Ainda falta publicar e rodar o PageSpeed novamente para medir o efeito real em producao.

Proximo passo recomendado:
- Fazer deploy e rodar PageSpeed novamente na URL publica para verificar se o CLS caiu abaixo de 0,1.

## Sessao de 2026-05-06 - Ajustes de CLS do blog

Foram aplicados ajustes estruturais no indice do blog para reduzir o Cumulative Layout Shift apontado pelo PageSpeed.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: adicionadas reservas de altura no hero do blog, dimensoes estaveis para logo e largura minima para metadados como tempo de leitura.
- `app/globals.css`: ajustado fallback global de fontes e controle de ajuste automatico de texto.

Estado atual:
- O hero do blog reserva altura antes do carregamento completo de fontes/conteudo.
- O texto "8 min" e demais metadados usam largura minima e numerais tabulares para reduzir deslocamento durante troca de fonte.
- A logo do blog declara largura/altura e tem espaco reservado no header.
- `npm run build` passou com sucesso.
- Permanecem avisos ja existentes do Next sobre uso de `<img>` em vez de `next/image`.

Onde o trabalho parou:
- Correcoes de CLS do blog foram aplicadas no codigo local.
- Ainda falta publicar e rodar PageSpeed novamente na URL publica para confirmar a reducao real do CLS.

Proximo passo recomendado:
- Publicar as alteracoes do blog e executar novo PageSpeed na pagina analisada.

## Sessao de 2026-05-06 - Agrupamento de paginas no GA4

Foi ajustado o tratamento das paginas mais acessadas do painel para reduzir duplicidades vindas do GA4.

Arquivos modificados:
- `lib/ga4.ts`: adicionada normalizacao de caminhos de pagina, agrupamento de URLs equivalentes e soma das metricas antes de retornar o top 10.

Estado atual:
- Caminhos como `/`, `/index.html` e `/mb-finance-completo.html` passam a ser tratados como a mesma pagina inicial.
- Sufixo `.html`, query string e hash sao removidos para evitar duplicidade visual no painel.
- A consulta do GA4 busca ate 50 linhas antes do agrupamento, preservando volume suficiente para montar o top 10 final.
- `npm run build` passou com sucesso.
- Permanecem avisos ja existentes do Next sobre uso de `<img>` em vez de `next/image`.

Onde o trabalho parou:
- A correcao esta aplicada localmente e pronta para commit/deploy no repositorio do blog.

Proximo passo recomendado:
- Publicar a alteracao e conferir no painel se as paginas duplicadas foram consolidadas.

## Sessao de 2026-05-06 - Eventos GTM e conversoes

Foram adicionados eventos padronizados no `dataLayer` para o Google Tag Manager medir interacoes do blog e da pagina principal.

Arquivos modificados:
- `components/AnalyticsTracker.tsx`: novo rastreador global do blog para cliques, scroll e eventos do `dataLayer`.
- `app/layout.tsx`: inclusao do rastreador global no layout do blog.
- `components/BlogIndexClient.tsx`: eventos para busca no blog, newsletter e cliques em posts.
- `components/NewsletterSignup.tsx`: evento de inscricao na newsletter em artigos.
- `app/blog/[slug]/page.tsx`: marcacao de CTA de artigo.
- `../public/assets/js/analytics-events.js`: rastreador equivalente para a pagina principal estatica.
- `../public/mb-finance-completo.html`: carregamento do rastreador de eventos da pagina principal.

Estado atual:
- O blog envia eventos `whatsapp_click`, `cta_click`, `newsletter_submit`, `blog_search`, `blog_post_click`, `scroll_depth` e `sign_up`.
- A pagina principal envia `cta_click`, `lead_modal_open`, `generate_lead`, `whatsapp_click`, `newsletter_submit`, `blog_post_click` e `scroll_depth`.
- `npm run build` em `blog-pages` passou com sucesso.
- `node --check public/assets/js/analytics-events.js` passou com sucesso na raiz.

Onde o trabalho parou:
- Codigo local pronto para commit/deploy no repositorio do blog.
- Ainda falta criar no GTM as tags GA4 baseadas nesses eventos personalizados e marcar `generate_lead` como conversao/key event no GA4.

Proximo passo recomendado:
- Publicar o codigo e configurar as tags GA4 Event no GTM para cada evento do `dataLayer`.

## Sessao de 2026-05-25 - Correcao das telas em branco do admin

Foi corrigida a causa raiz da area cinza/vazia em `https://blog.mbfinance.com.br/admin`.

Arquivos modificados:
- `private/blog-admin.html`: corrigido o aninhamento de `div`s no bloco do editor do Blog, fechando corretamente `post-form`, `editor-panel` e `blog-section-posts` antes das demais telas administrativas.

Estado atual:
- `#screen-analytics`, `#screen-campaigns`, `#screen-newsletter`, `#screen-banners`, `#screen-calendar` e `#screen-generator` voltaram a ser filhos diretos de `#admin-body`.
- O problema nao era cache da Vercel, CSS de altura ou chamada duplicada de `init()`: as telas estavam dentro de `#screen-posts`, que fica com `display:none` quando a aba Blog nao esta ativa.
- `npm run build` em `blog-pages` passou com sucesso.
- Permanecem apenas avisos preexistentes do Next sobre uso de `<img>` em vez de `next/image`.

Onde o trabalho parou:
- Correcao aplicada localmente e pronta para commit/push no projeto Vercel `blog-mbfinace`.

Proximo passo recomendado:
- Publicar e validar em producao que a aba "Metricas do site" mostra o H2 e os cards imediatamente abaixo das abas.

## Sessao de 2026-05-25 - Icones e espacamentos do admin

Foram refinados os botoes e textos com icones da interface administrativa, com foco inicial na tela "Campanhas".

Arquivos modificados:
- `private/blog-admin.html`: substituidos emojis de copiar, salvar e atualizar por SVGs lineares; ajustados `gap`, alinhamento, altura minima e estados de botoes no admin.
- `public/assets/js/admin/admin-campaigns.js`: adicionados helpers para renderizar botoes com icones SVG e preservar o alinhamento apos acoes de copiar/salvar.

Estado atual:
- A tela "Campanhas" nao usa mais emojis como icones estruturais nos botoes principais, historico de links e atualizar desempenho.
- Os botoes mantem espacamento consistente entre icone e texto, inclusive durante estados temporarios como "Copiado" e "Salvo".
- `node --check public/assets/js/admin/admin-campaigns.js` passou com sucesso.
- `npm run build` em `blog-pages` passou com sucesso, mantendo apenas avisos preexistentes do Next sobre `<img>`.

Onde o trabalho parou:
- Ajuste visual aplicado localmente e pronto para commit/push no projeto Vercel `blog-mbfinace`.

Proximo passo recomendado:
- Validar visualmente `/admin` em producao na aba "Campanhas" apos o deploy automatico da Vercel.

## Sessao de 2026-05-25 - Seta dos campos select

Foi ajustado o espaçamento da seta dos campos de seleção do admin.

Arquivos modificados:
- `private/blog-admin.html`: adicionado estilo global para `select`, com seta SVG discreta, `padding-right` reservado e posicionamento afastado da borda.

Estado atual:
- As setas dos selects não ficam mais coladas na linha/borda direita.
- O ajuste vale para selects do editor, métricas, campanhas e demais áreas do admin.
- `npm run build` em `blog-pages` passou com sucesso, mantendo apenas avisos preexistentes do Next sobre `<img>`.

Proximo passo recomendado:
- Validar visualmente os selects em `/admin` apos o deploy.

## Sessao de 2026-05-25 - Cliques por link de campanha

Foi adicionada a contagem de cliques dos links encurtados gerados na aba "Campanhas".

Arquivos modificados:
- `app/c/[code]/route.ts`: o redirecionamento de links encurtados registra um clique por codigo antes de enviar o usuario ao destino.
- `app/api/shorten/route.ts`: a API de encurtamento passou a retornar tambem o `code` do link criado.
- `app/api/shorten/stats/route.ts`: nova rota autenticada para o admin buscar os cliques por codigo de link.
- `public/assets/js/admin/admin-campaigns.js`: links salvos agora guardam `shortUrl`, `shortCode`, copiam o link encurtado e carregam a contagem de cliques.
- `private/blog-admin.html`: adicionada a coluna "Cliques" em "Links salvos" e atualizado o cache busting do JS de campanhas.

Estado atual:
- Novos links salvos com URL encurtada passam a exibir a contagem de cliques na lista.
- Links antigos sem `shortCode` aparecem com "—" porque nao ha como vincular o contador retroativamente ao encurtador.
- `node --check public/assets/js/admin/admin-campaigns.js` passou com sucesso.
- `npm run build` em `blog-pages` passou com sucesso, mantendo apenas avisos preexistentes do Next sobre `<img>`.

Proximo passo recomendado:
- Criar um novo link no admin publicado, copiar o link encurtado, abrir em uma aba anonima e confirmar que a coluna "Cliques" sobe apos atualizar a aba.

## Sessao de 2026-05-25 - Persistencia da aba ativa no admin

Foi corrigido o comportamento do admin ao atualizar a pagina com F5.

Arquivos modificados:
- `public/assets/js/admin/admin-core.js`: adicionada persistencia da aba ativa em `localStorage` e no hash da URL.
- `private/blog-admin.html`: atualizado o cache busting do `admin-core.js` para carregar a nova versao.

Estado atual:
- Ao trocar para Campanhas, Blog, E-mails ou Publicidade, a aba fica salva.
- Ao dar F5, o admin restaura a mesma aba em vez de voltar para "Metricas do site".
- A URL tambem passa a indicar a aba, por exemplo `/admin#campaigns`.
- `node --check public/assets/js/admin/admin-core.js` passou com sucesso.
- `npm run build` em `blog-pages` passou com sucesso, mantendo apenas avisos preexistentes do Next sobre `<img>`.

Proximo passo recomendado:
- Validar em producao: abrir `/admin`, entrar em "Campanhas", pressionar F5 e confirmar que a aba permanece.

## Sessao de 2026-05-25 - Confirmacao dupla para excluir links

Foi adicionada uma protecao contra exclusao acidental dos links salvos na aba "Campanhas".

Arquivos modificados:
- `public/assets/js/admin/admin-campaigns.js`: o botao de excluir agora exige dois cliques; o primeiro mostra "Confirmar" e o segundo apaga.
- `private/blog-admin.html`: adicionada classe visual para o estado de confirmacao e atualizado o cache busting do JS de campanhas.

Estado atual:
- Clicar no X nao apaga o link imediatamente.
- O botao muda para "Confirmar" por 4 segundos.
- Se o usuario nao confirmar, o botao volta para X automaticamente.
- `node --check public/assets/js/admin/admin-campaigns.js` passou com sucesso.
- `npm run build` em `blog-pages` passou com sucesso, mantendo apenas avisos preexistentes do Next sobre `<img>`.

Proximo passo recomendado:
- Validar em producao que o link so e apagado apos clicar em X e depois em "Confirmar".

## Sessao de 2026-05-25 - Evolucao da tela Campanhas

Foram adicionadas funcionalidades operacionais na tela "Campanhas e UTMs".

Arquivos modificados:
- `private/blog-admin.html`: adicionados cards de resumo, campos de objetivo/status/notas, filtros da lista, coluna de status e textos menos tecnicos.
- `public/assets/js/admin/admin-campaigns.js`: adicionados resumo de campanhas, filtros, ordenacao, duplicacao de links, status, objetivo, notas e barras proporcionais de cliques.

Estado atual:
- A tela mostra resumo com links criados, cliques totais, link mais clicado e ultimo clique.
- Cada link salvo pode ter objetivo, status e notas internas.
- A lista permite buscar, filtrar por canal/status e ordenar por recentes, mais clicados ou nome.
- O botao duplicar preenche o formulario com os dados do link selecionado.
- A area de trafego por canal usa nomenclaturas mais simples: visitas, pessoas, tipo de canal e nome da campanha.
- `node --check public/assets/js/admin/admin-campaigns.js` passou com sucesso.
- `npm run build` em `blog-pages` passou com sucesso, mantendo avisos preexistentes sobre `<img>`.

Proximo passo recomendado:
- Validar em producao a criacao de um link novo com objetivo/status/notas, filtro na lista e duplicacao.

## Sessao de 2026-05-25 - Blog publico em layout editorial

Foi reorganizada a pagina publica `/blog` com uma estrutura inspirada em portais editoriais como o G1, sem banners de anuncio.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: recriada a composicao da home do blog com barra superior, indicadores, destaques, lista de noticias e sidebar editorial.
- `app/blog/blog.css`: substituido o layout anterior por estilos de portal de noticias, com manchete principal, cards laterais, listagem compacta e responsividade.
- `private/blog-admin.html`: ajustado o grid dos links salvos em Campanhas para dar mais espaco entre colunas, evitando sobreposicao entre canal e status.
- `app/api/news-feed/route.ts`: convertido o iterador de `matchAll` para array para compatibilidade do build TypeScript.

Estado atual:
- A pagina `/blog` ficou mais parecida com uma capa editorial: navegacao compacta, manchete principal, destaques visuais e lista de artigos para leitura continua.
- A tabela de Campanhas ganhou respiro entre colunas e badges longos agora truncam corretamente.
- `npm run build` em `blog-pages` passou com sucesso.
- Permanecem apenas avisos preexistentes do Next sobre `<img>` em `app/blog/[slug]/page.tsx`.

Proximo passo recomendado:
- Validar visualmente `/blog` em desktop e mobile apos o deploy e conferir a tabela de Campanhas no admin publicado.

## Sessao de 2026-05-25 - Hero antiga restaurada no blog

Foi restaurada a hero anterior da pagina publica `/blog`, mantendo a nova organizacao editorial abaixo dela.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: removida a barra superior compacta inspirada em portal e restaurada a hero com logo, voltar ao site, titulo grande, subtitulo e busca.
- `app/blog/blog.css`: restaurados os estilos da hero azul anterior e ajustada a responsividade para combinar com a lista editorial atual.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: contexto da decisao e validacao.

Estado atual:
- `/blog` volta a abrir com a hero visual mais forte da versao anterior.
- A estrutura editorial criada na rodada anterior permanece abaixo da hero.
- `npm run build` em `blog-pages` passou com sucesso.
- Permanecem warnings de `<img>` no logo do blog e na pagina interna de post, sem bloquear build.

Proximo passo recomendado:
- Validar a pagina publicada em desktop e mobile para confirmar que a hero antiga ficou harmonica com a listagem editorial nova.

## Sessao de 2026-05-25 - Cores editoriais alinhadas a marca

Foram removidos os textos vermelhos da capa publica do blog.

Arquivos modificados:
- `app/blog/blog.css`: manchete principal, titulos da lista de artigos e links rapidos da sidebar passaram de vermelho para o azul marinho `#003956`.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao visual.

Estado atual:
- A capa publica do blog usa azul marinho nos textos editoriais principais, alinhando melhor com a identidade MB Finance.
- `npm run build` em `blog-pages` passou com sucesso.
- Permanecem warnings de `<img>` no logo do blog e na pagina interna de post, sem bloquear build.

Proximo passo recomendado:
- Conferir `/blog` publicado para validar contraste e hierarquia visual dos titulos em azul marinho.

## Sessao de 2026-05-25 - Card Mais acessadas no blog

Foi ajustado o card lateral da capa publica do blog para ficar mais editorial.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: o card "Guias rapidos" passou a ser "Mais acessadas" e a lista virou ranking numerado.
- `app/blog/blog.css`: adicionados estilos para o card de ranking com marcador azul, numeracao e alinhamento dos links.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A sidebar do `/blog` apresenta os posts recomendados como "Mais acessadas", com leitura mais proxima de portal editorial.
- A fonte dos itens continua sendo a lista de posts recomendados/destacados, nao analytics real de audiencia.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Quando houver dados de analytics por post disponiveis, trocar a ordenacao desse card para ranking real de acessos.

## Sessao de 2026-05-25 - Hero do blog com fundo branco

Foi ajustado o topo da pagina publica `/blog` para iniciar a transicao para um hub de produtos financeiros.

Arquivos modificados:
- `app/blog/blog.css`: a barra do menu permanece azul, a logo foi centralizada e ampliada, o link "Voltar ao site" foi movido visualmente para a esquerda e a area da headline passou para fundo branco.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao visual.

Estado atual:
- O topo do blog agora separa melhor marca/menu e conteudo: menu azul, hero branca, textos em azul marinho e busca com contraste para fundo claro.
- `npm run build` em `blog-pages` passou com sucesso.
- Permanecem warnings de `<img>` no logo do blog e na pagina interna de post, sem bloquear build.

Proximo passo recomendado:
- Validar `/blog` publicado e continuar a evolucao da primeira dobra para comunicar melhor o hub de produtos financeiros da MB Finance.

## Sessao de 2026-05-25 - Hub financeiro na capa do blog

Foi aplicada a composicao visual para aproximar `/blog` de um hub de produtos financeiros.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: headline alterada para hub financeiro, adicionada faixa "Escolha por necessidade" com cards de produtos e CTA para WhatsApp antes do footer.
- `app/blog/blog.css`: criados estilos para a faixa azul clara de produtos, cards brancos com acentos de cor, CTA clara antes do rodape e responsividade.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A primeira dobra comunica a MB Finance como hub de solucoes: credito empresarial, conta PJ, antecipacao e gestao financeira.
- Os cards de produto filtram os conteudos da pagina por categoria.
- A transicao para o footer ficou mais suave com uma CTA clara apontando para WhatsApp.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar a pagina publicada e, na proxima rodada, ajustar os textos dos artigos/cards para reforcar ainda mais a jornada por produto.

## Sessao de 2026-05-25 - Menu por produtos no hub do blog

Foi consolidada a navegacao de categorias dentro da faixa "Escolha por necessidade".

Arquivos modificados:
- `components/BlogIndexClient.tsx`: adicionados os cards "Todos" e "Tributos", ajustada a ordem para Todos, Credito, Gestao, Conta PJ, Antecipacao e Tributos, e removida a barra de filtros inferior.
- `app/blog/blog.css`: o grid de produtos passou a suportar seis cards, os estilos da barra de filtros antiga foram removidos e a responsividade foi ajustada.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A faixa de produtos agora funciona como menu principal da capa `/blog`.
- A barra horizontal antiga abaixo da hero nao aparece mais.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar visualmente os seis cards em desktop e mobile apos deploy, principalmente quebra de texto e altura dos cards.

## Sessao de 2026-05-25 - Hero com painel financeiro

Foi refeita a hero da capa `/blog` para combinar melhor com a nova navegacao por produtos.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: headline ficou mais direta, foram adicionados CTAs para WhatsApp e para explorar solucoes, e entrou um painel financeiro com mini cards de credito, antecipacao, conta PJ e tributos.
- `app/blog/blog.css`: criada composicao em duas colunas, fundo claro com transicao azul, estilos do painel financeiro, CTAs e responsividade mobile.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A hero nao fica mais apenas como texto solto: agora apresenta uma proposta de hub financeiro com caminhos claros de acao.
- O CTA principal aponta para WhatsApp e o secundario leva para a faixa de produtos.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar visualmente a hero publicada em desktop e mobile, especialmente o painel financeiro e a quebra da headline.

## Sessao de 2026-05-25 - Remocao da hero do hub

Foi removida a primeira secao/hero da capa `/blog` a pedido do usuario.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: removida a hero com headline, CTAs, busca e painel financeiro; a pagina agora inicia direto na faixa de produtos.
- `app/blog/blog.css`: removidos os estilos de `blog-hero`, `hero-*` e `finance-panel`.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- Depois da barra azul com a logo, a capa `/blog` abre diretamente na secao "Escolha por necessidade".
- A busca da capa foi removida junto com a hero.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar a pagina publicada para decidir se a faixa de produtos precisa ganhar um cabecalho mais forte agora que virou a primeira secao da pagina.

## Sessao de 2026-05-25 - Menu lateral de produtos no blog

Foi transformado o menu horizontal de produtos da capa `/blog` em uma barra lateral esquerda.

Arquivos modificados:
- `components/BlogIndexClient.tsx`: o menu de produtos saiu da secao horizontal e passou a ser um `aside` lateral dentro da area principal.
- `app/blog/blog.css`: removidos estilos dos cards horizontais, adicionados estilos da sidebar esquerda, grid principal em duas colunas e responsividade.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- No desktop, a capa `/blog` abre com menu de produtos na esquerda e conteudo editorial na direita.
- No tablet/mobile, o menu deixa de ser fixo e se adapta acima do conteudo.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar a sidebar publicada em desktop e mobile, especialmente largura, altura dos botoes e leitura dos textos.

## Sessao de 2026-05-25 - Sidebar de produtos suavizada

Foi refinado o design da barra lateral de produtos da capa `/blog`.

Arquivos modificados:
- `app/blog/blog.css`: sidebar ficou mais leve, com fundo branco translucido, tipografia menos agressiva, botoes compactos, estado ativo por faixa azul discreta e comportamento sticky com scroll interno.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-05-25.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A sidebar acompanha a rolagem no desktop usando `position: sticky`.
- Se a altura da tela for menor, a sidebar tem scroll proprio para nao cortar itens.
- Os textos e botoes ficaram visualmente mais harmonicos.
- `npm run build` em `blog-pages` passou com sucesso.

Proximo passo recomendado:
- Validar a sidebar publicada em desktop, notebook menor e mobile para conferir se o sticky e o scroll interno estao confortaveis.

## Sessao de 2026-06-02 - Dominio MB Finance nos links curtos

- `private/blog-admin.html`: adicionado seletor de dominio curto com `mbnegocios.com.br` e `mbfinance.com.br`.
- `public/assets/js/admin/admin-campaigns.js`: o dominio escolhido passou a ser enviado para `/api/shorten`.
- `app/api/shorten/route.ts`: o dominio solicitado e validado por allowlist.
- `../cpanel-upload/public_html/.htaccess`: preparada regra para encaminhar `mbfinance.com.br/c/[code]` ao contador central do blog.

Estado atual: codigo pronto para deploy. A regra do CPanel precisa ser publicada para `mbfinance.com.br/c/...` deixar de responder `404`.

Validacao: `node --check public/assets/js/admin/admin-campaigns.js` e `npm run build` passaram com sucesso.

Ajuste complementar:
- Destinos invalidos passam a ser recusados no momento da criacao do link, e nao apenas no clique.
- Destinos oficiais de WhatsApp (`wa.me`, `api.whatsapp.com` e `whatsapp.com`) foram adicionados a allowlist.
- Links antigos que exibem `Destino invalido` precisam ser recriados.

## Sessao de 2026-07-13 - Influencers por projeto em Videos IA

Foi reorganizado o card de influencer da aba Videos IA para permitir multiplas influencers por projeto.

Arquivos modificados:
- `private/blog-admin.html`: card de influencer substituido por lista/formulario com seletor, resumo da personagem, importacao de manual e campos de IDs do HeyGen.
- `public/assets/js/admin/admin-videos.js`: adicionada persistencia local por projeto, filtro automatico ao trocar projeto e vinculo da influencer ativa aos roteiros gerados.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-07-13.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- Cada projeto mostra somente as influencers cadastradas nele.
- MB Negocios recebe a influencer inicial Heena Duarte com ID de aparencia e Voice ID informados pelo usuario.
- O campo do lote mostra apenas a influencer selecionada; os IDs tecnicos ficam no cadastro da personagem.
- `npm run build` passou com sucesso.

Proximo passo recomendado:
- Validar em producao se o ID de aparencia enviado ao HeyGen e aceito como `avatar_id`; se a API exigir outro campo, ajustar a rota `/api/heygen/videos`.

## Sessao de 2026-07-13 - Espacamento do card de influencers

Foi refinado o layout do card Influencers do projeto na aba Videos IA.

Arquivos modificados:
- `private/blog-admin.html`: o card passou a usar cabecalho em grid, lista da influencer separada e formulario em coluna unica dentro da lateral.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-07-13.md` e `CHANGELOG.md`: atualizados com a sessao.

Estado atual:
- Campos do cadastro de influencer deixam de ficar espremidos em duas colunas.
- Botoes, seletor, resumo e formulario seguem uma hierarquia vertical mais previsivel.
- `npm run build` passou com sucesso.

Proximo passo recomendado:
- Validar visualmente a aba Videos IA em producao em notebook e desktop.

## Sessao de 2026-07-13 - Foto e manual anexados no perfil da influencer

Foi adicionada a possibilidade de anexar foto e documento do manual no cadastro de influencers da aba Videos IA.

Arquivos modificados:
- `private/blog-admin.html`: adicionados botoes Anexar foto e Anexar manual, preview visual da foto no avatar e labels de arquivo anexado.
- `public/assets/js/admin/admin-videos.js`: salva foto compactada, nome do arquivo e documento do manual no perfil local da influencer.
- `CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `docs/sessions/2026-07-13.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- A foto substitui as iniciais HD/IA no resumo da influencer.
- O manual pode ser anexado como TXT, MD, JSON, PDF, DOC ou DOCX.
- TXT/MD/JSON tambem preenchem o resumo usado nos roteiros.
- PDF/DOC/DOCX ficam anexados ao perfil local, mas o texto nao e extraido automaticamente nesta etapa.
- `npm run build` passou com sucesso.

Proximo passo recomendado:
- Migrar foto e manual para storage/banco quando sair de `localStorage`, porque arquivos anexados agora ficam somente no navegador atual.

## Sessao de 2026-07-13 - PDFs maiores no manual da influencer

Foi corrigido o limite baixo ao anexar PDF no manual da influencer.

Arquivos modificados:
- `public/assets/js/admin/admin-videos.js`: PDFs/DOCs deixam de ser salvos em `localStorage` e passam a ser guardados em IndexedDB no navegador, com limite local de 15 MB.
- `private/blog-admin.html`: texto do campo atualizado para PDF, DOC, TXT e MD.
- `CONTEXT.md`, `DECISIONS.md`, `docs/sessions/2026-07-13.md` e `CHANGELOG.md`: atualizados com a decisao.

Estado atual:
- O perfil da influencer guarda no `localStorage` apenas metadados do manual.
- O arquivo pesado fica em IndexedDB, evitando o erro de limite anterior.
- TXT/MD continuam preenchendo o resumo do manual automaticamente.
- `npm run build` passou com sucesso.

## Sessao de 2026-07-13 - Galeria visual da influencer Helena Duarte

### O que foi feito
- Copiadas 8 imagens de referencia da pasta local da influencer para `public/images/influencers/helena-duarte/`.
- A aba Videos IA passou a exibir uma galeria de referencias visuais no card da influencer.
- O perfil padrao da Heena Duarte em MB Negocios recebeu foto principal e referencias fixas, sem apagar IDs ja salvos localmente.
- O script de videos foi versionado para `admin-videos.js?v=8`.

### Estado atual
- Ao selecionar MB Negocios e Heena Duarte, as imagens aparecem no painel da influencer.
- Clicar em uma referencia aplica aquela imagem como foto principal do perfil local.

### Proximo passo recomendado
- Otimizar as imagens em WebP/AVIF quando houver ferramenta de compressao disponivel e definir qual imagem sera a referencia oficial final.

## Sessao de 2026-07-13 - Manual da Helena Duarte

### O que foi feito
- O resumo/manual da Helena Duarte foi cadastrado como manual padrao da influencer no projeto MB Negocios.
- O nome padrao foi corrigido de Heena Duarte para Helena Duarte, preservando o ID interno antigo para compatibilidade.
- Perfis antigos salvos no navegador recebem o manual padrao apenas se ainda nao tiverem manual preenchido.
- O script de videos foi versionado para `admin-videos.js?v=9`.

### Estado atual
- Ao abrir Videos IA em MB Negocios, a Helena deve carregar com galeria, IDs tecnicos e resumo manual preenchido quando o perfil local ainda estiver vazio.

### Proximo passo recomendado
- Validar em producao se o resumo aparece no campo Manual da influencer e se os roteiros passam a incorporar essa identidade.

## Sessao de 2026-07-13 - Video unico e lote por calendario

### O que foi feito
- A aba Videos IA passou a separar o fluxo de criacao entre `Gerar 1 video` e `Gerar lote para varios dias`.
- O formulario recebeu campos de primeira publicacao e intervalo em dias para planejar lotes.
- Cada roteiro do lote passa a salvar `plannedDate` e exibir a postagem planejada na fila.
- O CSV de videos agora exporta Data planejada e Data criacao separadamente.
- O script de videos foi versionado para `admin-videos.js?v=10`.

### Estado atual
- O usuario pode gerar uma peca unica sem alterar a quantidade do lote.
- O lote continua gerando variacoes diferentes, agora com agenda sugerida por data.

### Proximo passo recomendado
- Validar em producao gerando 1 video e depois um lote com data inicial para conferir a ordem das datas planejadas.

## Sessao de 2026-07-13 - Uso do video e multiplas redes

### O que foi feito
- A aba Videos IA passou a ter o campo `Uso do video`, separando conteudo para redes sociais, anuncios pagos ou ambos.
- O antigo campo unico de Canal foi substituido por uma selecao multipla de redes onde o video sera usado.
- Os campos de quantidade, primeira publicacao e intervalo foram agrupados como configuracao do lote.
- Roteiros, fila e CSV passam a guardar o uso do video e a lista de redes selecionadas.
- O script de videos foi versionado para `admin-videos.js?v=11`.

### Estado atual
- Um mesmo roteiro pode ser planejado para Instagram, TikTok, YouTube Shorts, Facebook Reels, Stories e Meta Ads.
- A tela deixa mais claro o que pertence ao video e o que pertence apenas ao lote.

## Sessao de 2026-07-13 - Filtro de redes por uso do video

### O que foi feito
- Corrigida a selecao de redes na aba Videos IA para reagir ao campo Uso do video.
- Conteudo para redes sociais mostra apenas canais organicos: Instagram, Stories, TikTok, YouTube e Facebook.
- Anuncios pagos mostra apenas canais pagos: Meta Ads, Instagram Ads, Facebook Ads, TikTok Ads e YouTube Ads.
- Conteudo e anuncios mostra os dois grupos.
- Os nomes organicos foram encurtados, removendo sufixos como Reels e Shorts.
- O script de videos foi versionado para `admin-videos.js?v=12`.

### Estado atual
- A lista nao exibe mais todos os canais para qualquer escolha de uso.
- Os modelos rapidos tambem selecionam canais coerentes com o tipo de uso.

## Sessao de 2026-07-13 - Linha editorial e Kanban de Videos IA

### O que foi feito
- Adicionada a secao Linha editorial dentro da aba Videos IA.
- Criados pilares editoriais baseados no manual da Helena: educacao financeira PJ, beneficios praticos, quebra de objecoes, comparativos, bastidores e oferta/conversao.
- Adicionado Kanban local com colunas Ideias, Roteiro, Producao e Publicado.
- O usuario pode adicionar ideias, mover entre colunas, excluir e aplicar uma ideia diretamente no briefing do video.
- Adicionada acao Sugerir ideias base para iniciar o planejamento editorial.
- O script de videos foi versionado para `admin-videos.js?v=13`.

### Estado atual
- A linha editorial fica salva em `localStorage` pela chave `mb_ai_video_editorial_v1`.
- O Kanban ainda e local do navegador, igual a fila inicial de videos.

### Proximo passo recomendado
- Validar em producao o cadastro de ideias e a acao Usar, depois avaliar persistencia em banco/API para compartilhar com a equipe.

## Sessao de 2026-07-13 - Remocao de cards auxiliares em Videos IA

### O que foi feito
- Removidos os cards laterais Fluxo recomendado e Modelos rapidos da aba Videos IA.
- Mantida a nota de integracao HeyGen.
- O script de videos foi versionado para `admin-videos.js?v=14` para quebrar cache.

### Estado atual
- A lateral de Videos IA fica mais limpa, focada na influencer e na integracao.

## Sessao 2026-07-13 - Linha editorial em pagina propria

### O que foi feito
- O Kanban de Linha editorial saiu de dentro da aba Videos IA e virou uma pagina propria no menu principal do admin.
- A nova tela recebeu colunas mais largas, area lateral para pilares editoriais e formulario separado para nova ideia.
- A aba Videos IA voltou a focar em criacao de videos, influencer do projeto e fila de producao.
- O botao Usar no Kanban agora aplica a ideia no briefing e leva o usuario para Videos IA.
- Scripts versionados para `admin-videos.js?v=15` e `admin-core.js?v=3`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-core.js`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- A linha editorial tem uma pagina dedicada, com mais espaco para visualizar e mover cards.
- O armazenamento das ideias continua em `localStorage` nesta etapa.
- Build de producao passou, mantendo apenas warnings antigos de `<img>`.

### Proximo passo recomendado
- Validar em producao o fluxo: abrir Linha editorial, criar ideia, mover card e usar a ideia no briefing de Videos IA.

## Sessao 2026-07-13 - Submenu dentro de Videos IA

### O que foi feito
- A Linha editorial deixou de ser item independente do menu principal.
- A pagina Videos IA ganhou um submenu interno com `Criar videos` e `Linha editorial`.
- O Kanban continua com layout amplo, mas agora fica dentro do contexto de criacao de videos com IA.
- O core do admin voltou a tratar apenas `videos` como aba principal.
- Scripts versionados para `admin-videos.js?v=16` e `admin-core.js?v=4`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-core.js`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- Todo o fluxo de criacao de conteudo por video com IA fica dentro da aba Videos IA.
- A subaba Linha editorial renderiza o Kanban sob demanda e a subaba Criar videos renderiza resumo, formulario, influencer e fila.

### Proximo passo recomendado
- Validar em producao se a troca entre Criar videos e Linha editorial esta confortavel no uso diario.

## Sessao 2026-07-13 - Kanban editorial em largura ampliada

### O que foi feito
- A subaba Linha editorial dentro de Videos IA passou a usar melhor a largura disponivel da tela.
- Pilares editoriais e formulario de nova ideia foram organizados acima do board.
- O Kanban passou a ocupar uma linha inteira, com colunas mais largas e area vertical maior.
- A tela Videos IA adiciona a classe `video-editorial-active` ao abrir a subaba editorial para remover o limite de largura do container.
- O script de videos foi versionado para `admin-videos.js?v=17`.

### Estado atual
- A Linha editorial continua dentro de Videos IA, mas o Kanban nao fica mais comprimido ao lado dos pilares.
- Build de producao passou, com apenas warnings antigos de `<img>` no blog.

### Proximo passo recomendado
- Validar visualmente em producao se as quatro colunas aparecem confortaveis no monitor principal de uso.

## Sessao 2026-07-13 - Limpeza visual em Criar videos

### O que foi feito
- Removido o card azul de integracao da subaba Criar videos em Videos IA.
- A Fila de producao foi movida para a coluna do formulario, logo abaixo dos botoes de geracao.
- O espaco em branco entre o formulario e a fila foi reduzido.
- A regra CSS obsoleta do card de integracao foi removida.

### Estado atual
- A integracao HeyGen continua existindo tecnicamente pela rota `/api/heygen/videos`, mas sem ocupar espaco visual com um aviso fixo.
- A fila aparece no fluxo direto de criacao de videos.

### Proximo passo recomendado
- Validar visualmente a subaba Criar videos em producao e revisar se a fila deve virar um painel colapsavel quando houver muitos roteiros.

## Sessao 2026-07-13 - Melhor uso lateral em Videos IA

### O que foi feito
- A tela Videos IA deixou de ficar presa ao limite de `1180px` e agora usa toda a largura disponivel da area administrativa.
- A grade principal foi recalibrada para dar mais espaco ao formulario e manter uma coluna lateral mais confortavel para a influencer.
- Cards de resumo, formularios e espaçamentos passaram a aproveitar melhor as laterais da tela.

### Estado atual
- A subaba Criar videos deve aparecer menos espremida em monitores largos.
- Em telas menores, o layout continua empilhando para evitar estouro horizontal.

### Proximo passo recomendado
- Validar visualmente em producao no monitor principal e ajustar a proporcao entre formulario e influencer se necessario.

## 2026-07-13 - Videos IA: perfis sociais por projeto

- Substituida a selecao manual de canais em Videos IA por um bloco de perfis conectados.
- Cada projeto agora pode cadastrar perfis de Instagram e Facebook em `localStorage` usando a chave `mb_ai_video_social_accounts_v1`.
- A geracao de roteiro usa os perfis conectados selecionados como destino do video e bloqueia a criacao quando nao ha perfil selecionado.
- Arquivos modificados: `private/blog-admin.html` e `public/assets/js/admin/admin-videos.js`.
- Validacao executada: `node --check public\assets\js\admin\admin-videos.js` e `npm run build`.
- Proximo passo recomendado: implementar OAuth real da Meta para importar paginas/perfis e habilitar agendamento via API oficial.

## 2026-07-13 - OAuth real Meta para Videos IA

- Substituida a conexao manual/fake de perfis sociais por um fluxo OAuth real da Meta.
- Criadas as rotas `GET /api/meta/connect` e `GET /api/meta/callback`.
- O admin abre o login oficial da Meta em popup, troca o `code` no servidor, busca paginas do Facebook e perfis profissionais do Instagram vinculados e salva os perfis reais no projeto selecionado.
- O frontend recebe apenas dados dos perfis; tokens da Meta nao sao expostos no JavaScript publico.
- Variaveis adicionadas em `.env.example`: `META_APP_ID`, `META_APP_SECRET`, `META_GRAPH_VERSION` e `NEXT_PUBLIC_SITE_URL`.
- Arquivos modificados: `app/api/meta/connect/route.ts`, `app/api/meta/callback/route.ts`, `private/blog-admin.html`, `public/assets/js/admin/admin-videos.js`, `.env.example`.
- Validacao executada: `node --check public\assets\js\admin\admin-videos.js` e `npm run build`.
- Proximo passo recomendado: configurar o app da Meta e as variaveis na Vercel; para agendamento real, persistir tokens no servidor com criptografia e banco.

## Sessao 2026-07-13 - Retorno visivel do OAuth Meta em Videos IA

### O que foi feito
- A pagina `/api/meta/callback` deixou de fechar automaticamente o popup da Meta e agora mostra uma confirmacao visivel no dominio `blog.mbfinance.com.br`.
- O callback grava o resultado em `localStorage`, envia `postMessage` para o admin e oferece o botao `Aplicar no admin` como fallback manual.
- O admin Videos IA passou a capturar o retorno da Meta tambem por evento de `storage`, foco da janela e fechamento do popup.
- O script de videos foi versionado para `admin-videos.js?v=22`.

### Arquivos modificados
- `app/api/meta/callback/route.ts`
- `public/assets/js/admin/admin-videos.js`
- `private/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- Se a Meta redirecionar corretamente para o callback, o usuario deve ver uma tela de confirmacao do proprio blog antes de voltar ao admin.
- Se a confirmacao nao aparecer depois do botao Entendi da Meta, o problema ainda esta no fluxo/configuracao de redirecionamento da Meta antes de chegar no sistema.

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Reautorizacao de paginas Meta

### O que foi feito
- A rota `/api/meta/connect` passou a iniciar o OAuth com `auth_type=rerequest` e `return_scopes=true` para forcar a Meta a reavaliar permissoes concedidas.
- A mensagem quando nenhuma pagina e retornada ficou mais operacional, orientando o usuario a entrar com a conta administradora e usar `Editar configuracoes` para liberar todas as paginas desejadas.

### Arquivos modificados
- `app/api/meta/connect/route.ts`
- `app/api/meta/callback/route.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- O sistema salva corretamente as paginas que a Meta devolve.
- Paginas ausentes dependem da selecao/autorizacao feita dentro da propria tela da Meta e das permissoes da conta logada sobre cada pagina.
- Instagram ainda depende de permissao de Instagram no app da Meta e de perfil profissional vinculado a uma pagina.

### Validacao
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Ativos Meta selecionaveis por projeto

### O que foi feito
- A aba Videos IA deixou de tratar Instagram/Facebook como conexoes separadas por projeto.
- A conexao Meta/Facebook agora importa ativos para uma biblioteca local global do admin.
- Cada projeto passa a selecionar quais ativos importados pertencem a ele: uma pagina do Facebook e, quando disponivel, um Instagram profissional.
- A interface agora mostra grupos separados para `Pagina do Facebook para este projeto` e `Instagram profissional para este projeto`.
- O script de videos foi versionado para `admin-videos.js?v=23`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- O usuario conecta a conta Meta/Facebook uma vez e depois filtra os ativos por projeto.
- Perfis ja conectados anteriormente sao preservados como legado e aparecem na biblioteca de ativos Meta.
- A selecao de ativos por projeto ainda fica em `localStorage` nesta etapa.

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Callback Meta com retorno automatico

### O que foi feito
- A tela de callback da Meta deixou de ficar parada apos `Conexao Meta finalizada`.
- O callback agora envia o resultado ao admin, tenta fechar o popup automaticamente e redireciona para `/admin#videos` quando o navegador nao permite fechar a janela.
- O botao da tela passou de `Aplicar no admin` para `Voltar para o admin`.

### Arquivos modificados
- `app/api/meta/callback/route.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- A tela de callback pode aparecer rapidamente como confirmacao, mas nao deve prender o usuario nela.
- Build de producao passou, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Correcao de Instagram no retorno Meta

### O que foi feito
- Corrigido o callback da Meta para nao descartar contas Instagram quando a conexao for iniciada pelo botao `Conectar conta Meta/Facebook`.
- A mensagem de aviso foi ajustada para informar que Instagram ausente depende de perfil profissional, vinculo com pagina retornada e permissao/produto de Instagram no app da Meta.

### Arquivos modificados
- `app/api/meta/callback/route.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- Se a Graph API devolver `instagram_business_account`, o admin passa a importar o Instagram mesmo quando o fluxo comecou pelo Facebook.
- Paginas ausentes continuam dependendo da selecao/autorizacao feita na tela da Meta e das permissoes da conta logada.

### Validacao
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Remocao de aviso fixo em Videos IA

### O que foi feito
- Removido o aviso fixo `Crie um video unico ou uma sequencia para varios dias` da subaba Criar videos.
- Removido o CSS associado a `video-mode-note` e `video-mode-icon`.

### Arquivos modificados
- `private/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Validacao
- Busca por `video-mode-note`/texto do aviso nao retornou ocorrencias.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Videos IA como gerador de conteudo

### O que foi feito
- A subaba Criar videos foi remodelada para funcionar como `Gerador de conteudo`, removendo a linguagem principal de lote.
- O campo Produto virou selecao multipla de produtos do conteudo.
- O campo de quantidade passou a representar `Quantas ideias de conteudo` devem ser geradas.
- Foram removidos os campos de primeira publicacao e intervalo entre videos do fluxo principal.
- O briefing foi renomeado para `Filtro criativo e pontos para lapidar`.
- A lista inferior passou a se chamar `Ideias geradas`.
- O script de videos foi versionado para `admin-videos.js?v=24`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- O usuario configura projeto, uso, ativos Meta, multiplos produtos, formato, quantidade de ideias, duracao, tom de voz, influencer, CTA e filtro criativo.
- O botao principal gera a quantidade de ideias indicada, sem apresentar o fluxo como lote/agendamento.

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-13 - Ideias geradas legiveis em Videos IA

### O que foi feito
- A lista `Ideias geradas` deixou de usar colunas compactas e passou a renderizar cada ideia como um card legivel.
- Cada card mostra titulo, projeto, produto, destino e tom em chips, com o roteiro em uma area propria.
- Adicionado botao `Ver tudo`/`Recolher` para expandir o roteiro completo sem espremer a tela.
- O script de videos foi versionado para `admin-videos.js?v=25`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- O usuario consegue ler o roteiro e as informacoes do conteudo gerado diretamente na lista.
- Em telas menores, os botoes empilham abaixo do conteudo para preservar a leitura.

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-14 - Correcao de cache em Ideias geradas

### O que foi feito
- Atualizado o cache bust do script de Videos IA para `admin-videos.js?v=26`.
- Adicionados headers `Cache-Control: no-store` para `/admin`, `/admin/:path*` e scripts do admin.
- O objetivo foi impedir que o navegador continue carregando a tabela antiga de ideias geradas sem o botao `Ver tudo`.

### Arquivos modificados
- `private/blog-admin.html`
- `next.config.mjs`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-14.md`
- `CHANGELOG.md`

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-14 - Card recolhivel de influencer

### O que foi feito
- O card `Influencers do projeto` na aba Videos IA passou a abrir recolhido por padrao.
- Mantida visivel apenas a selecao da influencer ativa, resumo e acoes rapidas.
- A area de edicao de identidade, foto, manual e IDs fica atras do botao `Editar`/`Recolher`.
- O estado aberto/recolhido fica salvo no navegador pela chave `mb_ai_video_influencer_collapsed_v1`.
- `Nova influencer` abre automaticamente o editor.
- O script de videos foi versionado para `admin-videos.js?v=27`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-14.md`
- `CHANGELOG.md`

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-14 - Coluna lateral da influencer compacta

### O que foi feito
- Reduzida a largura da coluna lateral da influencer em Videos IA.
- A grade principal passou de uma lateral com minimo de 420px para uma coluna compacta `clamp(300px, 24vw, 340px)`.
- O card de influencer foi ajustado para caber melhor nessa largura: botoes em grid, padding menor, avatar menor e acoes empilhadas.
- O breakpoint de empilhamento da tela mudou para 980px, mantendo o layout em duas colunas por mais tempo.
- O script de videos foi versionado para `admin-videos.js?v=28`.

### Arquivos modificados
- `private/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-14.md`
- `CHANGELOG.md`

### Validacao
- `node --check public\\assets\\js\\admin\\admin-videos.js` executado com sucesso.
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-14 - Reversao da coluna compacta da influencer

### O que foi feito
- Desfeita a ultima alteracao que reduzia a largura da coluna lateral da influencer em Videos IA.
- A grade voltou para `minmax(0, 1.25fr) minmax(420px, .75fr)` com gap de 24px.
- Os ajustes internos compactos do card tambem foram revertidos para o padrao anterior.
- O card continua recolhivel, porque a reversao solicitada foi da alteracao de largura.
- O script foi versionado para `admin-videos.js?v=29`.

### Validacao
- `npm run build` executado com sucesso, mantendo apenas warnings antigos de `<img>`.

## Sessao 2026-07-14 - Etapa Remotion em Videos IA

### O que foi feito
- Adicionado Remotion como etapa de edicao automatica dentro da tela Videos IA.
- A fila de ideias agora possui status especificos para Remotion: Aguardando Remotion, Editando no Remotion e Video editado.
- Cada item com MP4 do HeyGen passa a exibir a acao Remotion, que coloca o conteudo na fila de edicao final.
- O resumo da tela separa geracao HeyGen de edicao Remotion.
- O CSV de Videos IA passou a exportar status Remotion e URL de video final.
- O script de videos foi versionado para `admin-videos.js?v=30`.

### Arquivos modificados
- `private/blog-admin.html`
- `public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-14.md`
- `CHANGELOG.md`

### Estado atual
- Remotion esta representado no fluxo operacional do admin, apos o MP4 sair do HeyGen.
- A renderizacao automatica ainda nao foi implementada; a etapa atual organiza fila/status e prepara a interface para o endpoint futuro.

### Proximo passo recomendado
- Instalar/configurar Remotion e criar um template padrao para legenda, logo, CTA, cortes e exportacao final em MP4.

### Deploy Remotion
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-6gulf3izu-growths-projects-da44dbf7.vercel.app

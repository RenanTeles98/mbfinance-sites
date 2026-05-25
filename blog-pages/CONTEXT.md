# Contexto do Projeto

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

# Contexto do Projeto

## Sessao 2026-05-13

### O que foi feito
- Adicionada a metrica "Leads Gerados" no painel de metricas do site em `public/pages/blog-admin.html`.
- O card mostra cliques para abrir a Conta PJ no site.
- A API de analytics agora busca `eventCount` no GA4 para eventos de lead.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-analytics.js`
- `lib/ga4.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-13.md`
- `CHANGELOG.md`

### Estado atual
- O painel exibe cinco cards de KPI: Leads Gerados, Usuarios Totais, Usuarios Ativos, Sessoes e Visualizacoes.
- A metrica de leads considera os eventos GA4 `lead_modal_open` e `conta_pj_lead_click`.
- O build de producao foi executado com sucesso.

### Proximo passo recomendado
- Confirmar no GA4/GTM se o clique especifico da Conta PJ esta sendo enviado como `conta_pj_lead_click`; se nao estiver, criar ou ajustar esse evento no site principal para separar Conta PJ de outros produtos.

## Sessao 2026-05-18

### O que foi feito
- Investigada falha no painel de metricas do site exibindo `invalid_grant` e `account not found` ao autenticar no Google Analytics.
- A API de GA4 passou a traduzir esse erro em mensagem operacional, indicando que a service account configurada em `GA4_CLIENT_EMAIL` nao existe mais ou nao foi encontrada.

### Arquivos modificados
- `lib/ga4.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-18.md`
- `CHANGELOG.md`

### Estado atual
- O build de producao executa com sucesso.
- O problema das metricas nao e de consulta dos relatorios: a falha acontece na autenticacao OAuth/JWT antes de acessar o GA4.
- Para restaurar os dados reais no painel publicado, e necessario atualizar as variaveis `GA4_CLIENT_EMAIL` e `GA4_PRIVATE_KEY` no Vercel com uma service account valida e garantir acesso dessa conta na propriedade GA4.

### Proximo passo recomendado
- Gerar uma nova chave de service account no Google Cloud, adicionar o e-mail dessa service account como usuario/leitor na propriedade GA4 correta e atualizar as variaveis de ambiente no Vercel.

## Sessao 2026-05-25

### O que foi feito
- Refeita a estrutura das telas do painel administrativo do blog para evitar abas com area principal em branco.
- Adicionada a tela "Campanhas" com KPIs, pipeline editorial e foco semanal.
- Renomeada a aba "Newsletter" para "E-mails", alinhando com a nomenclatura usada na interface.
- Ajustado o switch de abas para voltar para "Metricas do site" quando uma aba nao tiver painel correspondente.
- Adicionada renderizacao dinamica das campanhas a partir dos posts existentes.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-core.js`
- `public/assets/js/admin/admin-newsletter.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-25.md`
- `CHANGELOG.md`

### Estado atual
- O admin tem painel visivel para Campanhas, Blog, E-mails, Publicidade, Calendario Editorial, Gerador IA e Metricas.
- A navegacao nao deve mais deixar a tela vazia quando uma aba inexistente ou quebrada for acionada.
- O build de producao foi executado com sucesso.

### Proximo passo recomendado
- Validar visualmente o painel publicado apos deploy, especialmente em desktop largo e telas menores, para confirmar que as abas exibem conteudo acima da dobra.

## Sessao 2026-05-26

### O que foi feito
- Aumentada a largura da coluna lateral de publicacoes na aba Blog do admin.
- A lista de posts passou a usar mais espaco horizontal, com titulos em ate duas linhas e metadados com quebra controlada.
- Adicionado comportamento responsivo para empilhar a lista acima do editor em telas menores.
- Adicionada alca manual para o usuario ajustar a largura da lista de publicacoes com o mouse ou teclado.
- A alca de ajuste foi tornada sempre visivel e o `admin-core.js` foi versionado no HTML para evitar cache antigo.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-core.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-05-26.md`
- `CHANGELOG.md`

### Estado atual
- A barra de publicacoes do admin usa largura responsiva `clamp(340px, 24vw, 420px)`.
- A largura pode ser ajustada manualmente entre 300px e 560px e fica salva em `localStorage`.
- A divisoria de redimensionamento agora aparece como uma faixa visivel entre a lista e o editor.
- O editor continua ocupando o restante da tela com `min-width: 0`, evitando estouro horizontal.
- O build de producao foi executado com sucesso; permaneceram apenas warnings antigos de `<img>` no blog publico.

### Proximo passo recomendado
- Validar visualmente a aba Blog em desktop e notebook para confirmar se a nova largura esta confortavel para a rotina de edicao.

## Sessao 2026-07-09

### O que foi feito
- O menu principal do painel admin do blog foi movido do formato horizontal para uma barra lateral esquerda em `public/pages/blog-admin.html`.
- Criado o wrapper `#admin-shell` para organizar navegacao lateral e area de conteudo.
- Ajustado o comportamento responsivo para manter navegacao horizontal rolavel em telas menores.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-09.md`
- `CHANGELOG.md`

### Estado atual
- Em desktop, as abas do admin aparecem em uma coluna lateral esquerda.
- O topo continua reservado para logo e acoes do painel.
- A logica de troca de abas foi preservada, usando os mesmos IDs e eventos existentes.

### Proximo passo recomendado
- Validar visualmente o admin em desktop e notebook para ajustar largura da barra lateral se necessario.

## Sessao 2026-07-09 - Correcao de scroll do admin

### O que foi feito
- Corrigida a rolagem do painel admin apos a mudanca para menu lateral.
- `#admin-body` passou a usar `overflow-y: auto` e `overflow-x: hidden`, permitindo scroll vertical nas telas longas.
- A mesma correcao foi aplicada no arquivo oficial do Vercel em `../blog-pages/private/blog-admin.html`.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `../blog-pages/private/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-09.md`
- `CHANGELOG.md`

### Estado atual
- O menu lateral permanece ativo.
- A area principal do admin volta a rolar verticalmente.

### Proximo passo recomendado
- Validar em producao abrindo `https://blog.mbfinance.com.br/admin` e testando scroll nas abas Metricas, Campanhas e Blog.

## Sessao 2026-07-09 - Organizacao do topo e menu admin

### O que foi feito
- Renomeados os botoes do menu lateral para: Visao geral, Campanhas e links, Conteudo, Newsletter e Anuncios.
- O topo do admin foi simplificado: ficaram visiveis apenas status, Publicar, Ver blog e Mais opcoes.
- As acoes Configurar API, Exportar backup e Sair foram agrupadas em Mais opcoes.
- Textos dinamicos de status foram encurtados para Local, Conectado e Publicado.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-blog.js`
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-blog.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-09.md`
- `CHANGELOG.md`

### Estado atual
- O menu lateral usa nomenclatura mais clara para a rotina editorial e de campanhas.
- O topo ficou menos carregado e prioriza a acao diaria de publicacao.

### Proximo passo recomendado
- Validar visualmente o dropdown Mais opcoes em desktop e notebook.

## Sessao 2026-07-09 - Botao de atualizacao dentro de Conteudo

### O que foi feito
- Removido o botao Publicar do topo global do admin.
- A acao de sincronizacao do blog foi movida para a aba Conteudo como `Atualizar blog`.
- O alerta de falha passou a orientar o usuario a clicar em `Atualizar blog`.

### Arquivos modificados
- `public/pages/blog-admin.html`
- `public/assets/js/admin/admin-blog.js`
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-blog.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-09.md`
- `CHANGELOG.md`

### Estado atual
- O topo global nao mistura mais acao especifica do blog.
- A sincronizacao de conteudo fica dentro da area de Conteudo, junto das ferramentas editoriais.

### Proximo passo recomendado
- Validar em producao se o botao Atualizar blog aparece na aba Conteudo e funciona como antes.

## Sessao 2026-07-10 - Organizacao de Campanhas e links

### O que foi feito
- Reorganizada a aba Campanhas e links para reduzir confusao na entrada da tela.
- Criado um fluxo visual com resumo de uso, etapas de preenchimento e painel separado para o link pronto.
- A area Links salvos recebeu texto mais direto, e Template WhatsApp passou a se chamar Mensagens para WhatsApp.
- Os IDs do formulario foram preservados para manter o JS atual funcionando.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-10.md`
- `CHANGELOG.md`

### Estado atual
- O admin oficial do blog tem a aba de campanhas organizada por fluxo: criar link, copiar/salvar resultado, consultar historico e preparar WhatsApp.
- Build de producao passou com os warnings antigos de `<img>` e edge runtime.

### Proximo passo recomendado
- Conferir a aba Campanhas e links em producao e ajustar densidade/ordem dos campos se o uso real indicar novos atritos.

### Deploy da sessao
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-jk2cwyz47-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Metricas por projeto e link em Campanhas

### O que foi feito
- A aba Campanhas e links agora permite informar Projeto na criacao do link.
- Foi adicionado Apelido do link para gerar links curtos personalizados, como `/c/campanha-meta`.
- Links salvos foram reorganizados para mostrar metricas individuais por linha: link, cliques, ultimo clique, canal e status.
- Adicionado filtro por projeto; os cards de resumo passam a refletir os filtros ativos.
- A rota de encurtamento valida apelidos personalizados e retorna conflito quando o apelido ja existe.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-campaigns.js`
- `../blog-pages/app/api/shorten/route.ts`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-10.md`
- `CHANGELOG.md`

### Estado atual
- O painel consegue separar campanhas por projeto e exibir metricas por link salvo.
- Build e checagem de sintaxe do JS passaram antes do deploy.

### Proximo passo recomendado
- Testar em producao a criacao de um link com apelido unico e outro com apelido repetido para validar a mensagem de conflito.

### Deploy do complemento de metricas por link
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-i82hc6iuo-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Filtro global e cadastro de projetos

### O que foi feito
- O filtro Projeto foi movido para o topo da pagina Campanhas e links para orientar toda a analise da tela.
- O projeto selecionado controla resumo, links salvos e contexto de criacao de link.
- Foi criada uma area Projetos cadastrados para adicionar novos projetos com nome e dominio principal.
- MB Finance e MB Negocios ficaram como projetos base ja cadastrados.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-campaigns.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-10.md`
- `CHANGELOG.md`

### Estado atual
- A gestao de campanhas esta preparada para novos projetos sem alterar codigo a cada novo cadastro.
- Os dados de projetos ficam no armazenamento local do admin nesta etapa.

### Proximo passo recomendado
- Futuramente persistir projetos em banco/API para compartilhar a lista entre usuarios, navegadores e dispositivos.

### Deploy do filtro global de projetos
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-qj0x5h7sf-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Correcao de cache em Campanhas

### O que foi feito
- Corrigido cache bust do JS de campanhas alterando a referencia para `admin-campaigns.js?v=10`.
- Isso forca o navegador a carregar o JS novo responsavel por popular projetos e ativar o filtro global.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `public/pages/blog-admin.html`
- `CONTEXT.md`
- `docs/sessions/2026-07-10.md`

### Estado atual
- Build local passou e o deploy deve publicar a referencia atualizada do script.

### Deploy da correcao de cache
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-8psizwzs0-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Reset de metricas em Campanhas

### O que foi feito
- Zerada a base visivel de campanhas/links da aba Campanhas e links.
- A chave de armazenamento passou de `mb_campaigns_v1` para `mb_campaigns_v2`, fazendo a tela recomecar sem links salvos e sem metricas antigas.
- A lista de projetos foi preservada.
- O script de campanhas foi versionado para `v=11` para quebrar cache.

### Arquivos modificados
- `../blog-pages/public/assets/js/admin/admin-campaigns.js`
- `../blog-pages/private/blog-admin.html`
- `public/pages/blog-admin.html`
- `CONTEXT.md`
- `docs/sessions/2026-07-10.md`

### Estado atual
- Ao carregar a nova versao, a pagina deve iniciar com metricas zeradas e manter os projetos cadastrados.

### Deploy do reset de metricas
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-1th9vhfz2-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Projetos em modal no menu

### O que foi feito
- O botao Projetos foi adicionado ao menu principal do admin.
- O cadastro e a lista de projetos passaram para um pop-up/modal.
- A pagina Campanhas e links ficou focada em filtro, metricas e criacao de links.
- O script de campanhas foi versionado para `v=14`.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-campaigns.js`
- `CONTEXT.md`
- `docs/sessions/2026-07-10.md`

### Estado atual
- A gestao de projetos esta acessivel pelo menu principal e nao ocupa mais espaco dentro da pagina de campanhas.

### Deploy do modal de projetos
- Deploy de producao concluido na Vercel.
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-prev43ei1-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Correcao de apelido duplicado em links curtos

### O que foi feito
- Corrigida a API de encurtamento para reaproveitar um apelido quando ele ja aponta para a mesma URL.
- A mensagem de apelido em uso continua aparecendo apenas quando o mesmo apelido aponta para outra URL.

### Arquivos modificados
- ../blog-pages/app/api/shorten/route.ts`r
- CONTEXT.md`r
- TODO.md`r
- DECISIONS.md`r
- docs/sessions/2026-07-10.md`r
- CHANGELOG.md`r

### Validacao
- 
pm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-hvlg3dtjk-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Liberacao de apelidos ao apagar links

### O que foi feito
- Adicionada remocao de link curto na API /api/shorten via metodo DELETE.
- Ao apagar um link salvo na aba Campanhas e links, o admin agora solicita a liberacao do codigo/apelido correspondente.
- A exclusao so libera o apelido quando o codigo aponta para a mesma URL salva, evitando apagar outro link por engano.
- O script de campanhas foi versionado para =15.

### Arquivos modificados
- ../blog-pages/app/api/shorten/route.ts`r
- ../blog-pages/public/assets/js/admin/admin-campaigns.js`r
- ../blog-pages/private/blog-admin.html`r
- CONTEXT.md`r
- TODO.md`r
- DECISIONS.md`r
- docs/sessions/2026-07-10.md`r
- CHANGELOG.md`r

### Validacao
- 
ode --check public/assets/js/admin/admin-campaigns.js executado com sucesso.
- 
pm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-dutvgc9l8-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Liberacao manual de apelido antigo

### O que foi feito
- Quando a API retorna erro de apelido em uso, a tela agora mostra a acao Liberar apelido.
- A acao chama DELETE em /api/shorten apenas com o codigo atual, liberando apelidos antigos que nao aparecem mais na tabela.
- O script de campanhas foi versionado para =16.

### Validacao
- 
ode --check public/assets/js/admin/admin-campaigns.js executado com sucesso.
- 
pm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-ktwg4o82t-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Guia de parametros UTM e CNPJ

### O que foi feito
- Melhorado o bloco de parametros de rastreio da aba Campanhas e links.
- Adicionado guia visual explicando Origem/source, Meio/medium e Conteudo/content.
- Adicionado aviso explicando que CNPJ nao e identificado pelo clique sozinho; precisa ser informado em formulario, WhatsApp ou CRM e cruzado com UTMs.
- Adicionados canais Instagram Bio e Facebook Bio.
- Atualizado cache bust do script de campanhas para =17.

### Validacao
- 
ode --check public/assets/js/admin/admin-campaigns.js executado com sucesso.
- 
pm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-nf8xnxe7i-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - Correcao de nomenclatura CPC/Meio

### O que foi feito
- Corrigida a explicacao dos parametros UTM para deixar claro que CPC nao e canal de aquisicao.
- Origem/source passou a ser descrita como plataforma/origem do clique.
- Meio/medium passou a ser descrito como modelo/tipo de trafego, incluindo cpc como pago por clique.
- Relatorio e CSV trocaram Tipo de canal/Midia por Meio.

### Validacao
- 
ode --check public/assets/js/admin/admin-campaigns.js executado com sucesso.
- 
pm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-e3xaod6qk-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-10 - MVP de links por cliente

### O que foi feito
- Implementada a secao Links por cliente dentro da aba Campanhas e links.
- A ferramenta permite colar clientes em massa no formato Nome; CNPJ; Telefone; Empresa.
- Cada cliente recebe um link curto unico com token interno, sem expor CNPJ na URL publica.
- O painel mostra cliente, CNPJ, link, mensagem, cliques e ultimo clique.
- Incluidas acoes para copiar link, copiar mensagem, excluir link e exportar CSV.
- O script do admin foi versionado para v18.

### Estado atual
- O vinculo cliente/CNPJ fica em localStorage do navegador do admin.
- A contagem de cliques continua vindo do encurtador/Redis por codigo curto.

### Validacao
- node --check public/assets/js/admin/admin-campaigns.js executado com sucesso.
- npm run build executado com sucesso no projeto oficial.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-e6ljjh6jm-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-13 - Ferramenta Videos IA

### O que foi feito
- Adicionada a aba Videos IA no menu principal do admin oficial.
- Criada uma tela para planejar lotes de videos por projeto, canal, oferta, formato, quantidade, duracao, tom, avatar, CTA e briefing.
- Criado o script `admin-videos.js` para gerar roteiros em lote, manter fila local de producao, alterar status, copiar roteiro, duplicar, excluir, limpar fila e exportar CSV.
- O core do admin passou a reconhecer a aba `videos` e inicializar `initVideos()`.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-core.js`
- `../blog-pages/public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- A ferramenta organiza o fluxo operacional de videos com IA, mas ainda nao chama HeyGen/OpenAI nem gera MP4 automaticamente.
- A fila de videos fica em `localStorage` do navegador do admin nesta primeira versao.
- Build de producao executado com sucesso, mantendo apenas warnings antigos de uso de `<img>`.

### Proximo passo recomendado
- Criar rotas seguras no servidor para HeyGen/OpenAI, persistir a fila em banco e definir o pipeline de edicao automatica com template de legenda/logo/CTA.

### Deploy
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-4ysw4v5if-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-13 - Integracao HeyGen em Videos IA

### O que foi feito
- Criada a rota server-side `POST/GET /api/heygen/videos` protegida por sessao admin.
- A rota usa `HEYGEN_API_KEY` no servidor e chama a API oficial do HeyGen sem expor a chave no frontend.
- A aba Videos IA recebeu campos `Avatar ID HeyGen` e `Voice ID HeyGen`.
- A fila de videos ganhou acoes para enviar roteiro ao HeyGen e consultar status/download do video.
- O script de videos foi versionado para `admin-videos.js?v=2`.
- `.env.example` recebeu `HEYGEN_API_KEY=` sem valor real.

### Arquivos modificados
- `../blog-pages/app/api/heygen/videos/route.ts`
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-videos.js`
- `../blog-pages/.env.example`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- Build de producao passou.
- A chave real nao foi gravada no repositorio.
- Para a producao gerar videos, `HEYGEN_API_KEY` precisa estar configurada nas variaveis de ambiente da Vercel.

### Proximo passo recomendado
- Configurar `HEYGEN_API_KEY` na Vercel, informar Avatar ID e Voice ID validos do HeyGen e testar o envio de um roteiro pequeno.

### Deploy da integracao HeyGen
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-n19h8yfoy-growths-projects-da44dbf7.vercel.app

## Sessao 2026-07-13 - Influencer por projeto em Videos IA

### O que foi feito
- Adicionado o bloco `Influencer do projeto` na aba Videos IA.
- Cada projeto agora pode salvar nome da influencer, URL de referencia visual, manual/persona, Avatar ID HeyGen e Voice ID HeyGen.
- Ao trocar o projeto, a tela carrega automaticamente a influencer cadastrada daquele projeto.
- O manual da influencer passa a entrar no roteiro gerado, ajudando a manter tom, postura e consistencia da personagem.
- O script de videos foi versionado para `admin-videos.js?v=3`.

### Arquivos modificados
- `../blog-pages/private/blog-admin.html`
- `../blog-pages/public/assets/js/admin/admin-videos.js`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `docs/sessions/2026-07-13.md`
- `CHANGELOG.md`

### Estado atual
- A configuracao da influencer fica em localStorage por projeto nesta etapa.
- A fidelidade visual continua dependente de usar sempre o mesmo `avatar_id`/look treinado no HeyGen para aquela influencer.
- Build de producao passou.

### Proximo passo recomendado
- Migrar os perfis de influencer para banco/API e permitir upload/armazenamento seguro dos manuais e imagens de referencia.

### Deploy de influencer por projeto
- URL de producao: https://blog.mbfinance.com.br
- URL direta do deploy: https://blog-mbfinace-4a3bp4n9h-growths-projects-da44dbf7.vercel.app

# Decisoes Tecnicas

## 2026-05-13 - Metrica de leads no painel

### Decisao
- A metrica "Leads Gerados" foi adicionada ao resumo do GA4 e exibida como primeiro card do painel.
- A API consulta `eventCount` para os eventos `lead_modal_open` e `conta_pj_lead_click`.

### Motivo
- O requisito era medir pessoas que clicaram para abrir a Conta PJ no site.
- O historico do projeto ja indicava eventos de conversao no dataLayer, incluindo abertura de modal de lead.
- Incluir `conta_pj_lead_click` deixa o painel pronto para um evento mais especifico de Conta PJ sem quebrar a coleta atual.

### Alternativas consideradas
- Contar apenas `generate_lead`: mais estrito, mas mede envio do formulario, nao clique para abrir Conta PJ.
- Contar apenas `lead_modal_open`: funciona com a coleta atual, mas pode misturar outros produtos se o site principal usar o mesmo modal.

## 2026-05-18 - Diagnostico de credencial GA4 invalida

### Decisao
- A API de analytics passou a reconhecer `invalid_grant` com `account not found` e retornar uma mensagem em pt-BR orientando a recriar/atualizar a service account.

### Motivo
- O painel publicado estava exibindo erro bruto do Google e os cards ficavam sem metricas.
- O erro acontece na autenticacao, antes das consultas ao GA4, entao a correcao real depende de credenciais/permissaes no Google Cloud e Vercel.

### Alternativas consideradas
- Ocultar o erro e mostrar apenas "GA4 indisponivel": reduziria ruido, mas esconderia a acao necessaria.
- Trocar a estrategia de autenticacao por OAuth de usuario: aumentaria complexidade e nao resolve a service account invalida ja configurada.

## 2026-05-25 - Telas visiveis no admin do blog

### Decisao
- A aba "Campanhas" passou a ter uma tela propria no admin, alimentada pelos posts ja carregados.
- O switch de abas agora usa "Metricas do site" como fallback quando o painel solicitado nao existe.
- A aba de newsletter foi apresentada como "E-mails" sem trocar os IDs internos, preservando compatibilidade com o JavaScript existente.

### Motivo
- Os prints mostravam a navegacao do admin funcionando, mas a area de conteudo vazia.
- Havia risco de aba sem `screen-*` correspondente deixar o usuario preso em uma tela em branco.
- Manter os IDs internos reduz o risco de quebrar funcoes ja existentes de newsletter, blog, banners e analytics.

### Alternativas consideradas
- Reescrever todo o admin como uma aplicacao React: melhor a longo prazo, mas alto risco para uma correcao urgente.
- Trocar todos os nomes internos de newsletter para e-mails: mais consistente, mas aumentaria o escopo e o risco de regressao.

## 2026-05-26 - Largura responsiva da lista de publicacoes

### Decisao
- A coluna lateral da aba Blog passou de largura fixa de `272px` para `clamp(340px, 24vw, 420px)`.
- A coluna ganhou uma alca manual de redimensionamento, com largura salva em `localStorage`.
- A alca foi desenhada como uma faixa sempre visivel e o script do core recebeu query string de versao.
- Em telas menores, a lista de publicacoes empilha acima do editor e ocupa 100% da largura.

### Motivo
- A largura anterior deixava titulos, categorias e status muito comprimidos, desperdicando espaco disponivel no admin.
- Uma largura responsiva melhora a leitura em desktop sem prender a interface a um unico tamanho de tela.
- O ajuste manual permite que cada usuario adapte o espaco entre lista e editor conforme o monitor e a rotina de edicao.
- A alca inicialmente discreta demais podia parecer inexistente; a faixa visivel reduz ambiguidade e facilita o uso.

### Alternativas consideradas
- Usar uma largura fixa maior: simples, mas menos adaptavel a notebooks e monitores grandes.
- Criar um painel de preferencias para o admin: mais completo, mas excessivo para uma necessidade de layout pontual.
- Reestruturar todo o editor do blog: desnecessario para o ajuste pontual solicitado.

## 2026-07-09 - Menu lateral no admin do blog

### Decisao
- A navegacao principal do admin foi movida para uma barra lateral esquerda dentro de `#admin-shell`.
- Os mesmos botoes, IDs e chamadas `switchTab(...)` foram mantidos.
- Em telas menores, a navegacao volta a se comportar como uma faixa horizontal rolavel.

### Motivo
- O pedido foi tirar o menu do formato horizontal e colocar em formato lateral.
- Preservar IDs e eventos reduz risco de regressao na troca de abas e nos modulos existentes.
- Manter fallback horizontal no mobile evita comprimir demais a area de conteudo.

### Alternativas consideradas
- Criar uma navegacao lateral nova do zero: desnecessario e mais arriscado para uma mudanca visual pontual.
- Manter lateral tambem no mobile: ocuparia espaco demais em telas estreitas.

## 2026-07-09 - Scroll no admin com menu lateral

### Decisao
- O container `#admin-body` passou a permitir rolagem vertical com `overflow-y: auto`.
- A rolagem horizontal continua bloqueada com `overflow-x: hidden` para evitar barra lateral indesejada.

### Motivo
- O menu lateral introduziu um wrapper com altura controlada, e `overflow: hidden` bloqueava a navegacao em telas longas.
- Permitir scroll no corpo do admin resolve o bloqueio sem alterar a logica das abas.

### Alternativas consideradas
- Remover a altura fixa do app inteiro: poderia fazer o menu lateral acompanhar o scroll e perder a ergonomia do painel.
- Colocar scroll individual em cada tela: exigiria mais regras CSS e maior risco de inconsistencia entre abas.

## 2026-07-09 - Nomenclatura e acoes do admin

### Decisao
- O menu principal passou a usar nomes orientados a fluxo: Visao geral, Campanhas e links, Conteudo, Newsletter e Anuncios.
- O topo passou a exibir apenas acoes frequentes: status, Publicar e Ver blog.
- Acoes operacionais menos frequentes foram agrupadas em Mais opcoes.

### Motivo
- Reduzir ruido visual no topo do painel.
- Tornar a navegacao mais clara para uma rotina de gestao de conteudo e campanhas.
- Evitar que configuracoes e exportacao concorram com a acao principal de publicar.

### Alternativas consideradas
- Manter todos os botoes no topo: preserva acesso direto, mas deixa a barra pesada.
- Remover Exportar backup: economiza espaco, mas a funcao ainda e util como seguranca operacional.

## 2026-07-09 - Sincronizacao do blog dentro da aba Conteudo

### Decisao
- A acao `syncOfficialBlog()` saiu do topo global e foi posicionada dentro da aba Conteudo com o rotulo `Atualizar blog`.

### Motivo
- A acao sincroniza posts/conteudo do blog, entao pertence ao fluxo editorial e nao ao topo global do painel.
- O rotulo `Atualizar blog` evita confusao com deploy/publicacao do sistema.

### Alternativas consideradas
- Manter no topo como Publicar: acesso rapido, mas sem contexto e com risco de confundir com deploy.
- Remover totalmente: arriscado, pois o fluxo atual ainda usa sincronizacao manual em alguns casos.

## 2026-07-10 - Fluxo da aba Campanhas e links

### Decisao
- A tela de campanhas foi reorganizada em fluxo guiado: contexto inicial, etapas de preenchimento, painel de link pronto, historico e mensagens para WhatsApp.
- A logica existente de UTMs, encurtamento e salvamento foi preservada mantendo os IDs consumidos por `admin-campaigns.js`.

### Motivo
- A tela anterior misturava formulario, resultado, historico e WhatsApp sem hierarquia clara, causando sensacao de bagunca.
- Separar criacao e resultado reduz carga cognitiva e deixa mais evidente qual acao fazer primeiro.

### Alternativas consideradas
- Remover campos tecnicos de UTM: simplificaria a tela, mas reduziria controle para canais personalizados.
- Criar abas internas para WhatsApp e historico: diminuiria a pagina, mas esconderia informacoes uteis e exigiria JS adicional.

## 2026-07-10 - Metricas por projeto e link personalizado

### Decisao
- A tela Campanhas e links passou a tratar Projeto como campo de organizacao dos links.
- Links curtos podem receber um apelido personalizado via `customCode`, validado na API de encurtamento.
- As metricas por link ficam diretamente na tabela de Links salvos, enquanto os cards superiores funcionam como resumo geral ou filtrado.

### Motivo
- Com varios links, cards agregados nao mostram qual campanha ou projeto gerou cada resultado.
- O usuario precisa comparar campanhas individualmente e localizar links por projeto.
- Apelidos personalizados tornam o link compartilhavel mais reconhecivel e facil de auditar.

### Alternativas consideradas
- Criar uma pagina separada de detalhes por link: mais completa, mas exigiria mais navegacao para uma necessidade imediata.
- Manter apenas cards globais: insuficiente quando existem varios projetos e campanhas ativos.

## 2026-07-10 - Projeto como filtro principal de Campanhas

### Decisao
- O filtro Projeto passou para o topo da aba Campanhas e links e controla a analise da tela.
- Projetos podem ser cadastrados na propria aba, com MB Finance e MB Negocios como projetos base.
- A primeira implementacao usa localStorage para manter velocidade de entrega sem criar nova infraestrutura.

### Motivo
- A operacao tera varios projetos, entao o usuario precisa escolher primeiro o projeto e ver todos os dados daquele contexto.
- Centralizar o filtro no topo evita que metricas globais sejam confundidas com metricas de um link/projeto especifico.

### Alternativas consideradas
- Criar uma tela separada so para projetos: mais organizado no futuro, mas adicionaria navegacao antes de validar o fluxo.
- Persistir em banco agora: mais robusto, mas aumentaria escopo e exigiria definicao de tabela/API.

## 2026-07-10 - Projetos fora da pagina de campanhas

### Decisao
- A gestao de projetos saiu da pagina Campanhas e links e foi movida para um modal aberto pelo menu principal.

### Motivo
- Projetos sao uma entidade global da plataforma, nao apenas um bloco da pagina de campanhas.
- A pagina de campanhas deve ficar focada em analise, filtro e criacao de links.

## 2026-07-10 - Reuso idempotente de apelido de link curto

### Decisao
- A API de encurtamento passou a permitir reutilizar um apelido personalizado quando ele ja existe e aponta para a mesma URL final.

### Motivo
- O preview da tela cria o link curto antes do usuario salvar, entao repetir a mesma combinacao de URL e apelido nao deve ser tratado como conflito.

### Alternativas consideradas
- Liberar sobrescrita de qualquer apelido existente: arriscado, pois poderia quebrar links ja divulgados.
- Remover o encurtamento do preview: exigiria mudanca maior no fluxo da tela.

## 2026-07-10 - Apelido liberado ao excluir link salvo

### Decisao
- A exclusao de um link salvo em Campanhas agora chama a API de encurtamento para remover o codigo curto correspondente.

### Motivo
- Antes, apagar o link removia apenas o registro local da tela, mas o apelido continuava reservado no Redis/API.
- O usuario espera que apagar um link com apelido deixe aquele apelido disponivel para uso novamente.

### Alternativas consideradas
- Permitir sobrescrever qualquer apelido existente: descartado porque poderia quebrar links ja publicados.
- Apagar apenas no localStorage: insuficiente, pois a reserva real fica no encurtador.

## 2026-07-10 - Liberacao manual de apelidos antigos

### Decisao
- A tela de Campanhas passou a exibir uma acao inline para liberar apelidos antigos quando a API informa conflito.

### Motivo
- Links apagados antes da correcao anterior podem nao existir mais no historico local, mas continuar reservados no encurtador.
- Sem essa acao, o usuario nao tem como liberar o apelido pela interface.

### Alternativas consideradas
- Criar uma tela separada de manutencao: melhor no futuro, mas maior do que a necessidade imediata.
- Liberar automaticamente qualquer conflito: arriscado, pois pode apagar um link que ainda esteja em uso.

## 2026-07-10 - Parametros UTM com orientacao de identificacao

### Decisao
- A tela de Campanhas passou a explicar os parametros UTM e a diferenca entre rastrear clique e identificar CNPJ.
- Instagram Bio e Facebook Bio foram adicionados como canais separados para facilitar comparacao de cliques por rede social.

### Motivo
- O usuario tem pouco conhecimento tecnico de UTMs e precisa entender o que cada campo faz antes de preencher.
- CNPJ nao deve ser tratado como dado automatico do clique; ele precisa vir de um formulario, WhatsApp ou CRM.

### Alternativas consideradas
- Adicionar campo CNPJ direto na URL: descartado por risco operacional e exposicao de dado na URL publica.
- Manter os campos tecnicos sem explicacao: rapido, mas mantem confusao no uso diario.

## 2026-07-10 - CPC como meio, nao canal

### Decisao
- A interface passou a diferenciar canal/plataforma de meio/tipo de trafego.
- CPC permanece como valor tecnico de utm_medium, mas a copy deixa claro que ele significa pago por clique, nao canal de aquisicao.

### Motivo
- Canal de aquisicao e a plataforma/origem, como Google, Instagram, Facebook, SMS ou parceiro.
- Meio descreve a natureza do trafego, como cpc, social, email, sms ou referral.

## 2026-07-10 - MVP de rastreio individual por cliente

### Decisao
- A primeira versao de Links por cliente foi implementada dentro da aba Campanhas e links, usando um link curto unico por cliente.
- O CNPJ nao e colocado na URL publica; a URL usa um token interno e o painel guarda o vinculo cliente/CNPJ localmente.

### Motivo
- Um link generico mede cliques totais, mas nao identifica quem clicou.
- Um link unico por cliente permite cruzar o codigo curto com o cliente e contar cliques individuais.
- Evitar CNPJ na URL reduz exposicao de dado sensivel.

### Alternativas consideradas
- Colocar CNPJ como parametro na URL: descartado por exposicao desnecessaria de dado.
- Criar banco/API dedicada agora: mais robusto, mas maior escopo; fica como proximo passo para persistencia multiusuario.

## 2026-07-13 - MVP de Videos IA no admin

### Decisao
- A primeira versao da ferramenta Videos IA foi implementada como uma aba propria do admin, separada de Campanhas e Conteudo.
- A tela gera roteiros e organiza uma fila local de producao, sem consumir APIs externas nesta etapa.
- A integracao com HeyGen/OpenAI fica para uma etapa server-side, para nao expor chaves no frontend e para permitir fila/persistencia.

### Motivo
- O usuario precisa organizar um processo em massa antes de automatizar a geracao real de MP4.
- Chamar HeyGen diretamente do navegador exporia credenciais e dificultaria controle de status, custos e retries.
- Separar a ferramenta em modulo proprio reduz risco de regressao nas abas atuais do admin.

### Alternativas consideradas
- Integrar HeyGen diretamente no primeiro passo: descartado por falta de chave/API validada e por risco de expor segredo no cliente.
- Manter tudo dentro de Conteudo ou Campanhas: descartado porque videos tem fluxo proprio de producao, aprovacao e exportacao.

## 2026-07-13 - HeyGen via rota server-side

### Decisao
- A integracao com HeyGen foi feita por rota server-side protegida por cookie de admin.
- O frontend envia apenas titulo, roteiro, avatar ID, voice ID e formato; a chave fica em `process.env.HEYGEN_API_KEY`.
- A tela permite enviar um roteiro por vez e consultar status manualmente nesta primeira etapa.

### Motivo
- Chave de API nao pode ficar em JavaScript publico do admin.
- Enviar um por vez reduz risco de consumo acidental de creditos enquanto a ferramenta ainda esta sendo validada.
- Consulta manual e suficiente para o MVP; webhook fica como melhoria seguinte.

### Alternativas consideradas
- Colocar a chave no frontend: descartado por exposicao de segredo.
- Disparar todos os roteiros automaticamente: descartado nesta etapa para evitar gasto em massa sem revisao.

## 2026-07-13 - Influencer IA por projeto

### Decisao
- A influencer foi modelada como configuracao do projeto dentro de Videos IA.
- A tela salva nome, referencia visual, manual, Avatar ID e Voice ID por projeto em localStorage.
- Ao selecionar um projeto, a influencer correspondente e aplicada automaticamente no lote.

### Motivo
- Cada projeto tera uma personagem propria e a troca manual de avatar/voz aumentaria risco de inconsistencias.
- A fidelidade do rosto depende de usar sempre o mesmo ativo treinado no HeyGen, entao o `avatar_id` precisa ficar associado ao projeto.
- Manter primeiro em localStorage acelera a validacao do fluxo antes de criar tabelas/API.

### Alternativas consideradas
- Deixar Avatar ID e Voice ID apenas como campos soltos: descartado porque facilita erro operacional entre projetos.
- Criar banco agora: melhor para producao, mas maior escopo; fica como proximo passo depois de validar o fluxo com um projeto.

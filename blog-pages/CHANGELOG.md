# Changelog


## 2026-07-13

- Reorganizado o card de influencer da aba Videos IA para suportar multiplas influencers por projeto.
- Adicionado filtro automatico de influencers ao trocar o projeto selecionado.
- A influencer Heena Duarte foi cadastrada como padrao inicial do projeto MB Negocios com IDs tecnicos do HeyGen.
- Roteiros em lote agora usam a influencer ativa do projeto e carregam o manual da personagem no briefing.

## 2026-06-02

- Adicionado seletor de dominio curto na aba Campanhas.
- A API de encurtamento passou a validar e retornar links com `mbnegocios.com.br` ou `mbfinance.com.br`.
- Preparada regra Apache da MB Finance para encaminhar `/c/[code]` ao contador central do blog.
- Destinos invalidos agora sao recusados antes da criacao do link curto.
- Destinos oficiais de WhatsApp foram adicionados a allowlist do redirecionador.

## 2026-05-26

- Alinhada a sidebar de produtos do `/blog` com os produtos oficiais do site principal.
- Ajustado o build removendo parametros/setters nao usados em rotas de analytics/comentarios.

## 2026-05-25

- Suavizado o design da sidebar de produtos e adicionado comportamento sticky com scroll interno.
- Transformado o menu de produtos da capa `/blog` em uma barra lateral esquerda.
- Removida a primeira secao/hero da capa `/blog`, iniciando a pagina direto pelo menu de produtos.
- Refeita a hero da capa `/blog` com CTAs e painel financeiro lateral para reforcar o hub de solucoes.
- A faixa "Escolha por necessidade" virou o menu principal de produtos da capa `/blog`, com Todos e Tributos adicionados e barra inferior removida.
- Evoluida a capa `/blog` para hub financeiro com cards de produtos e CTA para WhatsApp.
- Ajustado o topo de `/blog`: logo central maior, "Voltar ao site" a esquerda e hero com fundo branco.
- Transformado o card lateral "Guias rapidos" em "Mais acessadas" com ranking numerado.
- Substituidos os titulos vermelhos da capa `/blog` pelo azul marinho da MB Finance.
- Restaurada a hero anterior da pagina publica `/blog`, mantendo a nova listagem editorial abaixo.
- Reorganizada a capa publica `/blog` com layout editorial inspirado em portal de noticias, sem banners de anuncio.
- Corrigido o espacamento das colunas da lista de links salvos em Campanhas.
- Evoluida a tela Campanhas com resumo, filtros, status, objetivo, notas, duplicacao e barras de cliques.
- Adicionada confirmacao dupla para excluir links salvos em Campanhas.
- Corrigido o F5 do admin para manter a aba ativa aberta.
- Adicionada contagem de cliques por link encurtado na aba Campanhas do admin.
- Ajustado o espaÃ§amento da seta dos campos de seleÃ§Ã£o do admin.
- Refinados os espacamentos entre icones e textos dos botoes do admin.
- Substituidos emojis por icones SVG lineares na tela de Campanhas.
- Corrigido o aninhamento das telas do admin em `private/blog-admin.html`.
- As telas de Metricas, Campanhas, E-mails, Publicidade, Calendario e Gerador voltaram a ser filhas diretas de `#admin-body`.
- Resolvida a causa da area principal cinza/vazia em `/admin`.

## 2026-05-06

- Adicionados eventos `dataLayer` para GTM no blog e na pagina principal.
- Instrumentados cliques em WhatsApp, CTAs, newsletter, busca do blog, cliques em posts, scroll e conversoes de lead.
- Agrupadas paginas equivalentes no relatorio GA4 de paginas mais acessadas.
- Normalizados caminhos com `.html`, query string, hash e aliases da home antes da exibicao no painel.
- Estabilizado o hero do blog para reduzir CLS apontado pelo PageSpeed.
- Reservada largura para metadados de leitura do blog, como "8 min".
- Adicionados fallbacks de fonte mais estaveis para reduzir deslocamento durante carregamento.
- Adicionadas reservas de layout na home para reduzir CLS no PageSpeed.
- Definidas dimensoes explicitas para logos e imagens principais da pagina inicial.
- Estabilizada a largura dos contadores animados do hero.
- CSS do banner de cookies passou a carregar como stylesheet normal.

## 2026-05-05 - Analytics multisite

- Corrigida a chamada do painel de metricas para consultar a API do app Next em vez do dominio publico do site.
- Adicionado seletor de site no painel admin para alternar entre MB Finance, MB Negocios e Fomenta.
- Preparado o backend de GA4 para receber `?site=` e ler configuracoes por site via variaveis de ambiente.

## 2026-05-05

- Corrigida acentuaÃ§Ã£o de textos institucionais, home do blog, rodapÃ©, newsletter e mensagens do admin.
- Adicionados autor, data, tempo de leitura, schema `BlogPosting`, CTAs personalizados e leitura relacionada nos artigos.
- Enriquecidos os 5 artigos publicados com links internos, ajustes tÃ©cnicos e melhorias editoriais.
- Adicionadas fontes externas e FAQ ao artigo de Reforma TributÃ¡ria.
- Adicionado exemplo numÃ©rico ao artigo de AntecipaÃ§Ã£o de RecebÃ­veis.

## 2026-07-13 - Ajuste visual

- Ajustado o espacamento do card de influencers em Videos IA.
- O formulario de influencer agora fica em coluna unica para evitar campos espremidos e desalinhados.


## 2026-07-13 - Anexos de influencer

- Adicionados anexos de foto e manual no perfil de influencers da aba Videos IA.
- A foto anexada substitui as iniciais no card da personagem.
- Arquivos TXT/MD/JSON preenchem o resumo do manual; PDF/DOC/DOCX ficam salvos como anexo local.

## 2026-07-13 - PDF de manual

- Corrigido upload de PDF do manual da influencer usando IndexedDB para arquivos de ate 15 MB.
- O campo do manual agora informa suporte a PDF, DOC, TXT e MD.

## 2026-07-13 - Galeria visual da influencer

- Adicionada galeria de imagens de referencia da Helena Duarte na aba Videos IA.
- As referencias agora ficam publicadas junto ao projeto e podem ser aplicadas como foto principal da influencer.

## 2026-07-13 - Manual da Helena Duarte

- A aba Videos IA agora carrega o resumo manual da Helena Duarte no perfil padrao da influencer de MB Negocios.

## 2026-07-13 - Video unico e lote por calendario

- A aba Videos IA agora permite gerar um unico video ou um lote com datas planejadas para publicacao.

## 2026-07-13 - Uso do video e multiplas redes

- A ferramenta Videos IA agora permite definir se o roteiro sera para anuncios, conteudo de redes sociais ou ambos, com selecao de multiplas redes.

## 2026-07-13 - Filtro de redes por uso do video

- A selecao de redes na aba Videos IA agora muda conforme o uso escolhido e usa nomes mais curtos para canais organicos.

## 2026-07-13 - Linha editorial e Kanban de Videos IA

- A aba Videos IA agora possui linha editorial com pilares de conteudo e Kanban para administrar ideias ate a publicacao.

## 2026-07-13 - Remocao de cards auxiliares em Videos IA

- Removidos os cards Fluxo recomendado e Modelos rapidos da aba Videos IA.

## 2026-07-13 - Linha editorial em pagina propria

### Changed
- O Kanban de linha editorial foi movido para uma pagina dedicada no admin.
- A aba Videos IA ficou mais limpa, mantendo foco em criacao e fila de videos.
- A navegacao principal agora inclui Linha editorial.

## 2026-07-13 - Submenu em Videos IA

### Changed
- A Linha editorial agora fica como subaba dentro de Videos IA.
- O menu principal foi simplificado removendo a aba Linha editorial separada.

## 2026-07-13 - Kanban editorial ampliado

### Changed
- O Kanban da Linha editorial em Videos IA agora usa melhor a largura da tela e tem colunas maiores.

## 2026-07-13 - Ajuste visual em Criar videos

### Changed
- Removido o card fixo de integracao em Videos IA.
- A Fila de producao foi reposicionada para reduzir espaco em branco na subaba Criar videos.

## 2026-07-13 - Videos IA com melhor aproveitamento lateral

### Changed
- A tela Videos IA agora usa melhor a largura disponivel no admin, reduzindo campos espremidos e espaco lateral desperdicado.

## 2026-07-13

- Videos IA: substituida a escolha de canais por perfis conectados de Instagram/Facebook por projeto, preparando o fluxo futuro de agendamento de postagens.

## 2026-07-13

- Videos IA: adicionada conexao OAuth real com a Meta para importar paginas do Facebook e perfis profissionais do Instagram vinculados ao projeto.

## 2026-07-13

- Videos IA: corrigido retorno do popup Meta para salvar paginas conectadas como fallback quando o Instagram ainda nao esta liberado pela Meta.


## 2026-07-13

- Videos IA: corrigido cache e retorno do popup de conexao Meta para exibir a pagina conectada no card Perfis conectados.


## 2026-07-13

- Videos IA: retorno da conexao Meta ficou resiliente com localStorage compartilhado entre popup e admin.


## 2026-07-13 - Retorno OAuth Meta em Videos IA

- Callback da Meta agora mostra uma pagina de confirmacao no dominio do blog em vez de fechar o popup automaticamente.
- Admin Videos IA captura o retorno por `postMessage`, `localStorage`, evento `storage`, foco da janela e fechamento do popup.
- `admin-videos.js` atualizado para `v=22`.

## 2026-07-13 - Reautorizacao Meta

- OAuth da Meta agora usa `auth_type=rerequest` e `return_scopes=true` para facilitar revisar permissoes e paginas concedidas.
- Mensagem de nenhuma pagina encontrada passou a orientar uso de `Editar configuracoes` na Meta.

## 2026-07-13 - Seleção de ativos Meta por projeto

- Vídeos IA agora conecta a conta Meta/Facebook uma vez e separa a escolha de Página/Instagram por projeto.
- A lista de ativos foi dividida entre Página do Facebook e Instagram profissional.
- `admin-videos.js` atualizado para `v=23`.

## 2026-07-13 - Callback Meta automatico

- Callback da Meta agora fecha o popup ou redireciona para `/admin#videos` automaticamente apos enviar o resultado ao admin.

## 2026-07-13 - Instagram no callback Meta

- Callback Meta agora importa Instagram profissional sempre que `instagram_business_account` vier no retorno da Graph API, independentemente do botao usado para iniciar a conexao.

## 2026-07-13 - Aviso removido em Videos IA

- Removido o card informativo fixo de video unico/lote da subaba Criar videos.

## 2026-07-13 - Videos IA como gerador de conteudo

- Subaba Criar videos virou Gerador de conteudo.
- Produto passou a permitir selecao multipla.
- Quantidade agora significa quantidade de ideias de conteudo geradas.
- Campos de agendamento de lote foram removidos do fluxo principal.
- `admin-videos.js` atualizado para `v=24`.

## 2026-07-13 - Ideias geradas legiveis

- Videos IA: ideias geradas agora aparecem como cards expansíveis, com roteiro em bloco proprio e metadados visiveis.
- `admin-videos.js` atualizado para `v=25`.

## 2026-07-14 - Cache do admin Videos IA

- Admin agora evita cache em `/admin` e scripts administrativos para carregar mudancas imediatamente apos deploy.
- `admin-videos.js` atualizado para `v=26`.

## 2026-07-14 - Influencer recolhivel

- Videos IA: o card de influencer agora abre recolhido por padrao e mostra a configuracao completa apenas ao clicar em `Editar`.
- `admin-videos.js` atualizado para `v=27`.

## 2026-07-14 - Coluna da influencer compacta

- Videos IA: a coluna lateral da influencer foi reduzida para liberar mais largura ao gerador de conteudo.
- `admin-videos.js` atualizado para `v=28`.

## 2026-07-14 - Reversao largura da influencer

- Videos IA: revertida a reducao de largura da coluna da influencer, mantendo o card recolhivel.
- `admin-videos.js` atualizado para `v=29`.

## 2026-07-14 - Remotion em Videos IA

- Videos IA: adicionada etapa Remotion para edicao automatica apos o MP4 do HeyGen.
- Novos status: Aguardando Remotion, Editando no Remotion e Video editado.
- CSV de Videos IA agora inclui Remotion e video final.
- `admin-videos.js` atualizado para `v=30`.

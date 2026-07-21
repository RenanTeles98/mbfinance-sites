# Decisões Técnicas

## 2026-05-05

- Decisão: corrigir os problemas editoriais em duas camadas, no JSON versionado e no template de artigo.
  - Motivo: o projeto pode ler posts de arquivo local, Supabase ou KV; o template idempotente evita regressão visual mesmo quando o storage ativo ainda estiver desatualizado.
  - Alternativas consideradas: alterar apenas `content/blog-posts.json`, mas isso não garantiria correção imediata em ambientes que leem banco.

- Decisão: manter todas as CTAs apontando para WhatsApp.
  - Motivo: regra explícita do projeto.
  - Alternativas consideradas: criar rotas ou formulários temáticos, descartado por contrariar as instruções.

- Decisão: adicionar `BlogPosting` JSON-LD diretamente no template do artigo.
  - Motivo: melhora SEO técnico sem criar dependência nova nem alterar a arquitetura.
  - Alternativas consideradas: criar componente separado de schema, descartado por ser pequeno e específico.

- Decisão: adicionar links relacionados no final dos artigos além dos links inline.
  - Motivo: reforça o cluster temático capital de giro, antecipação e fluxo de caixa sem depender apenas do corpo do texto.
  - Alternativas consideradas: automatizar por categoria, descartado porque os 5 posts têm relações editoriais específicas.
## 2026-05-05 - Analytics multisite

- Decisao: manter um unico endpoint `/api/analytics/overview` e selecionar o site por `?site=`.
  - Motivo: evita criar rotas novas para cada braco da empresa e centraliza autenticacao/consulta GA4.
  - Alternativas consideradas: criar endpoints separados por marca, descartado por duplicar logica.

- Decisao: o frontend deve consultar a API do painel (`getApiBase`) e nao `mb_site_domain`.
  - Motivo: `mb_site_domain` representa o dominio publico do site e pode nao hospedar a rota `/api/analytics/overview`, o que quebrava os dados atuais da MB Finance.
  - Alternativas consideradas: manter a chamada no dominio publico, descartado por gerar 404/CORS quando o site publico nao e o app Next.

- Decisao: suportar variaveis por site e tambem `GA4_SITES` em JSON.
  - Motivo: permite comecar simples com variaveis individuais e migrar para lista configuravel quando novos bracos entrarem.
  - Alternativas consideradas: hardcode de propriedades no codigo, descartado por expor configuracao sensivel e dificultar manutencao.
## 2026-05-06 - CLS da home

- Decisao: corrigir primeiro causas estruturais de CLS na home estatica em vez de redesenhar secoes.
  - Motivo: PageSpeed apontou troca de layout, e as principais causas locais eram dimensoes ausentes, contadores animados e estilos carregados tardiamente.
  - Alternativas consideradas: substituir a estrutura da home por componentes Next, descartado por ser mudanca maior e fora do escopo imediato.

- Decisao: reservar largura para os contadores animados em CSS.
  - Motivo: trocar `0+` por `200k+` ou `R$ 1.5 Bi` durante a animacao pode deslocar os itens vizinhos.
  - Alternativas consideradas: remover animacao dos contadores, descartado por preservar a experiencia atual.

- Decisao: manter troca de logo no navbar, mas impedir atribuicao repetida do mesmo `src`.
  - Motivo: reduz trabalho visual desnecessario no scroll/hover sem alterar comportamento.
  - Alternativas consideradas: remover troca de logo, descartado por impacto visual maior no header.

## 2026-05-06 - CLS do blog

- Decisao: estabilizar o hero do blog com altura minima e reserva para o conteudo interno, preservando o layout atual.
  - Motivo: PageSpeed apontou o `blog-hero` como principal causa de troca de layout, e reservar espaco ataca o problema sem redesenhar a pagina.
  - Alternativas consideradas: refazer a estrutura visual do hero, descartado por ser uma mudanca maior que o necessario para a melhoria de CLS.

- Decisao: reservar largura para metadados curtos como tempo de leitura.
  - Motivo: o elemento "8 min" apareceu no relatorio e pode se deslocar durante troca de fonte.
  - Alternativas consideradas: remover o tempo de leitura, descartado por reduzir informacao util do card/artigo.

- Decisao: manter a fonte atual e melhorar fallbacks em vez de trocar tipografia.
  - Motivo: reduz shift durante carregamento de fontes sem alterar a identidade visual do blog.
  - Alternativas consideradas: usar apenas fonte do sistema, descartado por mudar mais o visual.

## 2026-05-06 - Agrupamento de paginas no GA4

- Decisao: normalizar e agrupar paginas equivalentes no backend antes de enviar os dados ao painel.
  - Motivo: o GA4 pode retornar a mesma pagina separada por variacoes de caminho, como `/`, `/index.html`, `.html`, query string ou hash, criando duplicidade no ranking.
  - Alternativas consideradas: corrigir apenas a exibicao no JavaScript do admin, descartado porque outros consumidores da API continuariam recebendo dados duplicados.

- Decisao: buscar ate 50 linhas no GA4 e somente depois cortar o top 10 agrupado.
  - Motivo: agrupar depois de buscar apenas 10 linhas poderia esconder paginas relevantes quando varias entradas duplicadas ocupassem o topo.
  - Alternativas consideradas: manter limite 10 por simplicidade, descartado por reduzir qualidade do ranking final.

## 2026-05-06 - Eventos GTM e conversoes

- Decisao: instrumentar eventos no `dataLayer` em vez de depender apenas de seletores de clique no GTM.
  - Motivo: nomes de eventos ficam estaveis entre blog e pagina principal, e o GTM passa a receber contexto como area, texto do clique, produto e caminho.
  - Alternativas consideradas: configurar apenas Click Triggers no GTM, descartado porque seria mais fragil a mudancas de classe/texto e menos preciso para conversoes de lead.

- Decisao: usar `generate_lead` como evento principal de conversao.
  - Motivo: e o evento recomendado para medir lead concluido e acontece quando o formulario de lead envia o usuario para WhatsApp.
  - Alternativas consideradas: marcar todo clique em WhatsApp como conversao, descartado porque cliques iniciais podem abrir modal sem gerar lead completo.

## 2026-05-25 - Telas do admin devem ser filhas diretas de `#admin-body`

- Decisao: corrigir o HTML de `private/blog-admin.html` fechando `post-form`, `editor-panel` e `blog-section-posts` antes das demais telas.
  - Motivo: `screen-analytics` e as outras telas estavam aninhadas dentro de `screen-posts`; como `screen-posts` fica `display:none` quando a aba Blog nao esta ativa, nenhuma tela filha podia aparecer visualmente.
  - Alternativas consideradas: continuar ajustando altura/overflow/cache, descartado porque o DOM provou que o problema era estrutural de aninhamento.

- Decisao: manter o padrao de SPA simples com todas as telas administrativas como filhos diretos de `#admin-body`.
  - Motivo: o `switchTab` espera buscar e ativar `#screen-*` no mesmo nivel visual; aninhar telas dentro de outra tela quebra esse contrato.
  - Alternativas consideradas: mudar o JavaScript para procurar telas aninhadas, descartado porque preservaria markup invalido e fragilizaria futuras abas.

## 2026-05-25 - Icones formais no admin

- Decisao: substituir emojis usados como icones estruturais por SVGs lineares inline nos botoes do admin.
  - Motivo: a interface administrativa precisa de uma linguagem visual mais formal e consistente; emojis variam por sistema operacional e quebram alinhamento fino com texto.
  - Alternativas consideradas: importar uma biblioteca de icones, descartado nesta rodada para evitar dependencia nova em um HTML servido diretamente por `private/blog-admin.html`.

- Decisao: centralizar os icones dinamicos da tela "Campanhas" em helpers de `admin-campaigns.js`.
  - Motivo: acoes como copiar e salvar trocam o conteudo do botao em runtime; helpers evitam que o JavaScript remova os SVGs e volte para texto desalinhado.
  - Alternativas consideradas: deixar os estados temporarios apenas com `textContent`, descartado porque causava perda de padrao visual apos interacoes.

## 2026-05-25 - Selects com seta customizada

- Decisao: aplicar uma seta SVG discreta via CSS global para os campos `select` do admin.
  - Motivo: a seta nativa do navegador estava muito próxima da borda direita em alguns campos, deixando a interface desalinhada.
  - Alternativas consideradas: ajustar cada classe de select individualmente, descartado porque o admin tem selects em várias telas e alguns usam estilo inline.

## 2026-05-25 - Cliques de campanhas pelo encurtador

- Decisao: contar cliques dos links de campanha no redirecionamento `/c/[code]`.
  - Motivo: esse e o ponto mais confiavel para medir cliques reais nos links gerados pelo painel, sem depender de GA4 ou do carregamento da pagina de destino.
  - Alternativas consideradas: usar apenas sessoes do GA4 por UTM, descartado para esta metrica porque GA4 mede sessoes/usuarios e pode perder cliques bloqueados, recusados ou que nao carregam analytics.

- Decisao: mostrar cliques apenas para links salvos com `shortCode`.
  - Motivo: links antigos salvos apenas como URL UTM nao possuem codigo do encurtador para consultar no storage.
  - Alternativas consideradas: tentar inferir por `utm_campaign`, descartado porque misturaria acessos de canais diferentes e deixaria de ser contagem por link gerado.

## 2026-05-25 - Persistencia da aba ativa

- Decisao: persistir a aba ativa do admin em `localStorage` e no hash da URL.
  - Motivo: ao dar F5, o painel voltava para "Metricas do site", interrompendo o fluxo de trabalho em abas como "Campanhas".
  - Alternativas consideradas: usar apenas `localStorage`, descartado porque o hash tambem permite recarregar/compartilhar uma URL que abre direto na aba correta.

## 2026-05-25 - Confirmacao dupla na exclusao de links

- Decisao: usar confirmacao inline em dois cliques para excluir links salvos.
  - Motivo: evita exclusao acidental sem abrir modal ou `confirm()` do navegador, mantendo o fluxo rapido dentro da tabela.
  - Alternativas consideradas: usar `window.confirm`, descartado por ser mais bruto visualmente e menos consistente com o painel.

## 2026-05-25 - Campanhas como ferramenta operacional

- Decisao: evoluir a tela de Campanhas com resumo, filtros, status, objetivo, notas e duplicacao de links.
  - Motivo: a tela deixou de ser apenas um gerador de UTM e passou a apoiar o acompanhamento diario das campanhas.
  - Alternativas consideradas: criar telas separadas para relatorios e cadastro, descartado porque aumentaria a navegacao e deixaria o fluxo mais lento.

- Decisao: manter dados operacionais dos links salvos no `localStorage` do admin.
  - Motivo: a estrutura atual dos links salvos ja usa armazenamento local; manter o padrao reduz risco e evita criar banco novo para essa rodada.
  - Alternativas consideradas: migrar tudo para Redis/servidor, descartado por ser uma mudanca maior e exigir uma estrategia de migracao dos links ja salvos.

## 2026-05-25 - Capa publica do blog em formato editorial

- Decisao: reorganizar `/blog` como uma capa editorial inspirada em portais de noticia, com barra compacta, indicadores, manchete principal, destaques laterais, lista de artigos e sidebar.
  - Motivo: a referencia enviada pelo usuario valoriza escaneabilidade, hierarquia clara e leitura continua; esse formato e mais adequado para um blog de conteudo financeiro do que uma home promocional.
  - Alternativas consideradas: copiar banners e blocos publicitarios da referencia, descartado porque o usuario pediu para ignorar anuncios e porque eles atrapalhariam o foco editorial.

- Decisao: usar imagens dos posts como `background-image` nos cards da capa.
  - Motivo: permite cortes consistentes no layout editorial e evita introduzir novos avisos de `<img>` na pagina `/blog`.
  - Alternativas consideradas: trocar para `next/image` nesta rodada, descartado para manter a mudanca concentrada no layout da capa sem mexer no contrato de dados dos posts.

- Decisao: aumentar o respiro entre as colunas da tabela de Campanhas e truncar badges longos de canal.
  - Motivo: os prints mostravam sobreposicao visual entre "Canal" e "Status" quando o nome do canal era comprido.
  - Alternativas consideradas: reduzir o texto do canal no JavaScript, descartado porque esconderia informacao util; o CSS deve acomodar nomes longos.

## 2026-05-25 - Hero anterior preservada no blog

- Decisao: restaurar a hero anterior da pagina `/blog` e manter a nova listagem editorial abaixo dela.
  - Motivo: o usuario avaliou que a hero anterior tinha aparencia melhor e ela reforca melhor a marca MB Finance no primeiro viewport.
  - Alternativas consideradas: manter a barra compacta estilo portal, descartado porque deixava a primeira dobra mais fria e menos proprietaria para a marca.

- Decisao: manter o logo em imagem na hero/nav restaurada.
  - Motivo: preserva a mesma leitura visual da versao anterior solicitada pelo usuario.
  - Alternativas consideradas: usar logo textual para evitar warning de `<img>`, descartado nesta rodada por alterar demais o visual que o usuario pediu para recuperar.

## 2026-05-25 - Azul marinho nos titulos editoriais

- Decisao: substituir o vermelho dos titulos da capa publica do blog por azul marinho `#003956`.
  - Motivo: vermelho remetia a identidade do G1 e nao faz parte da linguagem visual principal da MB Finance.
  - Alternativas consideradas: usar azul claro `#0099dd`, descartado para titulos longos porque o marinho tem melhor legibilidade e peso editorial.

## 2026-05-25 - Card lateral como Mais acessadas

- Decisao: renomear o card "Guias rapidos" para "Mais acessadas" e exibir os links como ranking numerado.
  - Motivo: a capa do blog agora tem linguagem de portal editorial; "Mais acessadas" e mais familiar para leitores do que "Guias rapidos".
  - Alternativas consideradas: usar "Noticias quentes", descartado por soar mais sensacionalista e menos adequado ao tom financeiro da MB Finance.

- Decisao: manter a lista alimentada pelos posts recomendados ate haver ranking real por analytics.
  - Motivo: evita prometer uma ordenacao baseada em audiencia sem dados confiaveis por post.
  - Alternativas consideradas: criar numeros falsos de acessos, descartado por prejudicar confiabilidade editorial.

## 2026-05-25 - Hero clara para hub financeiro

- Decisao: manter apenas a barra de menu em azul e mudar a area da headline da capa `/blog` para fundo branco.
  - Motivo: o blog esta evoluindo para um hub de produtos financeiros; uma hero clara reduz peso visual e deixa a comunicacao mais institucional.
  - Alternativas consideradas: manter toda a hero azul, descartado porque dava aspecto de landing page fechada e menos modular.

- Decisao: centralizar e ampliar a logo na barra azul, com "Voltar ao site" visualmente a esquerda.
  - Motivo: reforca a marca no topo sem competir com a headline e cria uma navegacao mais equilibrada.
  - Alternativas consideradas: manter logo a esquerda e voltar a direita, descartado por parecer uma estrutura de blog comum e menos proprietaria.

## 2026-05-25 - Capa como hub de produtos financeiros

- Decisao: adicionar uma faixa "Escolha por necessidade" com cards para Credito empresarial, Conta PJ, Antecipacao e Gestao financeira.
  - Motivo: a pagina precisa deixar de parecer apenas um blog e comunicar a MB Finance como hub de solucoes financeiras.
  - Alternativas consideradas: manter apenas filtros de categoria, descartado porque filtros parecem navegacao editorial e nao entrada por necessidade de negocio.

- Decisao: usar fundo azul claro na faixa de produtos e cards brancos com pequenos acentos de cor.
  - Motivo: cria uma composicao mais amigavel que separa as secoes sem pesar a tela com grandes blocos escuros.
  - Alternativas consideradas: manter tudo em branco/cinza, descartado porque a pagina ficava fria e com pouca orientacao visual.

- Decisao: inserir uma CTA clara antes do footer apontando para WhatsApp.
  - Motivo: suaviza a transicao para o rodape escuro e cria caminho direto para atendimento sem criar rota nova.
  - Alternativas consideradas: usar link para secao de contato do site, descartado porque CTAs do projeto devem apontar para WhatsApp.

## 2026-05-25 - Faixa de produtos como menu principal

- Decisao: usar a faixa "Escolha por necessidade" como menu de categorias do hub, incluindo Todos, Credito, Gestao, Conta PJ, Antecipacao e Tributos.
  - Motivo: evita duplicar duas navegacoes para a mesma funcao e aproxima a pagina de um hub de produtos, nao de um blog com filtros tradicionais.
  - Alternativas consideradas: manter a barra horizontal antiga abaixo dos cards, descartado por redundancia e excesso visual.

- Decisao: remover a barra de filtros inferior da capa `/blog`.
  - Motivo: os cards passam a cumprir a funcao de navegacao e filtragem com mais contexto para o usuario.
  - Alternativas consideradas: transformar a barra antiga em menu secundario sticky, descartado nesta rodada para manter a tela mais limpa.

## 2026-05-25 - Hero com painel de solucoes financeiras

- Decisao: transformar a hero da capa `/blog` em uma composicao de duas colunas, com mensagem e CTAs a esquerda e painel financeiro a direita.
  - Motivo: a hero anterior estava correta, mas visualmente fraca diante da nova faixa de produtos; o painel reforca a ideia de hub financeiro.
  - Alternativas consideradas: manter apenas texto centralizado, descartado por parecer blog institucional generico.

- Decisao: usar CTA principal para WhatsApp e CTA secundario para a faixa de produtos.
  - Motivo: cria dois caminhos claros: atendimento comercial ou exploracao autonoma das solucoes.
  - Alternativas consideradas: deixar a busca como acao principal, descartado porque busca e util, mas nao comunica valor comercial do hub.

- Decisao: manter o painel financeiro como UI abstrata, sem numeros reais.
  - Motivo: evita expor ou inventar metricas, mas cria contexto visual de produtos financeiros.
  - Alternativas consideradas: mostrar valores/taxas, descartado porque poderia gerar promessa comercial desatualizada.

## 2026-05-25 - Remocao da primeira secao do hub

- Decisao: remover a hero/painel financeiro da capa `/blog`.
  - Motivo: o usuario avaliou que a secao ficou visualmente ruim e pediu para tirar essa primeira secao do site.
  - Alternativas consideradas: refinar a hero novamente, descartado porque o pedido foi remover a secao.

- Decisao: manter a faixa de produtos como primeira area apos a barra azul.
  - Motivo: ela ja funciona como menu principal do hub e concentra a navegacao por necessidade.
  - Alternativas consideradas: recolocar uma headline simples acima da faixa, descartado nesta rodada para atender a remocao direta.

## 2026-05-25 - Menu lateral de produtos

- Decisao: transformar os cards horizontais de produtos em uma sidebar esquerda.
  - Motivo: reduz a altura inicial da pagina e deixa a navegacao por produto sempre proxima do conteudo editorial.
  - Alternativas consideradas: manter a faixa horizontal, descartado porque ocupava muita area antes dos artigos.

- Decisao: manter a sidebar fixa apenas no desktop.
  - Motivo: em telas largas a navegacao lateral ajuda; em telas menores, sidebar fixa prejudicaria leitura e espaco util.
  - Alternativas consideradas: esconder o menu no mobile, descartado porque removeria a principal navegacao por produto.

## 2026-05-25 - Sidebar de produtos mais discreta

- Decisao: suavizar a sidebar de produtos com tipografia menor, pesos menos agressivos e estado ativo por faixa lateral azul.
  - Motivo: a versao anterior chamava mais atencao que os artigos e deixava a navegacao pesada visualmente.
  - Alternativas consideradas: manter cards grandes dentro da sidebar, descartado porque ocupava espaco e competia com o conteudo.

- Decisao: usar `position: sticky` com `max-height` e scroll interno no desktop.
  - Motivo: a navegacao deve acompanhar o usuario durante a leitura, mas sem cortar itens em telas menores.
  - Alternativas consideradas: sidebar fixa absoluta, descartado por risco de sobrepor conteudo e piorar responsividade.

## 2026-05-26 - Produtos reais na sidebar do blog

- Decisao: substituir as categorias editoriais da sidebar pelos produtos reais do site principal.
  - Motivo: a sidebar deve funcionar como navegacao de produtos da MB Finance, nao como lista generica de categorias do blog.
  - Alternativas consideradas: manter Credito/Gestao/Conta PJ/Antecipacao/Tributos, descartado porque ficava diferente da oferta oficial do site.

- Decisao: produtos sem categoria editorial dedicada filtram para "Todos".
  - Motivo: evita que Maquina de Cartao, Seguros e Consorcios ou Telemedicina abram uma lista vazia enquanto ainda nao existem artigos especificos.
  - Alternativas consideradas: esconder esses produtos ate ter conteudo, descartado porque o pedido foi refletir os produtos do site principal.

- Decisao: manter o sticky CSS existente e reforcar o deploy com a lista atualizada.
  - Motivo: o comportamento sticky ja esta definido no CSS; a validacao principal agora e confirmar a versao publicada no Vercel.
  - Alternativas consideradas: usar JavaScript para fixar a sidebar no scroll, descartado porque CSS sticky e mais simples e menos sujeito a bugs.

## 2026-06-02 - Dominio curto selecionavel por campanha

- Decisao: permitir a escolha entre `mbnegocios.com.br` e `mbfinance.com.br` ao gerar um link curto.
- Motivo: campanhas da MB Finance precisam usar o dominio da propria marca sem separar o contador de cliques.
- Seguranca: a API aceita somente bases cadastradas em allowlist.
- Infraestrutura: `mbfinance.com.br/c/[code]` encaminha ao redirecionador central do blog por regra Apache.
- Validacao: destinos sao verificados antes de salvar o codigo e novamente no redirecionamento.
- WhatsApp: `wa.me`, `api.whatsapp.com` e `whatsapp.com` sao permitidos porque fazem parte dos CTAs oficiais do site.

## 2026-07-13 - Influencers por projeto em Videos IA

- Decisao: cada projeto pode ter sua propria lista de influencers, filtrada automaticamente pelo projeto selecionado.
- Motivo: um projeto pode ter uma identidade/personagem diferente, e os IDs de voz/aparencia nao devem aparecer misturados entre marcas.
- Decisao: manter o cadastro inicial em `localStorage` nesta etapa.
- Motivo: permite validar fluxo, layout e integracao com HeyGen antes de criar persistencia em banco.
- Decisao: salvar manual, referencia visual, ID de aparencia e Voice ID dentro do perfil da influencer.
- Motivo: preserva fidelidade de rosto/voz e evita preencher IDs tecnicos a cada lote.
- Alternativas consideradas: manter um unico card por projeto, descartado porque nao escala para multiplas personagens; criar backend agora, adiado ate validar o fluxo operacional.

## 2026-07-13 - Card de influencers em coluna unica

- Decisao: usar coluna unica no formulario de influencer dentro da lateral da aba Videos IA.
- Motivo: a lateral nao tem largura suficiente para duas colunas sem quebrar labels, inputs e textarea.
- Alternativas consideradas: aumentar a largura da coluna direita inteira, descartado porque reduziria espaco do formulario principal de lote.

## 2026-07-13 - Anexos locais no perfil da influencer

- Decisao: salvar a foto da influencer como imagem compactada em `localStorage` nesta etapa.
- Motivo: permite validar a experiencia visual sem criar storage de arquivos antes do fluxo estar aprovado.
- Decisao: aceitar documento de manual como anexo local e extrair texto apenas de TXT/MD/JSON.
- Motivo: PDF/DOC/DOCX exigem parser ou backend; anexar o arquivo ja resolve a organizacao do perfil sem aumentar a complexidade agora.
- Alternativas consideradas: criar upload em storage agora, adiado ate a ferramenta deixar de ser local por navegador.

## 2026-07-13 - PDFs de manual em IndexedDB

- Decisao: armazenar PDFs/DOCs de manual em IndexedDB, mantendo no perfil apenas chave, nome, tipo e tamanho.
- Motivo: `localStorage` tem limite pequeno e falha ao salvar PDFs maiores.
- Alternativas consideradas: aumentar o limite em `localStorage`, descartado porque a falha continuaria dependendo do navegador; backend/storage continua sendo o destino final para uso multiusuario.

## 2026-07-13 - Referencias visuais publicas por influencer

### Decisao
- As imagens de referencia da Helena Duarte foram copiadas para `public/images/influencers/helena-duarte/` e vinculadas ao perfil padrao da influencer.
- Perfis existentes no navegador recebem a galeria por merge, preservando campos ja salvos como IDs de aparencia e voz.

### Motivo
- O usuario precisa consultar as referencias visuais dentro da ferramenta sem depender de caminhos locais do computador.
- Manter as imagens em `public/images` torna os assets acessiveis no admin publicado e evita quebrar no deploy.

### Alternativas consideradas
- Continuar usando apenas URL manual: simples, mas nao resolve o fluxo de varias fotos de referencia.
- Armazenar em banco/storage agora: mais robusto, mas maior escopo para a etapa atual.

## 2026-07-13 - Manual padrao da Helena Duarte

### Decisao
- O resumo manual da Helena Duarte foi salvo como constante no modulo `admin-videos.js` e associado ao perfil padrao da influencer em MB Negocios.
- O merge preserva ajustes locais do usuario e preenche o manual apenas quando o perfil salvo ainda nao tem manual.

### Motivo
- O manual precisa orientar a geracao de roteiros sem depender de colagem manual a cada uso.
- Preservar dados locais evita sobrescrever configuracoes ja feitas no navegador do admin.

## 2026-07-13 - Videos IA com criacao unica e lote agendado

### Decisao
- A tela Videos IA passou a ter duas acoes separadas: gerar um unico roteiro ou gerar lote.
- O lote recebeu planejamento simples por data inicial e intervalo entre videos.

### Motivo
- A ferramenta precisa atender tanto demandas pontuais quanto producao em volume para dias diferentes.
- Separar as acoes evita que o usuario precise usar quantidade 1 como workaround para criar apenas um video.

## 2026-07-13 - Videos com uso e multiplas redes

### Decisao
- O campo Canal foi substituido por selecao multipla de redes.
- Foi adicionado o campo Uso do video para diferenciar anuncios pagos, conteudo organico ou reaproveitamento em ambos.

### Motivo
- Um mesmo video pode ser publicado em varias redes, entao limitar a um unico canal criava uma decisao artificial.
- O roteiro precisa mudar conforme o objetivo de uso, principalmente entre conteudo organico e anuncio pago.

## 2026-07-13 - Redes filtradas por uso do video

### Decisao
- A lista de redes passa a ser filtrada pelo uso escolhido: organico, pago ou ambos.
- Nomes de canais organicos foram simplificados para a plataforma/formato principal, sem sufixos como Reels/Shorts.

### Motivo
- Mostrar todos os canais para qualquer uso confundia o fluxo.
- O usuario quer decidir primeiro se o video e conteudo, anuncio ou ambos; a lista de canais precisa responder a essa decisao.

## 2026-07-13 - Kanban de linha editorial em Videos IA

### Decisao
- A primeira versao da linha editorial foi implementada dentro da aba Videos IA, com pilares fixos e Kanban salvo em localStorage.

### Motivo
- O fluxo diario de producao precisa administrar ideias e status antes da geracao de roteiro/video.
- Manter localStorage nesta etapa preserva velocidade de validacao sem criar novas tabelas antes do fluxo estar fechado.

## 2026-07-13 - Remocao dos cards auxiliares de Videos IA

### Decisao
- Remover da interface os cards Fluxo recomendado e Modelos rapidos.

### Motivo
- Esses cards estavam ocupando espaco visual e repetindo orientacoes que agora fazem menos sentido apos a criacao da linha editorial e do fluxo mais completo.

## 2026-07-13 - Linha editorial em pagina dedicada

### Decisao
- O Kanban editorial foi separado da aba Videos IA e passou a ter uma tela propria no admin.
- A tela usa o mesmo armazenamento e funcoes existentes, mas com layout mais amplo e colunas maiores.

### Motivo
- O Kanban dentro do gerador de videos deixava as informacoes comprimidas e dificultava mover/ler cards.
- Linha editorial e uma rotina de planejamento anterior ao video, entao faz sentido estar em uma pagina independente.

### Alternativas consideradas
- Apenas aumentar o card dentro de Videos IA: reduziria pouco a compressao e manteria fluxos diferentes na mesma tela.
- Criar outro sistema de Kanban do zero: desnecessario para a necessidade atual, ja que a logica existente funcionava.

## 2026-07-13 - Submenu para fluxos de Videos IA

### Decisao
- A Linha editorial foi mantida dentro da pagina Videos IA como subaba, em vez de aparecer no menu principal.
- O menu principal continua mais enxuto e a pagina Videos IA concentra criacao, planejamento editorial, influencer e fila de producao.

### Motivo
- A linha editorial faz parte do processo de criacao de videos com IA, nao de uma area geral isolada.
- Submenus preservam espaco visual sem espalhar fluxos relacionados pelo sistema.

### Alternativas consideradas
- Manter Linha editorial como menu principal: deixava a navegacao global mais cheia e quebrava o contexto de Videos IA.
- Recolocar o Kanban direto junto do formulario: voltaria a comprimir as informacoes.

## 2026-07-13 - Kanban editorial com board em largura total

### Decisao
- O Kanban da Linha editorial passou a ocupar uma linha inteira abaixo dos controles, em vez de dividir a linha com pilares e formulario.

### Motivo
- O uso principal da subaba e visualizar e administrar cards; portanto, as colunas do board precisam receber a maior parte da largura da tela.

### Alternativas consideradas
- Apenas aumentar a largura minima das colunas mantendo o sidebar lateral: continuaria exigindo scroll horizontal cedo demais.
- Esconder os pilares: economizaria espaco, mas removeria contexto util para cadastrar ideias.

## 2026-07-13 - Remocao do card fixo de integracao em Videos IA

### Decisao
- O aviso fixo de integracao HeyGen foi removido da interface principal de Criar videos.
- A fila de producao foi aproximada do formulario, ocupando a area que ficava vazia.

### Motivo
- O card azul chamava atencao para uma informacao tecnica que nao precisava competir com a rotina diaria.
- A tela tinha um vazio grande antes da fila, prejudicando a percepcao de organizacao.

### Alternativas consideradas
- Manter o aviso como card menor: ainda ocuparia espaco e manteria ruido visual.
- Mover o aviso para tooltip/documentacao futura: melhor para informacao tecnica de baixa frequencia.

## 2026-07-13 - Videos IA sem limite central estreito

### Decisao
- O container de Videos IA passou de largura central limitada para largura total dentro da area administrativa.
- A coluna lateral da influencer recebeu largura minima maior, enquanto o formulario principal ocupa o restante disponivel.

### Motivo
- A tela tinha espaco lateral vazio enquanto os campos ficavam comprimidos no centro.
- A ferramenta de videos e operacional, entao deve priorizar densidade organizada e bom aproveitamento horizontal.

### Alternativas consideradas
- Apenas reduzir fontes e paddings: aumentaria densidade, mas deixaria a tela mais apertada.
- Manter container central e esconder campos: reduziria informacao visivel sem resolver o desperdicio lateral.

## 2026-07-13 - Perfis sociais locais antes do OAuth da Meta

Decisao: a tela Videos IA passa a trabalhar com perfis sociais conectados por projeto, mas nesta etapa a conexao e um cadastro local no navegador.

Motivo: a integracao real com Instagram/Facebook depende de Meta App, permisssoes, revisao e tokens. O cadastro local permite organizar o fluxo de criacao e preparar a experiencia de agendamento sem bloquear a evolucao da ferramenta.

Alternativas consideradas: manter checkboxes de canais genericos, ou implementar OAuth completo agora. Os checkboxes nao resolvem a gestao por pagina/projeto; o OAuth completo exige configuracao externa ainda nao disponivel.

## 2026-07-13 - OAuth real da Meta sem expor tokens no frontend

Decisao: a conexao de Instagram/Facebook passa a usar OAuth server-side com a Meta. O frontend recebe somente os perfis retornados pela Graph API, sem access tokens.

Motivo: o usuario precisa de conexao real com pagina/perfil, mas expor tokens de pagina no JavaScript publico criaria risco de seguranca. Para agendamento futuro, os tokens devem ser persistidos no servidor de forma criptografada.

Alternativas consideradas: manter cadastro manual/fake, ou salvar access tokens no localStorage. O cadastro manual nao atende ao requisito de conexao real; token em localStorage foi descartado por seguranca.

## 2026-07-13 - Callback Meta visivel e fallback de captura

### Decisao
- O callback OAuth da Meta passa a renderizar uma pagina de confirmacao em vez de fechar automaticamente o popup.
- O admin captura o resultado por `postMessage`, `localStorage`, evento `storage`, retorno de foco e fechamento do popup.

### Motivo
- A janela da Meta podia fechar sem deixar claro se o callback do sistema foi executado ou se o retorno falhou antes de chegar ao admin.
- Uma confirmacao visivel separa problema de configuracao da Meta de problema de aplicacao do resultado no frontend.

### Alternativas consideradas
- Manter fechamento automatico e apenas mostrar status no admin: descartado porque o usuario nao conseguia diagnosticar onde o fluxo parava.
- Reabrir o fluxo OAuth em tela cheia: adiado, pois o popup ainda e mais confortavel para manter o admin aberto.

## 2026-07-13 - Reautorizacao Meta para paginas ausentes

### Decisao
- O OAuth da Meta passou a usar `auth_type=rerequest` e `return_scopes=true`.

### Motivo
- A Meta pode retornar apenas as paginas previamente liberadas pelo usuario para o app, mesmo que o perfil administre outras paginas.
- Forcar reautorizacao aumenta a chance de a tela `Editar configuracoes` permitir revisar a lista de paginas concedidas.

### Alternativas consideradas
- Tentar listar paginas sem consentimento explicito do usuario: nao e permitido pelo fluxo da Meta.
- Salvar paginas manualmente como fallback: descartado para esta etapa porque o objetivo e conexao real via Meta.

## 2026-07-13 - Biblioteca Meta e selecao por projeto

### Decisao
- A conexao com a Meta passa a importar ativos para uma biblioteca global local, enquanto cada projeto salva apenas os IDs dos ativos selecionados.

### Motivo
- O fluxo correto e conectar a conta Facebook/Meta uma vez e depois escolher qual pagina e qual Instagram pertencem a cada projeto.
- Isso evita reconectar a Meta a cada projeto e prepara o caminho para agendamento por pagina/perfil.

### Alternativas consideradas
- Manter botoes separados `Conectar Instagram` e `Conectar Facebook`: descartado porque confundia conexao com selecao de destino.
- Salvar todos os ativos importados automaticamente no projeto atual: descartado porque o usuario precisa filtrar manualmente quais pertencem ao projeto.

## 2026-07-13 - Retorno automatico do callback Meta

### Decisao
- A tela de callback da Meta passa a fechar ou redirecionar automaticamente apos enviar o resultado ao admin.

### Motivo
- Depois que o fluxo foi diagnosticado, manter a pagina parada causava a percepcao de erro no uso diario.
- O callback ainda fica visivel por um instante para diagnostico, mas deixa de bloquear o usuario.

## 2026-07-13 - Importar Instagram independente do tipo de botao Meta

### Decisao
- O callback Meta passa a importar `instagram_business_account` sempre que esse campo vier no retorno da pagina.

### Motivo
- O fluxo do usuario agora conecta a conta Meta/Facebook uma vez e depois seleciona os ativos por projeto. Portanto, iniciar a conexao como Facebook nao deve impedir a importacao de Instagram vinculado.

### Alternativas consideradas
- Voltar a ter botoes separados para Instagram e Facebook: descartado porque conflita com o fluxo desejado de conexao unica e filtro por projeto.

## 2026-07-13 - Videos IA orientado a ideias de conteudo

### Decisao
- A tela de criacao deixou de priorizar lote/agendamento e passou a funcionar como gerador de ideias de conteudo com quantidade configuravel.

### Motivo
- O fluxo desejado e gerar conteudos um por vez ou algumas ideias por rodada, filtrar as melhores e lapidar antes de produzir o video.
- A selecao multipla de produtos permite roteiros combinando ofertas relacionadas sem duplicar formul�rios.

### Alternativas consideradas
- Manter o fluxo de lote com datas: descartado porque gerava confusao no momento atual, antes da etapa de calendario/agendamento.

## 2026-07-13 - Ideias geradas em cards expansíveis

### Decisao
- A lista de ideias geradas em Videos IA passou de tabela compacta para cards expansíveis com metadados em chips.

### Motivo
- Roteiros longos e informacoes de destino ficavam ilegíveis em colunas estreitas, dificultando a escolha e lapidacao das melhores ideias.
- Cards preservam a leitura do roteiro e mantem as acoes proximas sem sacrificar o conteudo principal.

### Alternativas consideradas
- Apenas aumentar a largura da primeira coluna: descartado porque continuaria comprimindo status e acoes.
- Abrir os detalhes em modal: adiado, pois a leitura inline e mais rapida para revisar varias ideias em sequencia.

## 2026-07-14 - Admin sem cache para scripts operacionais

### Decisao
- O admin e os scripts em `/assets/js/admin/` passam a ser servidos com `Cache-Control: no-store`.

### Motivo
- O painel administrativo muda com frequencia e o usuario precisa ver a alteracao imediatamente apos deploy.
- O cache do navegador manteve a renderizacao antiga da lista de ideias, impedindo acesso ao roteiro completo.

### Alternativas consideradas
- Depender apenas de query string `v=`: funciona em muitos casos, mas nao resolve quando o HTML do admin fica preso em cache.
- Pedir hard reload manual a cada deploy: ruim para rotina operacional.

## 2026-07-14 - Card de influencer recolhivel

### Decisao
- A configuracao detalhada da influencer fica recolhida por padrao, mantendo apenas o resumo operacional visivel.

### Motivo
- Foto, manual e IDs tecnicos sao configuracoes de baixa frequencia e ocupavam muito espaco na rotina de geracao de conteudo.
- Recolher o editor reduz ruido visual sem remover acesso aos campos quando for necessario ajustar a personagem.

### Alternativas consideradas
- Mover a configuracao para outra pagina: mais limpo, mas quebraria o fluxo atual de selecionar projeto e ajustar influencer no mesmo contexto.
- Deixar sempre aberto: descartado pelo desperdicio de espaco apontado pelo usuario.

## 2026-07-14 - Coluna compacta para influencer

### Decisao
- A coluna lateral da influencer em Videos IA passa a ter largura compacta fixa/responsiva entre 300px e 340px.

### Motivo
- O card de influencer e uma configuracao de baixa frequencia e nao deve competir por largura com o gerador de conteudo e a lista de ideias.
- Manter a lateral estreita melhora a area de trabalho principal sem remover acesso ao resumo e aos controles da personagem.

### Alternativas consideradas
- Apenas recolher verticalmente o card: insuficiente, porque a queixa principal passou a ser largura ocupada.
- Mover a influencer para modal: economizaria mais espaco, mas esconderia a personagem ativa e criaria um passo extra no fluxo.

## 2026-07-14 - Reversao da coluna compacta da influencer

### Decisao
- A reducao de largura da coluna da influencer foi revertida, mantendo apenas o comportamento recolhivel do card.

### Motivo
- O usuario pediu para desfazer a alteracao anterior de largura.
- Manter o recolhimento preserva a melhoria de altura/ruido sem insistir na redistribuicao horizontal rejeitada.

## 2026-07-14 - Remotion como etapa depois do HeyGen

### Decisao
- Remotion foi adicionado primeiro como etapa de fluxo/status dentro de Videos IA, sem instalar ainda o render automatico.
- A acao Remotion so fica disponivel quando o item ja possui `videoUrl` do HeyGen.
- O resumo da tela passa a separar geracao do MP4 no HeyGen e edicao final no Remotion.

### Motivo
- O processo correto e: ideia/roteiro -> MP4 no HeyGen -> edicao final no Remotion.
- Instalar e rodar Remotion exige definir template, armazenamento de assets e estrategia de renderizacao server-side, entao foi separado da organizacao do fluxo.
- Bloquear Remotion ate existir MP4 evita colocar roteiros sem video na fila de edicao.

### Alternativas consideradas
- Instalar Remotion imediatamente: adiado para evitar uma integracao incompleta sem template e sem endpoint de render.
- Manter edicao como status generico: descartado porque o usuario quer Remotion explicitamente no sistema.

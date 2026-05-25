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

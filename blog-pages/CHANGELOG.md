# Changelog

## 2026-05-25

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
- Ajustado o espaçamento da seta dos campos de seleção do admin.
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

- Corrigida acentuação de textos institucionais, home do blog, rodapé, newsletter e mensagens do admin.
- Adicionados autor, data, tempo de leitura, schema `BlogPosting`, CTAs personalizados e leitura relacionada nos artigos.
- Enriquecidos os 5 artigos publicados com links internos, ajustes técnicos e melhorias editoriais.
- Adicionadas fontes externas e FAQ ao artigo de Reforma Tributária.
- Adicionado exemplo numérico ao artigo de Antecipação de Recebíveis.

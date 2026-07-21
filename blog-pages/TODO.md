# TODO

## Prioridade atual - Admin



- Validar o novo espacamento do card de influencers na aba Videos IA em notebook e desktop.
- Validar em producao o cadastro de multiplas influencers por projeto na aba Videos IA.
- Confirmar com um envio real ao HeyGen se o ID de aparencia da MB Negocios funciona no payload atual da API.
- Migrar futuramente o cadastro de influencers de `localStorage` para banco/API quando a ferramenta for usada por mais pessoas.

- Validar o novo espacamento das colunas da lista de links salvos em Campanhas no admin publicado.
- Publicar os ajustes visuais de icones/espacamentos do admin e validar `/admin` em producao.
- Conferir os campos `select` no painel publicado para confirmar a seta com espaÃ§amento correto.
- Validar a contagem de cliques dos links encurtados na aba "Campanhas" apos o deploy.
- Validar que F5 preserva a aba ativa no admin publicado.
- Validar a confirmacao dupla ao excluir links salvos na aba "Campanhas".
- Validar filtros, duplicacao, objetivo, status e notas da tela "Campanhas" em producao.
- Revisar as demais abas do admin para remover emojis remanescentes usados como icones estruturais.
- Criar um check simples de DOM para garantir que todos os `#screen-*` do admin sejam filhos diretos de `#admin-body`.

## Prioridade atual - Performance do blog

- Validar se a sidebar de produtos usa os mesmos nomes do site principal em producao.
- Validar o comportamento sticky e o scroll interno da sidebar de produtos em desktop/notebook.
- Validar o menu lateral esquerdo de produtos da capa `/blog` em desktop e mobile.
- Validar a capa `/blog` sem hero, iniciando direto pelo menu de produtos.
- Validar os seis cards do menu de produtos da capa `/blog` em desktop e mobile.
- Validar os cards de produto e a CTA de WhatsApp da capa `/blog` no ambiente publicado.
- Futuramente alimentar o card "Mais acessadas" com dados reais de analytics por post.
- Validar os titulos da capa `/blog` em azul marinho no ambiente publicado.
- Validar a nova capa publica `/blog` em desktop e mobile apos o deploy.
- Rodar PageSpeed novamente na URL publica do blog apos deploy.
- Se ainda houver CLS, investigar o trace do PageSpeed para confirmar se a causa restante vem de fonte, imagem ou conteudo injetado.

## Prioridade atual - Performance da home

- Publicar os ajustes de CLS da home principal.
- Rodar PageSpeed novamente na URL publica apos deploy.
- Se ainda houver CLS, investigar no trace do PageSpeed quais elementos restantes aparecem como fontes de shift.

## Prioridade atual - Analytics multisite

- Publicar os eventos GTM/dataLayer para blog e pagina principal.
- Criar no GTM tags GA4 Event para `whatsapp_click`, `cta_click`, `newsletter_submit`, `blog_search`, `blog_post_click`, `scroll_depth` e `generate_lead`.
- Marcar `generate_lead` como conversao/key event no GA4.
- Publicar o agrupamento de paginas equivalentes no relatorio de paginas mais acessadas do GA4.
- Validar no painel se home, blog e paginas `.html` aparecem consolidadas apos deploy.
- Configurar na Vercel as propriedades GA4 dos outros bracos da empresa.
- Confirmar acesso de leitura da service account em cada propriedade GA4.
- Validar no painel admin o seletor `MB Finance`, `MB Negocios` e `Fomenta` apos deploy.

## Prioridade atual

- Sincronizar o conteÃºdo corrigido de `content/blog-posts.json` com o storage ativo de produÃ§Ã£o, se o deploy estiver usando Supabase ou KV.
- Renovar autenticaÃ§Ã£o da Vercel local (`vercel login` ou token) para permitir deploy manual.
- Verificar visualmente `/blog` e os 5 artigos publicados apÃ³s o deploy.

## Backlog tÃ©cnico relevante

- Substituir imagens crÃ­ticas em `<img>` por `next/image` quando houver tempo para tratar LCP e largura/altura responsiva.
- Fazer uma rodada dedicada de SEO tÃ©cnico com Search Console/PageSpeed: canonical, schema renderizado, Core Web Vitals e acessibilidade.
- Planejar cadÃªncia editorial mÃ­nima de 2 artigos por mÃªs.

## Atualizacao 2026-06-02 - Links curtos

- Publicar seletor de dominio curto e validar links reais com `mbnegocios.com.br` e `mbfinance.com.br`.
- Publicar a regra `.htaccess` do CPanel para encaminhar `mbfinance.com.br/c/[code]` ao blog.
- Recriar links antigos que exibem `Destino invalido`, usando uma URL oficial digitada corretamente.




- Validar upload de foto e manual da influencer em producao.
- Migrar anexos de influencer para storage/banco antes de usar a ferramenta com varios usuarios.

## Atualizacao 2026-07-13 - Galeria visual da influencer

## Prioridade atual
- Validar em producao se as imagens da Helena Duarte aparecem na aba Videos IA ao selecionar MB Negocios.
- Escolher a foto principal oficial da influencer e confirmar se ela fica adequada no card e nos roteiros.

## Backlog tecnico
- Otimizar as referencias visuais para WebP/AVIF e criar armazenamento compartilhado para assets de influencers.

## Atualizacao 2026-07-13 - Manual da Helena

## Prioridade atual
- Validar em producao se o manual da Helena aparece automaticamente na aba Videos IA.
- Gerar um roteiro de teste e conferir se tom, visual e cuidados de transparencia estao refletidos.

## Atualizacao 2026-07-13 - Video unico e lote calendario

## Prioridade atual
- Testar em producao o botao Gerar 1 video.
- Testar um lote com primeira publicacao e intervalo de 1 dia para validar as datas planejadas.

## Backlog tecnico
- Evoluir a fila para um calendario editorial de videos com filtros por data e status.

## Atualizacao 2026-07-13 - Uso e redes dos videos

## Prioridade atual
- Validar em producao a selecao de Uso do video e multiplas redes.
- Gerar um video unico e um lote para conferir se a fila mostra as redes selecionadas corretamente.

## Atualizacao 2026-07-13 - Filtro de redes por uso

## Prioridade atual
- Validar em producao se Conteudo, Anuncios e Conteudo e anuncios mostram grupos diferentes de redes.
- Conferir se os modelos rapidos selecionam canais coerentes.

## Atualizacao 2026-07-13 - Linha editorial Videos IA

## Prioridade atual
- Testar em producao o Kanban de linha editorial: adicionar ideia, avancar status, usar no briefing e excluir.
- Validar se os pilares editoriais correspondem ao uso real da MB Negocios.

## Backlog tecnico
- Persistir Kanban editorial em banco/API e permitir filtros por projeto, pilar, status e data planejada.

## Atualizacao 2026-07-13 - Remover cards auxiliares Videos IA

## Prioridade atual
- Validar em producao se os cards Fluxo recomendado e Modelos rapidos nao aparecem mais na aba Videos IA.

## Atualizacao 2026-07-13 - Linha editorial

## Prioridade atual
- Validar em producao a nova pagina Linha editorial no menu principal.
- Testar criacao de ideia, movimentacao no Kanban e acao Usar para preencher o briefing em Videos IA.

## Backlog tecnico
- Persistir o Kanban editorial em banco/API para compartilhar entre usuarios e navegadores.
- Adicionar filtros por projeto, objetivo do video e rede social quando o volume de ideias crescer.

## Atualizacao 2026-07-13 - Submenu Videos IA

## Prioridade atual
- Validar em producao o submenu interno de Videos IA.
- Testar a troca entre Criar videos e Linha editorial, incluindo o botao Usar no Kanban.

## Backlog tecnico
- Considerar novas subabas futuras em Videos IA: Calendario, Biblioteca de roteiros e Historico HeyGen.

## Atualizacao 2026-07-13 - Kanban ampliado

## Prioridade atual
- Validar em producao a subaba Linha editorial em desktop, confirmando se o Kanban usa bem a largura da tela.

## Backlog tecnico
- Avaliar drag-and-drop real entre colunas quando a estrutura editorial estiver estabilizada.

## Atualizacao 2026-07-13 - Criar videos sem espaco vazio

## Prioridade atual
- Validar em producao se a Fila de producao ficou mais proxima do fluxo de criacao e sem espaco vazio excessivo.

## Backlog tecnico
- Avaliar se a fila de producao deve ganhar visual compacto quando houver muitos videos gerados.

## Atualizacao 2026-07-13 - Aproveitamento lateral em Videos IA

## Prioridade atual
- Validar em producao se a tela Videos IA ficou menos espremida e usa melhor as laterais.

## Backlog tecnico
- Extrair CSS do admin para arquivo dedicado quando houver uma rodada maior de limpeza visual.

## Atualizado em 2026-07-13

- [ ] Implementar integracao real com Meta OAuth para conectar Instagram/Facebook sem cadastro manual.
- [ ] Criar modelo persistente no backend para contas sociais por projeto, substituindo `localStorage`.
- [ ] Planejar fluxo de agendamento de posts a partir dos videos aprovados.

## Atualizacao 2026-07-13 - Meta OAuth

## Prioridade atual
- Criar/configurar o app da Meta para OAuth em producao.
- Configurar na Vercel: `META_APP_ID`, `META_APP_SECRET`, `META_GRAPH_VERSION` e `NEXT_PUBLIC_SITE_URL`.
- Adicionar a URL de callback no painel da Meta: `https://blog.mbfinance.com.br/api/meta/callback`.
- Testar login com uma conta que administre a pagina do Facebook e tenha Instagram profissional vinculado.

## Backlog tecnico
- Persistir tokens de paginas/Instagram no backend com criptografia.
- Criar banco/API para contas sociais por projeto, substituindo localStorage.
- Implementar agendamento real de publicacoes via Graph API depois da persistencia segura de tokens.

## Atualizacao 2026-07-13 - Retorno Meta OAuth

## Prioridade atual
- Testar em producao a conexao do Facebook novamente e confirmar se, apos o `Entendi` da Meta, aparece a tela de callback do dominio `blog.mbfinance.com.br`.
- Se a tela de callback aparecer, clicar em `Aplicar no admin` e confirmar se a pagina do Facebook entra em Perfis conectados.
- Para Instagram aparecer, liberar/adicionar as permissoes de Instagram no app da Meta e confirmar que o Instagram e profissional e esta vinculado a pagina do Facebook.

## Backlog tecnico
- Persistir contas sociais e tokens no backend com criptografia antes de agendamento real de posts.

## Atualizacao 2026-07-13 - Paginas Meta ausentes

## Prioridade atual
- Reconectar Facebook usando `Editar configuracoes` na tela da Meta e marcar todas as paginas que devem aparecer no admin.
- Confirmar se a conta logada tem permissao administrativa nas paginas que nao apareceram.
- Validar Instagram somente apos liberar/adicionar permissoes de Instagram no app da Meta e confirmar o vinculo com uma pagina do Facebook.

## Atualizacao 2026-07-13 - Ativos Meta por projeto

## Prioridade atual
- Testar em producao: conectar a conta Meta/Facebook, selecionar uma pagina no projeto e gerar um roteiro usando esse destino.
- Confirmar se as paginas ausentes aparecem apos revisar `Editar configuracoes` na tela da Meta.
- Liberar permissoes de Instagram no app da Meta para a lista de Instagram profissional aparecer junto das paginas.

## Backlog tecnico
- Persistir a biblioteca de ativos Meta e a selecao por projeto no backend, substituindo `localStorage`.

## Atualizacao 2026-07-13 - Callback Meta automatico

## Prioridade atual
- Testar novamente a conexao Meta e confirmar se a janela fecha ou volta para `/admin#videos` sozinha apos concluir.

## Atualizacao 2026-07-13 - Instagram no retorno Meta

## Prioridade atual
- Reconectar a conta Meta/Facebook em producao e verificar se algum Instagram profissional aparece na lista.
- Revisar no app da Meta se o produto/permissao de Instagram esta configurado; sem isso a Graph API pode devolver apenas paginas.
- Conferir se o Instagram usado e profissional e esta vinculado a uma das paginas que a Meta devolveu.

## Atualizacao 2026-07-13 - Aviso Videos IA removido

## Prioridade atual
- Validar em producao se a subaba Criar videos abre sem o aviso fixo no topo do formulario.

## Atualizacao 2026-07-13 - Gerador de conteudo Videos IA

## Prioridade atual
- Validar em producao o novo gerador: selecionar mais de um produto, definir quantidade de ideias e gerar conteudos.
- Avaliar se os status da lista devem mudar de producao de video para etapas de lapidacao editorial.

## Atualizacao 2026-07-13 - Ideias geradas legiveis

## Prioridade atual
- Validar em producao se os cards de Ideias geradas mostram o roteiro completo ao clicar em Ver tudo.
- Avaliar se a proxima etapa deve adicionar edicao inline do roteiro antes de enviar ao HeyGen.

## Atualizacao 2026-07-14 - Cache do admin Videos IA

## Prioridade atual
- Validar em producao com F5 que `Ideias geradas` mostra cards com o botao `Ver tudo`.
- Se o navegador ainda mostrar a tabela antiga, limpar cache/hard reload uma vez; apos os novos headers, proximos deploys nao devem ficar presos.

## Atualizacao 2026-07-14 - Influencer recolhivel

## Prioridade atual
- Validar em producao se o card de influencer abre recolhido e se o botao `Editar` mostra os campos completos.
- Conferir se `Nova influencer` abre o editor automaticamente.

## Atualizacao 2026-07-14 - Largura da influencer

## Prioridade atual
- Validar em producao se a coluna da influencer ficou compacta e se o gerador ganhou espaco horizontal suficiente.
- Ajustar novamente o limite de 300-340px se o monitor principal pedir uma coluna ainda menor.

## Atualizacao 2026-07-14 - Reversao largura influencer

## Prioridade atual
- Validar em producao se a coluna da influencer voltou para a largura anterior mantendo o card recolhivel.

## Atualizacao 2026-07-14 - Remotion em Videos IA

## Prioridade atual
- Validar em producao se o card Remotion aparece na tela Videos IA e se a acao Remotion fica disponivel quando um item tem MP4 do HeyGen.
- Definir o primeiro template de edicao: legenda, logo, tarja/CTA, proporcao 9:16 e exportacao final.

## Backlog tecnico
- Instalar Remotion e dependencias de render no projeto.
- Criar rota server-side para processar o MP4 do HeyGen e devolver o video final editado.
- Definir armazenamento dos videos finais e estrategia de fila para renderizacao sem travar o admin.

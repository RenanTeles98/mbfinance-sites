# TODO

## Prioridade atual
- Publicar e validar a nova interface do admin do blog no ambiente oficial.
- Validar a alca visivel e o redimensionamento manual da barra de publicacoes da aba Blog no admin publicado.
- Restaurar a autenticacao do GA4 no Vercel: revisar `GA4_CLIENT_EMAIL`, `GA4_PRIVATE_KEY` e permissao da service account na propriedade GA4.
- Validar no GA4 se os eventos de lead aparecem no relatorio do painel.
- Separar o evento especifico de Conta PJ no site principal caso o GTM ainda envie apenas `lead_modal_open`.

## Em andamento
- Reestruturacao visual do painel administrativo do blog para eliminar telas em branco.
- Ajustes de usabilidade da aba Blog do admin, incluindo melhor aproveitamento horizontal e redimensionamento manual da lista de publicacoes.
- Painel de analytics do blog com metrica de leads gerados.
- Diagnostico de credencial GA4 invalida no painel de metricas.

## Backlog tecnico
- Extrair o CSS inline do admin para arquivo em `public/assets/` quando houver uma rodada maior de limpeza.
- Padronizar nomes de eventos de conversao entre site principal, blog e GTM.
- Revisar warnings existentes do Next.js sobre uso de `<img>` quando houver tempo para otimizacao de imagens.

## Atualizacao 2026-07-09

## Prioridade atual
- Validar visualmente o novo menu lateral do admin do blog em desktop e telas menores.
- Confirmar se a largura de 240px da navegacao lateral fica confortavel para os nomes das abas.

## Em andamento
- Ajuste de layout do painel administrativo do blog, movendo a navegacao principal para a lateral.

## Backlog tecnico
- Extrair o CSS inline do admin para arquivo em `public/assets/` quando houver uma rodada maior de limpeza.

## Atualizacao 2026-07-09 - Scroll admin

## Prioridade atual
- Validar em producao se o painel admin rola normalmente em todas as abas apos o deploy.

## Em andamento
- Ajuste fino do menu lateral e da area de conteudo do admin.

## Atualizacao 2026-07-09 - Nomenclatura admin

## Prioridade atual
- Validar em producao se os novos nomes do menu ficam claros para a rotina do admin.
- Validar se o menu Mais opcoes abre corretamente e nao sobrepoe elementos importantes.

## Em andamento
- Refinamento visual e de microcopy do painel administrativo do blog.

## Atualizacao 2026-07-09 - Atualizar blog

## Prioridade atual
- Testar em producao a acao Atualizar blog dentro da aba Conteudo.
- Confirmar se o status Local/Conectado/Publicado continua claro sem o botao no topo.

## Atualizacao 2026-07-10 - Campanhas e links

## Prioridade atual
- Validar visualmente em producao se a nova organizacao da aba Campanhas e links orienta melhor o fluxo de criacao.
- Conferir responsividade do painel de resultado em telas menores.

## Em andamento
- Refinamento de UX do painel administrativo do blog.

## Backlog tecnico
- Extrair o CSS inline do admin para arquivo em `public/assets/` em uma rodada de limpeza dedicada.

## Atualizacao 2026-07-10 - Metricas por link

## Prioridade atual
- Testar em producao criacao de links com Projeto e Apelido do link.
- Validar se o filtro por projeto deixa claro quais metricas pertencem a cada link.

## Em andamento
- Refinamento da tela Campanhas e links para uso com varios projetos e campanhas simultaneas.

## Backlog tecnico
- Considerar painel de detalhe por link com grafico diario quando houver volume suficiente de cliques.

## Atualizacao 2026-07-10 - Projetos em Campanhas

## Prioridade atual
- Testar em producao o filtro global de Projeto no topo da aba Campanhas e links.
- Cadastrar um projeto de teste e validar se ele aparece no filtro e no formulario de criacao.

## Em andamento
- Estruturar Campanhas e links para operar com varios projetos.

## Backlog tecnico
- Persistir projetos em banco/API em vez de depender apenas de localStorage do navegador.

## Atualizacao 2026-07-10 - Modal de projetos

## Prioridade atual
- Validar em producao se o botao Projetos abre o modal e lista MB Finance/MB Negocios.
- Testar cadastro de um projeto novo pelo modal.

## Atualizacao 2026-07-10 - Links curtos personalizados

## Prioridade atual
- Testar em producao a criacao de link com apelido personalizado repetindo a mesma URL para confirmar que o erro nao aparece.

## Backlog tecnico
- Avaliar se o preview deve reservar apelidos somente no momento de salvar/copiar para reduzir registros temporarios no encurtador.

## Atualizacao 2026-07-10 - Exclusao de links curtos

## Prioridade atual
- Testar em producao: criar link com apelido, apagar na tabela e criar outro link usando o mesmo apelido.

## Backlog tecnico
- Criar futuramente uma tela administrativa para consultar e liberar apelidos antigos que foram apagados antes desta correcao.

## Atualizacao 2026-07-10 - Apelidos antigos presos

## Prioridade atual
- Usar a acao Liberar apelido no erro do apelido io e gerar o link novamente.

## Backlog tecnico
- Criar no futuro uma area de manutencao para listar apelidos reservados no encurtador.

## Atualizacao 2026-07-10 - Parametros UTM

## Prioridade atual
- Testar em producao os canais Instagram Bio e Facebook Bio e confirmar se source/medium sao preenchidos automaticamente.
- Validar com o time qual fluxo sera usado para capturar CNPJ: formulario, WhatsApp ou CRM.

## Backlog tecnico
- Planejar atribuicao de lead por CNPJ usando formulario/CRM e UTMs salvas na sessao do visitante.

## Atualizacao 2026-07-10 - Nomenclatura UTM

## Prioridade atual
- Validar com o time a convencao final de utm_source e utm_medium para todos os canais usados.

## Backlog tecnico
- Criar uma tabela de padronizacao de UTMs por canal/projeto para evitar divergencias entre campanhas.

## Atualizacao 2026-07-10 - Links por cliente

## Prioridade atual
- Testar em producao a geracao de links por cliente com uma lista pequena.
- Clicar em um link gerado e confirmar se o painel mostra cliques e ultimo clique.
- Validar o texto do modelo de mensagem com o time comercial.

## Backlog tecnico
- Persistir o vinculo codigo curto -> cliente/CNPJ em banco/API para funcionar entre navegadores e usuarios.
- Adicionar importacao CSV real e filtros por campanha/status clicou-nao clicou.

## Atualizacao 2026-07-13 - Videos IA

## Prioridade atual
- Validar em producao a nova aba Videos IA no admin.
- Testar geracao de lote, copia de roteiro, mudanca de status, duplicacao, exclusao e exportacao CSV.
- Definir quais credenciais e assets serao usados na integracao real: HeyGen API key, avatar/voice, logo, fonte, trilha e formato dos templates.

## Em andamento
- Estruturacao da ferramenta interna para producao em massa de videos com IA.

## Backlog tecnico
- Persistir a fila de videos em banco/API em vez de localStorage.
- Criar endpoint server-side para gerar roteiros com OpenAI.
- Criar endpoint server-side para enviar roteiros para HeyGen e consultar status.
- Avaliar Remotion/FFmpeg ou servico de renderizacao externo para edicao automatica com legendas, cortes, logo, capa e CTA.

## Atualizacao 2026-07-13 - HeyGen

## Prioridade atual
- Configurar `HEYGEN_API_KEY` na Vercel em Production.
- Rotacionar a chave colada no chat e usar uma nova chave no ambiente seguro.
- Obter no HeyGen um `avatar_id` e um `voice_id` validos para testar a geracao de MP4.
- Testar na aba Videos IA: gerar 1 roteiro, enviar ao HeyGen e consultar status ate aparecer o link do MP4.

## Backlog tecnico
- Persistir a fila de videos em banco/API para nao depender de localStorage.
- Criar webhook do HeyGen para atualizar status automaticamente sem clicar em Status.
- Adicionar templates de edicao automatica depois que a geracao base estiver validada.

## Atualizacao 2026-07-13 - Influencer por projeto

## Prioridade atual
- Cadastrar a influencer oficial de cada projeto na aba Videos IA.
- Preencher Avatar ID e Voice ID do HeyGen por projeto antes de gerar o lote.
- Colar o manual da influencer no campo Manual da influencer e salvar.

## Backlog tecnico
- Persistir influenciadoras por projeto em banco/API.
- Adicionar upload de imagem/manual da influencer em vez de apenas URL de referencia.
- Bloquear envio ao HeyGen quando a influencer do projeto nao estiver configurada.

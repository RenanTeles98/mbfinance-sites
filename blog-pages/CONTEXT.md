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

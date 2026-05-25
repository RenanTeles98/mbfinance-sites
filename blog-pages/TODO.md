# TODO

## Prioridade atual - Admin

- Publicar os ajustes visuais de icones/espacamentos do admin e validar `/admin` em producao.
- Conferir os campos `select` no painel publicado para confirmar a seta com espaçamento correto.
- Validar a contagem de cliques dos links encurtados na aba "Campanhas" apos o deploy.
- Validar que F5 preserva a aba ativa no admin publicado.
- Validar a confirmacao dupla ao excluir links salvos na aba "Campanhas".
- Revisar as demais abas do admin para remover emojis remanescentes usados como icones estruturais.
- Criar um check simples de DOM para garantir que todos os `#screen-*` do admin sejam filhos diretos de `#admin-body`.

## Prioridade atual - Performance do blog

- Publicar os ajustes de CLS do hero do blog.
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

- Sincronizar o conteúdo corrigido de `content/blog-posts.json` com o storage ativo de produção, se o deploy estiver usando Supabase ou KV.
- Renovar autenticação da Vercel local (`vercel login` ou token) para permitir deploy manual.
- Verificar visualmente `/blog` e os 5 artigos publicados após o deploy.

## Backlog técnico relevante

- Substituir imagens críticas em `<img>` por `next/image` quando houver tempo para tratar LCP e largura/altura responsiva.
- Fazer uma rodada dedicada de SEO técnico com Search Console/PageSpeed: canonical, schema renderizado, Core Web Vitals e acessibilidade.
- Planejar cadência editorial mínima de 2 artigos por mês.

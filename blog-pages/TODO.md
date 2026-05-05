# TODO

## Prioridade atual - Analytics multisite

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

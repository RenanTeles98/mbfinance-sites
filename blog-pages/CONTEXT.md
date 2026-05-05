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

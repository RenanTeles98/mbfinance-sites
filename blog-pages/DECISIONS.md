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

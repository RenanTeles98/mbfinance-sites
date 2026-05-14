# Sessao 2026-05-14 - ID GA4 do MB Negocios

## Resumo

- Recebido o ID de propriedade GA4 do MB Negocios: `536401937`.
- Recebido o Measurement ID do MB Negocios: `G-XS7HTFJKD6`.
- Aplicado o Property ID como fallback no codigo, pois a CLI da Vercel nao esta autenticada nesta maquina.

## Arquivos alterados

- `blog-pages/lib/ga4.ts`
- `blog-pages/.env.example`
- `CONTEXT.md`
- `DECISIONS.md`
- `TODO.md`
- `CHANGELOG.md`

## Observacoes

- Para leitura via API do painel, o dado necessario e o Property ID numerico.
- O Measurement ID deve ser usado na instalacao da tag/contêiner do GTM/site.
- O painel ainda depende de a service account principal ter acesso de leitura na propriedade GA4 `536401937`.

## Validacao

- `npm run build` em `blog-pages/` executado com sucesso.

## Proximos passos

- Fazer deploy.
- Validar se o seletor remove "configurar GA4" para MB Negocios.
- Se houver erro de permissao, adicionar a service account principal como leitora na propriedade GA4 do MB Negocios.

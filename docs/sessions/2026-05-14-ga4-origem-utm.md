# Sessao 2026-05-14 - Origem / midia / campanha UTM

## Resumo

- Criado card estrategico de origem, midia e campanha UTM no lugar de "Origem do trafego".
- O objetivo e identificar se o lead veio de SMS, trafego pago, parceiro, organico, WhatsApp, Google ou acesso direto.

## Arquivos alterados

- `blog-pages/lib/ga4.ts`
- `blog-pages/public/assets/js/admin/admin-analytics.js`
- `blog-pages/public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-14-ga4-origem-utm.md`

## Solucao

- A consulta GA4 de origem passou a usar:
  - `sessionSource`
  - `sessionMedium`
  - `sessionCampaignName`
  - `sessionDefaultChannelGroup`
- O painel agora mostra tabela com origem/midia/campanha, sessoes, usuarios e eventos.
- Trafego direto e Google entram no mesmo componente, mesmo quando nao existe campanha UTM.

## Validacao

- `npm run build` executado em `blog-pages` com sucesso.
- Permanecem apenas avisos antigos do Next sobre uso de `<img>`.

## Proximos passos

- Publicar no Git.
- Validar em producao a resposta da API para MB Negocios.

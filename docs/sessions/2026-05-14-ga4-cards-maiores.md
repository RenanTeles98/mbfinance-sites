# Sessao 2026-05-14 - Cards maiores no painel GA4

## Resumo

- Aumentado o tamanho visual dos cards do funil de conversao do painel GA4.
- Ajuste feito diretamente no CSS embutido de `blog-pages/public/pages/blog-admin.html`, onde o painel administrativo legado concentra esses estilos.

## Arquivos alterados

- `blog-pages/public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-14-ga4-cards-maiores.md`

## Solucao

- Grade alterada de `minmax(180px, 1fr)` para `minmax(230px, 1fr)`.
- Gap aumentado de 16px para 18px.
- Cards receberam padding maior, altura minima e numeros maiores.
- Texto auxiliar dos cards subiu de 13px para 14px.

## Validacao

- `npm run build` executado em `blog-pages` com sucesso.
- Permanecem apenas avisos antigos do Next sobre uso de `<img>`.

## Proximos passos

- Publicar no Git e validar visualmente em producao.

# Sessao 2026-05-14 - Remocao de indicadores redundantes

## Resumo

- Removido o painel visivel "Indicadores de trafego" da pagina de metricas do site.
- A informacao estava repetida em cards principais, funil, qualidade do trafego e paineis de conversao.

## Arquivos alterados

- `blog-pages/public/pages/blog-admin.html`
- `CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `CHANGELOG.md`
- `docs/sessions/2026-05-14-remocao-indicadores-redundantes.md`

## Solucao

- O painel visivel foi removido.
- Foi mantido um `div` oculto com `id="ga-highlights"` para preservar compatibilidade com o JavaScript legado enquanto o modulo nao for limpo por completo.

## Validacao

- `npm run build` executado em `blog-pages` com sucesso.
- Permanecem apenas avisos antigos do Next sobre uso de `<img>`.

# Sessao 2026-05-13 - Leads Conta PJ no admin

## Resumo
- Confirmado que o projeto Vercel `blog-mbfinace` usa `blog-pages/` como Root Directory.
- Aplicada a metrica "Leads Gerados" na pasta correta do projeto publicado.

## Problemas encontrados e solucoes
- A primeira alteracao havia sido feita em `Blog pages/`, mas a Vercel publica `blog-pages/`.
- A solucao foi reaplicar a mudanca em `blog-pages/`, preservando as melhorias recentes de filtros de site e periodo no GA4.

## Decisoes tomadas
- Contar `eventCount` dos eventos `conta_pj_lead_click` e `lead_modal_open`.
- Exibir o KPI antes de usuarios, sessoes e visualizacoes.

## Proximos passos
- Fazer deploy no Vercel.
- Validar o card em producao e confirmar a configuracao do evento especifico no GTM.

# Decisoes Tecnicas

## 2026-05-13 - Metrica de leads no painel

### Decisao
- A metrica "Leads Gerados" foi adicionada ao resumo do GA4 e exibida como primeiro card do painel.
- A API consulta `eventCount` para os eventos `lead_modal_open` e `conta_pj_lead_click`.

### Motivo
- O requisito era medir pessoas que clicaram para abrir a Conta PJ no site.
- O historico do projeto ja indicava eventos de conversao no dataLayer, incluindo abertura de modal de lead.
- Incluir `conta_pj_lead_click` deixa o painel pronto para um evento mais especifico de Conta PJ sem quebrar a coleta atual.

### Alternativas consideradas
- Contar apenas `generate_lead`: mais estrito, mas mede envio do formulario, nao clique para abrir Conta PJ.
- Contar apenas `lead_modal_open`: funciona com a coleta atual, mas pode misturar outros produtos se o site principal usar o mesmo modal.

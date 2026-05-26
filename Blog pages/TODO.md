# TODO

## Prioridade atual
- Publicar e validar a nova interface do admin do blog no ambiente oficial.
- Validar a nova largura da barra de publicacoes da aba Blog no admin publicado.
- Restaurar a autenticacao do GA4 no Vercel: revisar `GA4_CLIENT_EMAIL`, `GA4_PRIVATE_KEY` e permissao da service account na propriedade GA4.
- Validar no GA4 se os eventos de lead aparecem no relatorio do painel.
- Separar o evento especifico de Conta PJ no site principal caso o GTM ainda envie apenas `lead_modal_open`.

## Em andamento
- Reestruturacao visual do painel administrativo do blog para eliminar telas em branco.
- Ajustes de usabilidade da aba Blog do admin, incluindo melhor aproveitamento horizontal da lista de publicacoes.
- Painel de analytics do blog com metrica de leads gerados.
- Diagnostico de credencial GA4 invalida no painel de metricas.

## Backlog tecnico
- Extrair o CSS inline do admin para arquivo em `public/assets/` quando houver uma rodada maior de limpeza.
- Padronizar nomes de eventos de conversao entre site principal, blog e GTM.
- Revisar warnings existentes do Next.js sobre uso de `<img>` quando houver tempo para otimizacao de imagens.

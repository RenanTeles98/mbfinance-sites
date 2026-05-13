# Sessao 2026-05-13 - Demografia GA4 no admin

## Resumo
- Corrigida a busca de genero e faixa etaria no painel administrativo do blog.
- O endpoint agora tenta o periodo selecionado, 90 dias e 365 dias antes de declarar indisponibilidade.

## Problemas encontrados e solucoes
- As dimensoes `userGender` e `userAgeBracket` ja estavam corretas, mas o GA4 pode retornar vazio por volume, privacidade ou configuracao.
- A solucao foi ampliar automaticamente a janela de consulta e isolar falhas demograficas do restante do painel.

## Decisoes tomadas
- Nao inventar/estimar genero ou idade localmente.
- Usar somente dados disponibilizados pelo GA4.

## Proximos passos
- Validar em producao.
- Conferir se Google Signals/dados demograficos estao ativados na propriedade GA4.

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

## 2026-05-18 - Diagnostico de credencial GA4 invalida

### Decisao
- A API de analytics passou a reconhecer `invalid_grant` com `account not found` e retornar uma mensagem em pt-BR orientando a recriar/atualizar a service account.

### Motivo
- O painel publicado estava exibindo erro bruto do Google e os cards ficavam sem metricas.
- O erro acontece na autenticacao, antes das consultas ao GA4, entao a correcao real depende de credenciais/permissaes no Google Cloud e Vercel.

### Alternativas consideradas
- Ocultar o erro e mostrar apenas "GA4 indisponivel": reduziria ruido, mas esconderia a acao necessaria.
- Trocar a estrategia de autenticacao por OAuth de usuario: aumentaria complexidade e nao resolve a service account invalida ja configurada.

## 2026-05-25 - Telas visiveis no admin do blog

### Decisao
- A aba "Campanhas" passou a ter uma tela propria no admin, alimentada pelos posts ja carregados.
- O switch de abas agora usa "Metricas do site" como fallback quando o painel solicitado nao existe.
- A aba de newsletter foi apresentada como "E-mails" sem trocar os IDs internos, preservando compatibilidade com o JavaScript existente.

### Motivo
- Os prints mostravam a navegacao do admin funcionando, mas a area de conteudo vazia.
- Havia risco de aba sem `screen-*` correspondente deixar o usuario preso em uma tela em branco.
- Manter os IDs internos reduz o risco de quebrar funcoes ja existentes de newsletter, blog, banners e analytics.

### Alternativas consideradas
- Reescrever todo o admin como uma aplicacao React: melhor a longo prazo, mas alto risco para uma correcao urgente.
- Trocar todos os nomes internos de newsletter para e-mails: mais consistente, mas aumentaria o escopo e o risco de regressao.

## 2026-05-26 - Largura responsiva da lista de publicacoes

### Decisao
- A coluna lateral da aba Blog passou de largura fixa de `272px` para `clamp(340px, 24vw, 420px)`.
- A coluna ganhou uma alca manual de redimensionamento, com largura salva em `localStorage`.
- Em telas menores, a lista de publicacoes empilha acima do editor e ocupa 100% da largura.

### Motivo
- A largura anterior deixava titulos, categorias e status muito comprimidos, desperdicando espaco disponivel no admin.
- Uma largura responsiva melhora a leitura em desktop sem prender a interface a um unico tamanho de tela.
- O ajuste manual permite que cada usuario adapte o espaco entre lista e editor conforme o monitor e a rotina de edicao.

### Alternativas consideradas
- Usar uma largura fixa maior: simples, mas menos adaptavel a notebooks e monitores grandes.
- Criar um painel de preferencias para o admin: mais completo, mas excessivo para uma necessidade de layout pontual.
- Reestruturar todo o editor do blog: desnecessario para o ajuste pontual solicitado.

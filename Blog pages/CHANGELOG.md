# Changelog

## 2026-05-13

- Adicionada metrica "Leads Gerados" ao painel de analytics do blog.
- API de analytics passou a retornar contagem de eventos de lead vindos do GA4.

## 2026-05-18

- Melhorado diagnostico do painel quando a credencial GA4 retorna `invalid_grant/account not found`.

## 2026-05-25

- Refeita a estrutura visual do admin do blog para evitar abas com conteudo em branco.
- Adicionada tela de Campanhas com KPIs e pipeline editorial.
- Ajustada navegacao do admin para usar Metricas como fallback quando uma aba nao tiver painel correspondente.

## 2026-05-26

- Aumentada a largura da barra de publicacoes da aba Blog do admin para melhorar a leitura e o aproveitamento de espaco.
- Adicionado redimensionamento manual da barra de publicacoes com persistencia local.
- Ajustada a alca de redimensionamento para ficar sempre visivel e evitar cache antigo do script.

## 2026-07-09

- Movido o menu principal do admin do blog para uma barra lateral esquerda em desktop.
- Ajustada a responsividade da navegacao do admin para continuar utilizavel em telas menores.

## 2026-07-09

- Corrigida a rolagem vertical do painel admin apos a mudanca do menu principal para lateral.

## 2026-07-09

- Renomeados os itens do menu lateral do admin para melhorar clareza operacional.
- Simplificado o topo do admin com acoes secundarias agrupadas em Mais opcoes.

## 2026-07-09

- Movida a acao de sincronizacao do blog do topo global para a aba Conteudo, agora como Atualizar blog.

## 2026-07-10

### Alterado
- Reorganizada a aba Campanhas e links do admin do blog com fluxo guiado para criacao, resultado, historico e mensagens de WhatsApp.

### Alterado
- Campanhas e links agora organiza links por projeto, permite apelido personalizado no link curto e mostra metricas individuais por link salvo.

### Alterado
- O filtro de projeto de Campanhas e links foi movido para o topo da pagina e agora orienta a analise da tela.

### Adicionado
- Cadastro local de projetos em Campanhas e links, iniciando com MB Finance e MB Negocios como projetos base.

### Alterado
- Zerada a base visivel de campanhas/links para recomecar as metricas da aba Campanhas e links.

### Alterado
- Gestao de projetos movida para modal aberto pelo menu principal do admin.

## 2026-07-10

### Corrigido
- Links curtos personalizados agora podem ser reaproveitados quando o apelido ja aponta para a mesma URL, evitando falso erro de apelido em uso no preview de campanhas.

## 2026-07-10

### Corrigido
- Ao apagar um link salvo em Campanhas, o apelido/codigo do link curto tambem e liberado para reutilizacao futura.

## 2026-07-10

### Corrigido
- Adicionada acao Liberar apelido quando um link curto personalizado antigo continua reservado mesmo sem aparecer nos links salvos.

## 2026-07-10

### Melhorado
- Aba Campanhas agora explica os parametros de rastreio UTM, orienta sobre identificacao por CNPJ e inclui canais Instagram Bio e Facebook Bio.

## 2026-07-10

### Corrigido
- Nomenclatura dos parametros UTM ajustada para tratar CPC como meio/tipo de trafego, nao como canal de aquisicao.

## 2026-07-10

### Adicionado
- MVP de Links por cliente na aba Campanhas, com geracao de links curtos individuais, mensagens personalizadas, acompanhamento de cliques por cliente/CNPJ e exportacao CSV.

## 2026-07-13

### Adicionado
- Nova aba Videos IA no admin do blog para criar roteiros em lote e organizar fila de producao de videos.
- Fila local com status, copia de roteiro, duplicacao, exclusao, limpeza e exportacao CSV.

### Adicionado
- Integracao server-side com HeyGen para criar videos e consultar status a partir da aba Videos IA.
- Campos de Avatar ID e Voice ID do HeyGen na criacao de lote.

### Adicionado
- Perfil de Influencer por projeto na aba Videos IA, com manual/persona, referencia visual, Avatar ID e Voice ID.

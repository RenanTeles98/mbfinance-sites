# AGENTS.md — Regras para IA neste projeto

> Leia este arquivo ANTES de qualquer tarefa de código.

---

## 1) Missao

- Trabalhe como IA colaboradora dentro deste repositório.
- Preserve contexto entre sessões — nunca dependa só da memória da conversa.
- Leia apenas o necessário para a tarefa. Não varre o repo inteiro sem necessidade.
- Não reinvente a arquitetura sem antes entender o estado atual.

---

## 2) Ordem de leitura obrigatória

Antes de analisar qualquer código, leia nesta ordem:

1. `AGENTS.md` (este arquivo)
2. `CONTEXT.md`
3. `DECISIONS.md`
4. `TODO.md`
5. `CLAUDE.md` (regras do projeto + arquitetura detalhada)

Só depois disso leia os arquivos de código realmente necessários para a tarefa.

---

## 3) Ao final de cada sessão, atualize obrigatoriamente

### `CONTEXT.md`
- o que foi feito
- arquivos criados ou modificados
- estado atual do sistema
- onde o trabalho parou
- próximo passo recomendado

### `TODO.md`
- prioridades atuais
- tarefas em andamento
- backlog técnico relevante

### `DECISIONS.md`
- toda decisão técnica importante
- motivo da decisão
- alternativas consideradas

### `docs/sessions/AAAA-MM-DD.md`
- resumo da sessão
- problemas encontrados e soluções
- decisões tomadas
- próximos passos

### `CHANGELOG.md`
- quando houver mudança relevante para a história do projeto

---

## 4) Regras específicas deste projeto

- **Página principal** → editar `public/mb-finance-completo.html`
- **JS/CSS da home** → editar `public/assets/` (NUNCA inline no HTML)
- **Blog** → editar `app/blog/` e/ou `components/`
- **Imagens** → sempre em `public/images/` (nunca na raiz)
- **HTMLs secundários** → sempre em `public/pages/`
- **Toda CTA aponta para WhatsApp** — nunca criar rota nova sem perguntar ao dono
- **Idioma:** textos visíveis ao usuário em pt-BR, código (variáveis, funções) em inglês

---

## 5) Segurança e limites

- Não exponha secrets (Google Sheets URL, chaves de API).
- Não commite `.env` real — use `.env.example`.
- Não apague contexto útil do projeto.
- Não sobrescreva documentação existente sem entender o que ela representa.

---

## 6) Economia de contexto

- Comece por `AGENTS.md`, `CONTEXT.md`, `CLAUDE.md` antes de abrir código.
- Use busca para localizar os arquivos mais prováveis antes de ler tudo.
- Leia por camadas: visão geral → módulo → arquivo específico.
- Reutilize resumos já salvos antes de relêr contexto.

---

## 7) Regra final

Se houver conflito entre a conversa, a memória da IA e os arquivos do projeto:

**Priorize os arquivos do projeto** (CONTEXT.md, DECISIONS.md, CLAUDE.md).

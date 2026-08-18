# Estrutura do Projeto MB Finance

> Auditoria estrutural inicial: 2026-08-18. Este documento descreve o estado encontrado; não representa uma autorização para apagar ou mover projetos.

## Visão geral

O diretório de trabalho contém quatro unidades com responsabilidades distintas. A raiz é um monorepositório de fato, mas sem uma ferramenta de workspace configurada. Há duplicação de código do blog e uma cópia de publicação para CPanel que precisam ser preservadas até uma consolidação deliberada.

| Unidade | Papel | Deploy/execução | Situação |
| --- | --- | --- | --- |
| `./` | Fonte do site institucional e rotas Next.js auxiliares | CPanel para o institucional; Vercel local legado | `public/` é a fonte de trabalho; CPanel serve o espelho atual |
| `blog-pages/` | Blog e painel administrativo Next.js | Vercel (`blog.mbfinance.com.br`) | Fonte canônica confirmada pela configuração do deployment ativo |
| `cpanel-upload/` | Pacote estático para envio manual ao CPanel | CPanel manual | Espelho parcial de `public/` |
| `C:\Users\MB NEGOCIOS\mbfinance-seomachine` | Ferramenta Python/Claude para produção SEO | Repositório Git próprio, fora deste repositório | Não é parte do runtime do site |

## Aplicação da raiz

- `app/`: App Router, incluindo `/blog`, `/sobre`, `/admin` e APIs de analytics, posts e newsletter.
- `components/`, `lib/`, `content/`, `types/`: componentes React, regras de acesso a conteúdo/serviços e tipos compartilhados da raiz.
- `public/index.html`: página institucional estática efetivamente presente.
- `public/pages/`: páginas HTML secundárias; `public/assets/` concentra CSS e JavaScript dessas páginas; `public/images/` concentra mídia.
- `next.config.mjs`, `vercel.json`, `package.json`: configuração de framework, redirects, headers e build.

Integrações detectadas, sem registrar valores de credenciais: Redis gerenciado para conteúdo/newsletter, Resend/Svix para e-mail e webhooks, Google Analytics, Meta/Google Ads e WhatsApp. Variáveis locais devem continuar fora do Git.

## Riscos e duplicações

1. A raiz e `blog-pages/` apontam ao mesmo projeto Vercel local. O projeto Vercel ativo do blog corresponde à configuração de `blog-pages/`; a raiz não deve mais ser usada para publicar esse projeto.
2. A cópia divergente anterior foi comparada e retirada da área de trabalho. Ela foi preservada em backup local, sem arquivos de ambiente, em `archive/blog-pages-divergent-2026-08.zip`; `blog-pages/` é a única fonte canônica do blog.
3. `cpanel-upload/public_html/` replica a maior parte de `public/`, mas não é um espelho exato. Alterações em HTML estático exigem uma sincronização explícita e revisão de diferenças.
4. O SEO Machine foi extraído para `C:\Users\MB NEGOCIOS\mbfinance-seomachine`, preservando seu próprio Git e alterações locais. Ele não deve voltar a ser aninhado no repositório web.
5. Arquivos gerados e artefatos históricos na raiz devem ser classificados antes de arquivamento. As imagens sem referência e o pacote histórico foram movidos, sem exclusão, para `archive/root-assets-2026-08/`.

## Direção de organização aprovada para segurança

Nesta etapa, a reorganização executada é documental: responsabilidade e fronteiras foram explicitadas, sem alterar caminhos que possam afetar Vercel, CPanel ou trabalho local não commitado. A fonte canônica já foi confirmada: `blog-pages/` para o blog Vercel e `public/` com publicação espelhada em `cpanel-upload/public_html/` para o site institucional atual. A consolidação física requer a seguinte sequência:

1. Ajustar o projeto Vercel para uma única raiz de deploy antes de mover diretórios.
2. Transformar `cpanel-upload/` em artefato gerado ou mantê-lo como pacote versionado, conforme o processo real do CPanel.

## Organização física aplicada na raiz

- `scripts/maintenance/`: scripts manuais de manutenção, com guia em `scripts/README.md`.
- `archive/root-assets-2026-08/`: imagens e pacote histórico sem referências de uso, preservados com guia em `archive/README.md`.
- `archive/blog-pages-divergent-2026-08.zip`: backup local da cópia divergente do blog; é ignorado pelo Git e não contém `.env.local`.
- Arquivos de configuração, documentação obrigatória, `.env.example`, `package.json` e configurações do Next/Vercel permanecem na raiz porque são descobertos por ferramentas e pelo processo de desenvolvimento.
- `scripts/maintenance/Sync-CpanelPackage.ps1` confere e, apenas com `-Apply`, sincroniza arquivos de `public/` para o pacote CPanel sem apagar arquivos exclusivos do servidor.

## Comandos de validação

```powershell
npm run build
Push-Location blog-pages; npm run build; Pop-Location
git status --short
```

Não executar deploy de `Blog pages/`. Publicações do blog devem partir exclusivamente de `blog-pages/` após validação.

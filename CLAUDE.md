# CLAUDE.md — MB Finance Sites

Contexto completo do projeto para não perder o fio. Leia antes de qualquer tarefa.

---

## Quem é o dono do projeto

- Dono da MB Finance — hub financeiro para empresas PJ
- Não técnico, fala português (pt-BR)
- Foco em resultado de negócio: autoridade, geração de leads, conversões
- Canal de captação principal: **WhatsApp**
- Prefere design moderno, profissional e que transmita confiança + tecnologia

---

## O que é a MB Finance

- **Hub de produtos financeiros para PJ** (MEI até médias empresas)
- Fundada em 2013, +130.000 empresas atendidas
- Diferencial: IA conectando empresas a múltiplos parceiros bancários (não fica preso a um banco)
- Dor resolvida: empresário limitado às condições de um único banco

**Produtos (4):**
1. Conta PJ
2. Máquina de Cartão
3. Capital de Giro
4. Antecipação de Recebíveis

**Cores da marca:**
- Primária: `#003956` (azul marinho escuro)
- Secundária: `#0099dd` (azul claro/céu)
- Dark: `#002840`
- Light: `#e6f4fb`
- Logo: "mb" em azul escuro + "finance." em azul claro

---

## Estrutura do repositório

```
Mb finance- Sites/
├── app/                        # Next.js App Router (site principal)
│   ├── layout.tsx              # Layout raiz com SEO (metadata, OG)
│   ├── page.tsx                # Home → redireciona para /mb-finance-completo.html
│   ├── globals.css             # Estilos globais Next.js
│   ├── blog/
│   │   ├── page.tsx            # Listagem do blog
│   │   └── [slug]/page.tsx     # Post individual
│   ├── sobre/page.tsx          # Página Sobre
│   ├── admin/page.tsx          # Painel admin do blog
│   └── api/
│       ├── analytics/overview/ # Endpoint GA4
│       └── blog/posts/         # Endpoint posts do blog
│
├── components/                 # Componentes React/TSX
│   ├── Navbar.tsx              # Navbar (transparente → branca no scroll)
│   ├── Hero.tsx                # Hero full-screen com cards animados
│   ├── PainSolution.tsx        # Comparativo antes/depois
│   ├── Products.tsx            # 4 cards de produto
│   ├── Differentials.tsx       # IA + 6 diferenciais
│   ├── HowItWorks.tsx          # 4 passos
│   ├── Stats.tsx               # Contadores animados (130k+, 13 anos, 98%, 24h)
│   ├── Testimonials.tsx        # 6 depoimentos
│   ├── CTASection.tsx          # CTA escuro full-width
│   ├── Footer.tsx              # Rodapé com links e compliance
│   ├── BackgroundNodes.tsx     # Animação de fundo
│   ├── TextShimmer.tsx         # Efeito shimmer no texto
│   ├── WhatsAppFloat.tsx       # Botão WhatsApp fixo (canto inferior direito)
│   ├── ui/testimonials-columns-1.tsx
│   └── admin/BlogAdminApp.tsx  # Admin do blog
│
├── lib/
│   ├── blog-store.ts           # Posts: JSON local ou Upstash Redis (Vercel)
│   └── ga4.ts                  # Integração Google Analytics 4
│
├── content/                    # JSON com os posts do blog
├── types/                      # Tipos TypeScript
│
├── public/                     # Arquivos estáticos e páginas HTML legadas
│   ├── mb-finance-completo.html   # PÁGINA PRINCIPAL — já refatorada (ver seção abaixo)
│   ├── tailwind.min.css           # Tailwind compilado (usado pelos HTMLs em pages/)
│   │
│   ├── assets/                    # ← NOVO: JS e CSS externos (separados do HTML)
│   │   ├── css/
│   │   │   └── main.css           # Todos os <style> extraídos do mb-finance-completo
│   │   └── js/
│   │       ├── infra/             # Camada de infraestrutura
│   │       │   ├── sheets.js      # Integração Google Sheets (captura de leads)
│   │       │   └── storage.js     # localStorage (backup local de leads)
│   │       ├── use-cases/         # Camada de regras de negócio
│   │       │   ├── lead.js        # Modal de lead + roteamento WhatsApp
│   │       │   └── partnership.js # Modal de parceria
│   │       └── ui/                # Camada de apresentação (DOM)
│   │           ├── scroll.js      # smoothScrollTo + Lenis smooth scroll
│   │           ├── navbar.js      # Scroll effect + menu mobile + dropdown
│   │           ├── accordion.js   # Accordion de produtos + FAQ toggle
│   │           └── animations.js  # Parallax + etapas animadas + carrossel
│   │
│   ├── images/                    # ← NOVO: todas as imagens organizadas
│   │   ├── logo-horizontal-logo.branca.png
│   │   ├── logo-horizontal-logo.png.png
│   │   ├── Gemini_Generated_Image_*.png
│   │   ├── [demais PNGs e JPGs de produtos]
│   │   ├── premios/               # Imagens de prêmios
│   │   └── icones-premios/        # Ícones dos prêmios
│   │
│   └── pages/                     # ← NOVO: HTMLs secundários organizados
│       ├── sobre.html
│       ├── blog.html
│       ├── blog-admin.html
│       ├── mb-tributos.html
│       ├── politica-de-privacidade.html
│       ├── termos-de-uso.html
│       └── artigo-*.html (5 artigos legados)
│
├── seomachine/                 # Workspace SEO separado (ver seção abaixo)
│
├── next.config.mjs             # Redirects 301 dos artigos antigos → /blog/[slug]
├── tailwind.config.ts          # Tema Tailwind com cores da marca
├── package.json                # Next.js 14.2, React 18, Framer Motion, Lucide, Upstash
│
├── apply_navbar.py             # Script: aplica navbar responsiva nos HTMLs
├── apply_legal_navbar.py       # Script: aplica navbar nas páginas legais
├── fix_encoding.py             # Script: corrige encoding Windows-1252 → UTF-8
└── sync_footers.py / .js       # Script: sincroniza rodapés entre HTMLs
```

---

## Arquitetura: duas camadas

### 1. Páginas HTML estáticas (`/public/`)
- São as páginas **ao vivo** que o usuário vê agora
- A principal é `public/mb-finance-completo.html` — **já refatorada** (ver seção de refatoração abaixo)
- As páginas secundárias ficam em `public/pages/` e as imagens em `public/images/`
- Editar essas páginas = editar o arquivo `.html` diretamente no caminho certo
- Scripts Python (`apply_navbar.py`, `sync_footers.py`) sincronizam partes repetidas entre HTMLs

### 2. Aplicação Next.js (`/app/`, `/components/`)
- Blog (`/blog`) e rota `/sobre` já rodam no Next.js
- Home (`/`) redireciona para `/mb-finance-completo.html` por enquanto
- Serve a evolução do site (migrar HTML para componentes React)

**Regra prática:** Se a tarefa é sobre a página principal, mexer em `public/mb-finance-completo.html`. Se é sobre o blog, mexer nos componentes Next.js.

---

## Refatoração dos HTMLs legados — padrão de boas práticas

### O que foi feito em `mb-finance-completo.html` (referência para as outras pages)

Em 2026-04-14, o `mb-finance-completo.html` foi refatorado seguindo três princípios:

**1. Separação de Responsabilidades**
- Removidos todos os blocos `<style>` do HTML (havia 4 espalhados no arquivo)
- Removidos todos os blocos `<script>` inline (havia 8 no total)
- O HTML ficou apenas com estrutura semântica
- Único `<script>` inline permitido: Google Analytics no `<head>` (obrigatório lá)

**2. Estrutura de Pastas Modular**
```
public/assets/
├── css/
│   └── main.css        ← todo o CSS do arquivo (4 blocos <style> fundidos)
└── js/
    ├── infra/           ← chamadas externas e storage
    ├── use-cases/       ← regras de negócio (lead, parceria)
    └── ui/              ← interação com DOM (navbar, accordion, animações)
```

**3. Clean Architecture no JavaScript**
| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Infrastructure | `infra/sheets.js` | Envia lead para Google Sheets via fetch |
| Infrastructure | `infra/storage.js` | Salva lead no localStorage como backup |
| Use Case | `use-cases/lead.js` | Abre/fecha modal, valida form, roteia para WhatsApp |
| Use Case | `use-cases/partnership.js` | Modal de parceria + envio WhatsApp |
| UI | `ui/scroll.js` | `smoothScrollTo` + inicialização do Lenis |
| UI | `ui/navbar.js` | Scroll effect, menu mobile, dropdown de produtos |
| UI | `ui/accordion.js` | Accordion de produtos, FAQ toggle |
| UI | `ui/animations.js` | Parallax, etapas animadas, carrossel de parceiros |

**Ordem de carregamento no HTML** (no final do `<body>`, antes de `</body>`):
```html
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
<script src="assets/js/infra/sheets.js"></script>
<script src="assets/js/infra/storage.js"></script>
<script src="assets/js/ui/scroll.js"></script>
<script src="assets/js/ui/navbar.js"></script>
<script src="assets/js/ui/accordion.js"></script>
<script src="assets/js/ui/animations.js"></script>
<script src="assets/js/use-cases/lead.js"></script>
<script src="assets/js/use-cases/partnership.js"></script>
```

**Observações importantes:**
- Funções chamadas por `onclick=""` no HTML devem estar no escopo global (`window.nomeDaFuncao`)
- O `navbar.js` expõe `window.closeMobileMenu` e `window.closeProdDropdown`
- Os caminhos nos JS são relativos à página que os carrega (não ao arquivo JS)
- Para páginas em `public/pages/`, os paths dos assets ficam com `../` (ex: `../assets/js/...`)

### Como aplicar o mesmo padrão nas outras pages (`sobre.html`, `blog.html`, etc.)

As páginas em `public/pages/` ainda têm CSS e JS inline. Para refatorar cada uma:

1. **Identificar blocos** — abrir o arquivo e localizar todos os `<style>` e `<script>` inline
2. **Extrair o CSS** → criar (ou adicionar) em `public/assets/css/[nome-da-page].css`
   - Se o CSS for compartilhado com outras pages, adicionar em `main.css`
   - Linkar no `<head>`: `<link rel="stylesheet" href="../assets/css/main.css">`
3. **Extrair o JS** → criar arquivos em `public/assets/js/` seguindo as camadas:
   - Lógica de UI (animações, menus) → `ui/`
   - Regras de negócio (formulários, redirecionamentos) → `use-cases/`
   - Chamadas externas (APIs, storage) → `infra/`
4. **Verificar paths** — páginas em `pages/` precisam de `../` antes de `assets/` e `../images/` para imagens
5. **Testar** — abrir a page no browser e confirmar que tudo funciona antes de commitar

---

## Blog

- Posts armazenados em `content/` (JSON local)
- Em produção (Vercel): sincroniza com Upstash Redis via `lib/blog-store.ts`
- Rotas: `/blog` (listagem) e `/blog/[slug]` (post)
- Admin: `/admin` ou `public/blog-admin.html`
- Artigos antigos em HTML redirecionam via `next.config.mjs` (redirects 301)

---

## Deploy e desenvolvimento

- **Dev local:** `npm run dev` na raiz → `http://localhost:3000`
- **Deploy:** Vercel
- Variáveis de ambiente necessárias para produção:
  - `KV_REST_API_URL` e `KV_REST_API_TOKEN` (Upstash Redis)
  - Credenciais GA4

---

## Todos pendentes

- [ ] Substituir número WhatsApp pelo número real (buscar em todos os HTMLs e componentes)
- [ ] Adicionar logos dos bancos parceiros
- [ ] Atualizar links de redes sociais no Footer
- [ ] Substituir depoimentos fictícios por reais
- [ ] Refatorar `public/pages/sobre.html` seguindo o mesmo padrão do mb-finance-completo
- [ ] Refatorar `public/pages/blog.html` seguindo o mesmo padrão
- [ ] Refatorar `public/pages/politica-de-privacidade.html` e `termos-de-uso.html`

---

## SEO Machine (`seomachine/`)

Workspace separado e independente para criação e otimização de conteúdo SEO.

**Não confundir com o site principal** — é uma ferramenta de produção de conteúdo.

```
seomachine/
├── .claude/agents/       # 10 agentes especializados (seo-optimizer, meta-creator, etc.)
├── .claude/commands/     # 26 comandos de workflow (/write, /research, /rewrite, etc.)
├── .claude/skills/       # 26 habilidades de marketing
├── data_sources/modules/ # 25+ módulos Python (GA4, GSC, DataForSEO, CRO, keywords...)
├── context/              # Diretrizes de marca, exemplos, guia de estilo, keywords
├── wordpress/            # Integração com WordPress REST API
├── topics/               # Ideias de pauta
├── research/             # Briefings e análises
├── drafts/               # Rascunhos em andamento
├── published/            # Conteúdo publicado final
└── rewrites/             # Revisões de conteúdo existente
```

Comandos principais do SEO Machine:
- `/research` — pesquisa de keywords e concorrentes
- `/write` — criação completa de artigo
- `/rewrite` — atualização de conteúdo existente
- `/optimize` — polish final de SEO
- `/analyze-existing` — auditoria de conteúdo

---

## Stack resumida

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Estilo | Tailwind CSS 3.4 + custom tokens |
| Animações | Framer Motion 12 |
| Ícones | Lucide React |
| Cache/DB | Upstash Redis (Vercel KV) |
| Analytics | Google Analytics 4 |
| Deploy | Vercel |
| Linguagem | TypeScript (componentes) + HTML/CSS/JS (páginas legadas) |

---

## Regras para não errar

1. **Mudança visual na home** → editar `public/mb-finance-completo.html`
2. **Mudança no JS/CSS da home** → editar os arquivos em `public/assets/` (não voltar a colocar inline no HTML)
3. **Mudança no blog** → editar em `app/blog/` e/ou `components/`
4. **Navbar e rodapé dos HTMLs legados** → usar os scripts Python (`apply_navbar.py`, `sync_footers.py`) em vez de editar cada arquivo na mão
5. **Novos componentes Next.js** → criar em `components/`, importar na page correspondente
6. **Redirects de URLs antigas** → editar `next.config.mjs`
7. **Todo texto de botão/CTA aponta para WhatsApp** — nunca criar formulário ou rota nova sem perguntar ao dono
8. **Não criar arquivos de documentação (*.md) nem README** a menos que pedido explicitamente
9. **Idioma do código e comentários:** português nos textos visíveis ao usuário, inglês no código (variáveis, funções, componentes)
10. **SEO Machine** é projeto separado — não misturar com o site principal
11. **Imagens** ficam em `public/images/` — nunca soltar PNG/JPG na raiz do `public/`
12. **HTMLs secundários** ficam em `public/pages/` — ao criar nova page HTML, já colocar lá
13. **Nunca colocar `<style>` ou `<script>` inline nos HTMLs** — qualquer CSS novo vai em `assets/css/`, JS novo vai em `assets/js/` na camada correta (ver seção de refatoração acima)

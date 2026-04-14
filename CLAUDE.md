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
│   ├── mb-finance-completo.html   # PÁGINA PRINCIPAL DO SITE (HTML/CSS/JS)
│   ├── sobre.html                 # Página Sobre (HTML legado)
│   ├── blog.html                  # Blog (HTML legado)
│   ├── blog-admin.html            # Admin blog (HTML)
│   ├── mb-tributos.html           # Página MB Tributos
│   ├── politica-de-privacidade.html
│   ├── termos-de-uso.html
│   ├── artigo-*.html              # Artigos antigos (redirecionados no next.config.mjs)
│   ├── tailwind.min.css           # Tailwind compilado para as páginas HTML
│   └── [imagens: logos, produtos, prêmios, etc.]
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
├── sync_footers.py / .js       # Script: sincroniza rodapés entre HTMLs
│
└── mb-finance/                 # Cópia/clone do Next.js (pasta de backup)
```

---

## Arquitetura: duas camadas

### 1. Páginas HTML estáticas (`/public/`)
- São as páginas **ao vivo** que o usuário vê agora
- A principal é `public/mb-finance-completo.html` — HTML/CSS/JS puro, usa `tailwind.min.css`
- As páginas legais (`politica-de-privacidade.html`, `termos-de-uso.html`) também são HTML puro
- Editar essas páginas = editar o arquivo `.html` diretamente em `/public/`
- Scripts Python (`apply_navbar.py`, `sync_footers.py`) sincronizam partes repetidas entre HTMLs

### 2. Aplicação Next.js (`/app/`, `/components/`)
- Blog (`/blog`) e rota `/sobre` já rodam no Next.js
- Home (`/`) redireciona para `/mb-finance-completo.html` por enquanto
- Serve a evolução do site (migrar HTML para componentes React)

**Regra prática:** Se a tarefa é sobre a página principal, mexer em `public/mb-finance-completo.html`. Se é sobre o blog, mexer nos componentes Next.js.

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

- [ ] Substituir número WhatsApp `5511999999999` pelo número real (buscar em todos os HTMLs e componentes)
- [ ] Adicionar logo real em PNG (já recebido do cliente)
- [ ] Adicionar logos dos bancos parceiros
- [ ] Atualizar links de redes sociais no Footer
- [ ] Substituir depoimentos fictícios por reais
- [ ] Deploy no Vercel

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
2. **Mudança no blog** → editar em `app/blog/` e/ou `components/`
3. **Navbar e rodapé dos HTMLs legados** → usar os scripts Python (`apply_navbar.py`, `sync_footers.py`) em vez de editar cada arquivo na mão
4. **Novos componentes Next.js** → criar em `components/`, importar na page correspondente
5. **Redirects de URLs antigas** → editar `next.config.mjs`
6. **Todo texto de botão/CTA aponta para WhatsApp** — nunca criar formulário ou rota nova sem perguntar ao dono
7. **Não criar arquivos de documentação (*.md) nem README** a menos que pedido explicitamente
8. **Idioma do código e comentários:** português nos textos visíveis ao usuário, inglês no código (variáveis, funções, componentes)
9. **SEO Machine** é projeto separado — não misturar com o site principal

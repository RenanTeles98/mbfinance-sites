# Supabase para o Blog MB Finance

## Variaveis na Vercel

Configure no projeto do blog:

```env
SUPABASE_URL=https://okpfzcgynlamhyfodjal.supabase.co
SUPABASE_ANON_KEY=cole-a-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=cole-a-service-role-key
BLOG_ADMIN_TOKEN=mbfinance2026
NEXT_PUBLIC_BLOG_URL=https://blog.mbfinance.com.br
NEXT_PUBLIC_MAIN_SITE_URL=https://mbfinance.com.br
```

`SUPABASE_SERVICE_ROLE_KEY` deve ficar somente na Vercel. Nao publique essa chave no frontend, GitHub, Cpanel ou prints.

## Banco

No Supabase, abra SQL Editor e execute o arquivo:

```text
supabase-blog.sql
```

Esse SQL cria a tabela `public.blog_posts`, indices, trigger de `updated_at` e RLS permitindo leitura publica apenas de posts publicados.

## Como os posts entram no banco

Depois de configurar as variaveis e subir o projeto, abra:

```text
https://blog.mbfinance.com.br/admin
```

Entre no painel e clique em `Publicar Oficial`. A API do Next.js grava os posts no Supabase.

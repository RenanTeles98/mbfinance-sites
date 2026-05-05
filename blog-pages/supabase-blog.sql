create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null default 'credito',
  category_label text not null default 'Credito Empresarial',
  excerpt text default '',
  image text default '',
  content text default '',
  read_time text default '5 min',
  date date not null default current_date,
  featured boolean not null default false,
  published boolean not null default true,
  seo_title text default '',
  seo_desc text default '',
  keywords text default '',
  time text not null default '00:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_date_idx
  on public.blog_posts (published, date desc, time desc);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create or replace function public.set_blog_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;

create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts
for select
to anon
using (published = true);

-- Escrita deve ser feita pelo backend Next.js usando SUPABASE_SERVICE_ROLE_KEY.
-- Nao crie policy de insert/update/delete para anon.

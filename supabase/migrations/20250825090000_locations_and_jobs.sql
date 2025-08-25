create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  city text not null,
  region_slug text not null,
  city_slug text not null,
  unique (region_slug, city_slug)
);

alter table public.jobs
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists address text,
  add column if not exists is_online boolean not null default false,
  add column if not exists owner uuid not null references auth.users(id) default auth.uid(),
  add column if not exists published boolean not null default true,
  add column if not exists status text not null default 'open';

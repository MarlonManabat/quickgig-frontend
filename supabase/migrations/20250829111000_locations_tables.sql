create table if not exists public.regions (
  code text primary key,
  name text not null
);
create table if not exists public.cities (
  code text primary key,
  name text not null,
  region_code text not null references public.regions(code)
);
alter table public.regions enable row level security;
alter table public.cities enable row level security;
create policy "read regions" on public.regions for select using (true);
create policy "read cities"  on public.cities  for select using (true);

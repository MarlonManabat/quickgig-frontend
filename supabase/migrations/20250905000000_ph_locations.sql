-- Regions (PSGC-coded)
create table if not exists public.ph_regions (
  code text primary key,
  name text not null,
  short_name text
);

-- Provinces
create table if not exists public.ph_provinces (
  code text primary key,
  region_code text not null references public.ph_regions(code) on delete restrict,
  name text not null
);
create index if not exists idx_ph_provinces_region on public.ph_provinces(region_code);

-- Cities / Municipalities
create table if not exists public.ph_cities (
  code text primary key,
  province_code text not null references public.ph_provinces(code) on delete restrict,
  region_code text not null references public.ph_regions(code) on delete restrict,
  name text not null,
  class text
);
create index if not exists idx_ph_cities_province on public.ph_cities(province_code);
create index if not exists idx_ph_cities_region on public.ph_cities(region_code);

-- RLS: read-only to all; no inserts/updates from clients
alter table public.ph_regions enable row level security;
alter table public.ph_provinces enable row level security;
alter table public.ph_cities enable row level security;

create policy "public read regions" on public.ph_regions
  for select using (true);
create policy "public read provinces" on public.ph_provinces
  for select using (true);
create policy "public read cities" on public.ph_cities
  for select using (true);

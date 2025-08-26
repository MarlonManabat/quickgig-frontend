alter table public.regions enable row level security;
create policy "anon select regions" on public.regions for select to anon using (true);
alter table public.cities enable row level security;
create policy "anon select cities" on public.cities for select to anon using (true);

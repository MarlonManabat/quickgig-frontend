alter table public.profiles
add column if not exists is_admin boolean not null default false;

-- Allow admins to read everything (MVP: simplest approach)
-- If you already use RLS with granular policies, keep those; this just ensures admins aren't blocked.
create policy if not exists "Admins can read all"
on public.profiles
for select
to authenticated
using (auth.uid() = id or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true
));

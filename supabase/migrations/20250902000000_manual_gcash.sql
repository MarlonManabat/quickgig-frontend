-- payment proofs
create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  credits int not null check (credits >= 0),
  file_url text not null,
  note text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz
);

alter table public.payment_proofs enable row level security;

-- users can create & read own proofs
create policy "pp read own" on public.payment_proofs
  for select using (auth.uid() = user_id);
create policy "pp insert own" on public.payment_proofs
  for insert with check (auth.uid() = user_id);

-- admins can read/update all
create policy "pp admin read" on public.payment_proofs
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "pp admin update" on public.payment_proofs
  for update using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

-- storage bucket for proofs
insert into storage.buckets (id, name, public) values ('gcash-proofs','gcash-proofs', false)
on conflict (id) do nothing;

-- storage RLS
create policy "users upload to own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'gcash-proofs'
    and (auth.uid()::text || '/') = (split_part(name,'/',1) || '/')
  );

create policy "users read own proofs" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'gcash-proofs'
    and (auth.uid()::text || '/') = (split_part(name,'/',1) || '/')
  );

create policy "admins read all proofs" on storage.objects
  for select to authenticated
  using (bucket_id = 'gcash-proofs' and exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

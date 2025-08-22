-- orders: one row represents a manual payment request
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  method text not null default 'gcash',
  amount numeric(12,2) not null default 0,
  currency text not null default 'PHP',
  status text not null default 'pending', -- pending|approved|rejected
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id, created_at desc);

-- Storage bucket for proofs
insert into storage.buckets (id, name, public) values ('payment-proofs','payment-proofs', false)
on conflict (id) do nothing;

-- RLS (simple defaults; adjust if you already enforce)
alter table public.orders enable row level security;

-- users can read their own orders
create policy if not exists orders_read_own on public.orders
for select using (auth.uid() = user_id);

-- users can insert their own orders
create policy if not exists orders_insert_own on public.orders
for insert with check (auth.uid() = user_id);

-- users can update only their own rows while pending (e.g., attach proof)
create policy if not exists orders_update_pending on public.orders
for update using (auth.uid() = user_id and status = 'pending');

-- admins can do everything (assumes 'admin' boolean on public.profiles)
create policy if not exists orders_admin_all on public.orders
for all using ((select coalesce((select admin from public.profiles p where p.id = auth.uid()), false)))
with check ((select coalesce((select admin from public.profiles p where p.id = auth.uid()), false)));

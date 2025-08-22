create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  amount integer not null,
  reference text unique not null,
  proof_url text,
  status text not null default 'pending' check (status in ('pending','submitted','paid','rejected','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders(user_id);
alter table public.orders enable row level security;

-- helper: admin check from allowlist
create or replace function public.is_admin(email text)
returns boolean language sql stable as $$
  select coalesce(position(lower(email) in lower(current_setting('app.admin_emails', true))) > 0, false)
$$;

-- seed GUC for RLS (set at runtime from env)
-- (handled in API by `set_config('app.admin_emails', process.env.ADMIN_EMAILS ?? '', true)`)

-- RLS:
drop policy if exists "orders owner crud" on public.orders;
drop policy if exists "orders admin all" on public.orders;
create policy "orders owner crud" on public.orders
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "orders admin all" on public.orders
  using ( public.is_admin((select email from auth.users u where u.id = auth.uid())) );

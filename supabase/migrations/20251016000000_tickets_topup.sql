create type if not exists ticket_order_status as enum ('pending','approved','rejected');

create table if not exists public.ticket_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  qty int not null check (qty in (1,5,10)),
  amount_php int not null,
  receipt_url text,
  status ticket_order_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ticket_orders enable row level security;

-- Owner can see/insert/update own pending orders
do $$ begin
  if not exists (select 1 from pg_policies where polname='ticket_orders_select_own') then
    create policy ticket_orders_select_own on public.ticket_orders for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where polname='ticket_orders_insert_own') then
    create policy ticket_orders_insert_own on public.ticket_orders for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where polname='ticket_orders_update_own_pending') then
    create policy ticket_orders_update_own_pending on public.ticket_orders
      for update using (auth.uid() = user_id and status = 'pending')
      with check (auth.uid() = user_id and status = 'pending');
  end if;
end $$;

-- Trigger for updated_at
create or replace function public.tg_set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists set_updated_at_ticket_orders on public.ticket_orders;
create trigger set_updated_at_ticket_orders before update on public.ticket_orders
for each row execute function public.tg_set_updated_at();

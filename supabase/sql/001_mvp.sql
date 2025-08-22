-- Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  role text check (role in ('seeker','client')) default 'seeker',
  full_name text,
  city text,
  skills text,
  created_at timestamptz default now()
);

-- Gigs table
create table if not exists gigs (
  id bigserial primary key,
  title text not null,
  description text not null,
  city text not null,
  budget numeric,
  created_by uuid references auth.users(id),
  status text default 'open',
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table gigs enable row level security;

-- Profiles: a user can see their row and public reads allowed; write only own row
create policy "profiles_read_all" on profiles for select using (true);
create policy "profiles_upsert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Gigs: anyone can read; only owner can insert/update their gigs
create policy "gigs_read_all" on gigs for select using (true);
create policy "gigs_insert_own" on gigs for insert with check (auth.uid() = created_by);
create policy "gigs_update_own" on gigs for update using (auth.uid() = created_by);

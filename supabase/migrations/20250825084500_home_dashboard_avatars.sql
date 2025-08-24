-- 1) Add avatar_url to profiles (nullable)
alter table public.profiles
  add column if not exists avatar_url text;

-- 2) Create public avatars bucket (if not exists)
-- (safe if already created earlier)
select
  case
    when exists (select 1 from storage.buckets where id = 'avatars') then null
    else storage.create_bucket('avatars', public => true)
  end;

-- 3) RLS policies on storage.objects for avatars bucket
-- Enable RLS if not already
alter table storage.objects enable row level security;

-- Allow anyone to read avatars (bucket is public)
create policy if not exists "avatars_read_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Allow authenticated users to upload to their own folder: avatars/{uid}/filename
create policy if not exists "avatars_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and owner = auth.uid()
  );

-- Allow update/delete only for owner
create policy if not exists "avatars_update_own"
  on storage.objects for update
  using  (bucket_id = 'avatars' and owner = auth.uid())
  with check (bucket_id = 'avatars' and owner = auth.uid());

create policy if not exists "avatars_delete_own"
  on storage.objects for delete
  using (bucket_id = 'avatars' and owner = auth.uid());

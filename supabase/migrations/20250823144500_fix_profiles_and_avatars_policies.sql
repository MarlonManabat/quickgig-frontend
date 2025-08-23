-- Enable RLS
alter table public.profiles enable row level security;

-- Drop old policies if they exist
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

-- Insert: only allow a user to insert their own row
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

-- Update: only allow a user to update their own row
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Storage bucket policies for avatars
create policy if not exists "avatars_upload_own"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

create policy if not exists "avatars_update_own"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars');

create policy if not exists "avatars_read_public"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

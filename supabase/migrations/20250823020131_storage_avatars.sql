insert into storage.buckets (id, name, public)
values ('avatars','avatars', true)
on conflict (id) do update set public = excluded.public;

create policy if not exists "Public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy if not exists "Auth can upload avatars" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');
create policy if not exists "Owner can update avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and auth.uid() = owner) with check (bucket_id = 'avatars' and auth.uid() = owner);
create policy if not exists "Owner can delete avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and auth.uid() = owner);

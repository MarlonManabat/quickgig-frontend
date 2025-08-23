insert into storage.buckets (id,name,public)
select 'avatars','avatars', true
where not exists (select 1 from storage.buckets where id='avatars');

insert into storage.buckets (id,name,public)
select 'payment-proofs','payment-proofs', false
where not exists (select 1 from storage.buckets where id='payment-proofs');

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select using ( bucket_id='avatars' );

drop policy if exists "avatars_owner_rw" on storage.objects;
create policy "avatars_owner_rw" on storage.objects for select using (
  bucket_id='avatars' and (
    auth.role() in ('anon','authenticated')
    or exists (select 1 from public.profiles p where p.id=auth.uid() and p.is_admin)
  )
);
create policy "avatars_owner_write" on storage.objects for insert with check (
  bucket_id='avatars' and split_part(name,'/',1)=auth.uid()::text
);
create policy "avatars_owner_update" on storage.objects for update using (
  bucket_id='avatars' and split_part(name,'/',1)=auth.uid()::text
);

drop policy if exists "payment_proofs_owner_read_write" on storage.objects;
create policy "payment_proofs_owner_read_write" on storage.objects for select using (
  bucket_id='payment-proofs' and split_part(name,'/',1)=auth.uid()::text
);
create policy "payment_proofs_owner_insert" on storage.objects for insert with check (
  bucket_id='payment-proofs' and split_part(name,'/',1)=auth.uid()::text
);
create policy "payment_proofs_owner_update" on storage.objects for update using (
  bucket_id='payment-proofs' and split_part(name,'/',1)=auth.uid()::text
);

drop policy if exists "storage_admin_read_all" on storage.objects;
create policy "storage_admin_read_all" on storage.objects for select using (
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.is_admin)
);

drop policy if exists "storage_owner_delete" on storage.objects;
create policy "storage_owner_delete" on storage.objects for delete using (
  split_part(name,'/',1)=auth.uid()::text
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.is_admin)
);

create or replace view public.admin_storage_summary as
select bucket_id, count(*) as file_count from storage.objects group by 1;

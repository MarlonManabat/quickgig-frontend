insert into storage.buckets (id, name, public)
values ('payment-proofs','payment-proofs', true)
on conflict (id) do update set public = excluded.public;

create policy if not exists "Public read payment-proofs" on storage.objects for select using (bucket_id = 'payment-proofs');
create policy if not exists "Auth can upload payment-proofs" on storage.objects for insert to authenticated with check (bucket_id = 'payment-proofs');
create policy if not exists "Owner can update payment-proof" on storage.objects for update to authenticated using (bucket_id = 'payment-proofs' and auth.uid() = owner) with check (bucket_id = 'payment-proofs' and auth.uid() = owner);
create policy if not exists "Owner can delete payment-proof" on storage.objects for delete to authenticated using (bucket_id = 'payment-proofs' and auth.uid() = owner);

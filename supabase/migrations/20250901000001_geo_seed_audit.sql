insert into public.regions (id, code, name)
values
  ('NCR','NCR','National Capital Region'),
  ('REG-III','REG-III','Central Luzon'),
  ('REG-IVA','REG-IVA','CALABARZON')
on conflict (id) do update set code=excluded.code, name=excluded.name;

insert into public.provinces (id, name, regionCode)
values
  ('MM','Metro Manila','NCR'),
  ('PAM','Pampanga','REG-III'),
  ('LAG','Laguna','REG-IVA')
on conflict (id) do update set name=excluded.name, regionCode=excluded.regionCode;

insert into public.cities (id, name, provinceId)
values
  ('MNL','Manila','MM'),
  ('SFC','San Fernando City','PAM'),
  ('SPL','San Pablo City','LAG')
on conflict (id) do update set name=excluded.name, provinceId=excluded.provinceId;

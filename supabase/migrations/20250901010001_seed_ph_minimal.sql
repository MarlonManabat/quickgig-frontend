-- Minimal seed for previews (NCR + CALABARZON)
insert into ph_regions (code,name,short_name) values
  ('130000000','National Capital Region','NCR'),
  ('040000000','Region IV-A (CALABARZON)','CALABARZON')
  on conflict (code) do update set name=excluded.name, short_name=excluded.short_name;

insert into ph_provinces (code,region_code,name) values
  ('NCR','130000000','NCR'),
  ('042100000','040000000','Cavite'),
  ('043400000','040000000','Laguna')
  on conflict (code) do update set region_code=excluded.region_code, name=excluded.name;

insert into ph_cities (code,province_code,region_code,name,class) values
  ('137401000','NCR','130000000','Manila','City'),
  ('137404000','NCR','130000000','Makati','City'),
  ('042108000','042100000','040000000','Bacoor','City'),
  ('043404000','043400000','040000000','Calamba','City')
  on conflict (code) do update set province_code=excluded.province_code, region_code=excluded.region_code, name=excluded.name, class=excluded.class;

import raw from '@/data/ph_locations.json';

type Region = { code: string; name: string; region_name?: string };
type City = { code: string; name: string; city_name?: string; region_code: string };

const toRegion = (r: any): Region => ({
  code: String(r.code || r.region_code || ''),
  name: String(r.name || r.region_name || ''),
  region_name: String(r.region_name || r.name || ''),
});

const toCity = (c: any): City => ({
  code: String(c.code || c.city_code || ''),
  name: String(c.name || c.city_name || ''),
  city_name: String(c.city_name || c.name || ''),
  region_code: String(c.region_code || ''),
});

export function getRegions(): Region[] {
  return (raw?.regions ?? [])
    .map(toRegion)
    .filter((r) => r.code && r.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCitiesByRegion(region_code: string): City[] {
  if (!region_code) return [];
  return (raw?.cities ?? [])
    .map(toCity)
    .filter((c) => c.region_code === region_code && c.code && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function safeSortByName<T extends Record<string, any>>(items: T[]) {
  const label = (x: any) =>
    (x?.name ?? x?.region_name ?? x?.city_name ?? '').toString();
  return [...(items ?? [])].sort((a, b) => label(a).localeCompare(label(b)));
}

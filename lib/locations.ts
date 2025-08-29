import dataset from '@/data/ph_locations.json';

// Backward-compatible normalization
type RegionLike = { code?: string; name?: string; region_code?: string; region_name?: string };
type CityLike   = { code?: string; name?: string; city_code?: string; city_name?: string; region_code?: string };

const label = (x: any) =>
  (x?.name ?? x?.region_name ?? x?.city_name ?? '').toString();

const toRegion = (r: RegionLike) => ({
  code: r.code ?? r.region_code ?? '',
  name: (r.name ?? r.region_name ?? '').toString(),
});

const toCity = (c: CityLike) => ({
  code: c.code ?? c.city_code ?? '',
  name: (c.name ?? c.city_name ?? '').toString(),
  region_code: c.region_code ?? '',
});

export function getRegions() {
  return (dataset?.regions ?? [])
    .map(toRegion)
    .filter(r => r.code && r.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCitiesByRegion(region_code: string) {
  if (!region_code) return [];
  return (dataset?.cities ?? [])
    .map(toCity)
    .filter(c => c.region_code === region_code && c.code && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Utility for any legacy array sorts in the codebase:
export function safeSortByName<T extends Record<string, any>>(items: T[]) {
  return [...(items ?? [])].sort((a, b) => label(a).localeCompare(label(b)));
}

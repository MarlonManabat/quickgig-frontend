import regions from '@/data/ph/regions.json';
import provinces from '@/data/ph/provinces.json';
import cities from '@/data/ph/cities.json';

export type Region = {
  code: string;
  name: string;
  provinces: Array<{ code: string; name: string; cities: string[] }>;
};

export function allRegions(): Region[] {
  return (regions as any[]).map((r: any) => ({
    code: String(r.region_code || r.code || ''),
    name: String(r.region_name || r.name || ''),
    provinces: (provinces as any[])
      .filter((p: any) => String(p.region_code) === String(r.region_code || r.code))
      .map((p: any) => ({
        code: String(p.province_code || p.code || ''),
        name: String(p.province_name || p.name || ''),
        cities: (cities as any[])
          .filter((c: any) => String(c.province_code) === String(p.province_code || p.code))
          .map((c: any) => String(c.city_name || c.name || '')),
      })),
  }));
}

export function provinceNames(): string[] {
  return allRegions().flatMap((r) => r.provinces.map((p) => p.name));
}

export function cityNames(): string[] {
  return allRegions().flatMap((r) => r.provinces.flatMap((p) => p.cities));
}

export function getRegions() {
  return (regions as any[]).map((r: any) => ({
    code: String(r.region_code || r.code || ''),
    name: String(r.region_name || r.name || ''),
  }));
}

export function getCitiesByRegion(region_code: string) {
  return (cities as any[])
    .filter((c: any) => String(c.region_code) === String(region_code))
    .map((c: any) => ({ code: String(c.city_code || c.code || ''), name: String(c.city_name || c.name || '') }));
}

export function safeSortByName<T extends Record<string, any>>(items: T[]) {
  const label = (x: any) => (x?.name ?? x?.region_name ?? x?.city_name ?? '').toString();
  return [...(items ?? [])].sort((a, b) => label(a).localeCompare(label(b)));
}

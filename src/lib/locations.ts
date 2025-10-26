import raw from '@/data/ph_locations.json';

type Region = { code: string; name: string; region_name?: string };
type City   = { code: string; name: string; city_name?: string; region_code: string };

const FULL_REGIONS: Region[] = [
  { code: 'NCR',         name: 'National Capital Region',                               region_name: 'National Capital Region' },
  { code: 'CAR',         name: 'Cordillera Administrative Region',                      region_name: 'Cordillera Administrative Region' },
  { code: 'REGION_I',    name: 'Ilocos Region (Region I)',                              region_name: 'Ilocos Region (Region I)' },
  { code: 'REGION_II',   name: 'Cagayan Valley (Region II)',                            region_name: 'Cagayan Valley (Region II)' },
  { code: 'REGION_III',  name: 'Central Luzon (Region III)',                            region_name: 'Central Luzon (Region III)' },
  { code: 'REGION_IV_A', name: 'CALABARZON (Region IV-A)',                              region_name: 'CALABARZON (Region IV-A)' },
  { code: 'REGION_IV_B', name: 'MIMAROPA (Region IV-B)',                                region_name: 'MIMAROPA (Region IV-B)' },
  { code: 'REGION_V',    name: 'Bicol Region (Region V)',                               region_name: 'Bicol Region (Region V)' },
  { code: 'REGION_VI',   name: 'Western Visayas (Region VI)',                           region_name: 'Western Visayas (Region VI)' },
  { code: 'REGION_VII',  name: 'Central Visayas (Region VII)',                          region_name: 'Central Visayas (Region VII)' },
  { code: 'REGION_VIII', name: 'Eastern Visayas (Region VIII)',                         region_name: 'Eastern Visayas (Region VIII)' },
  { code: 'REGION_IX',   name: 'Zamboanga Peninsula (Region IX)',                       region_name: 'Zamboanga Peninsula (Region IX)' },
  { code: 'REGION_X',    name: 'Northern Mindanao (Region X)',                          region_name: 'Northern Mindanao (Region X)' },
  { code: 'REGION_XI',   name: 'Davao Region (Region XI)',                              region_name: 'Davao Region (Region XI)' },
  { code: 'REGION_XII',  name: 'SOCCSKSARGEN (Region XII)',                             region_name: 'SOCCSKSARGEN (Region XII)' },
  { code: 'REGION_XIII', name: 'Caraga (Region XIII)',                                  region_name: 'Caraga (Region XIII)' },
  { code: 'BARMM',       name: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)', region_name: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)' }
];

const toRegion = (r: any): Region => ({
  code: String(r?.code || r?.region_code || ''),
  name: String(r?.name || r?.region_name || ''),
  region_name: String(r?.region_name || r?.name || '')
});

const toCity = (c: any): City => ({
  code: String(c?.code || c?.city_code || ''),
  name: String(c?.name || c?.city_name || ''),
  city_name: String(c?.city_name || c?.name || ''),
  region_code: String(c?.region_code || '')
});

export function getRegions(): Region[] {
  // Merge whatever is in JSON with FULL_REGIONS and de-dupe by code.
  const map = new Map<string, Region>();
  for (const r of FULL_REGIONS) map.set(r.code, r);
  for (const r of (raw?.regions ?? []).map(toRegion)) {
    if (r.code && r.name) map.set(r.code, r);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCitiesByRegion(region_code: string): City[] {
  if (!region_code) return [];
  return (raw?.cities ?? [])
    .map(toCity)
    .filter(c => c.region_code === region_code && c.code && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function safeSortByName<T extends Record<string, any>>(items: T[]) {
  const label = (x: any) => (x?.name ?? x?.region_name ?? x?.city_name ?? '').toString();
  return [...(items ?? [])].sort((a, b) => label(a).localeCompare(label(b)));
}

// Export PHILIPPINE_LOCATIONS for Browse Jobs page compatibility
export const PHILIPPINE_LOCATIONS = {
  regions: FULL_REGIONS.map(r => r.name),
  provinces: [] as Array<{ name: string; region: string }>, // No province data in current structure
  cities: (raw?.cities ?? []).map(toCity).filter(c => c.code && c.name).map(c => ({
    name: c.name,
    province: '', // No province mapping available
    region: FULL_REGIONS.find(r => r.code === c.region_code)?.name || ''
  }))
};

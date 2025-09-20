import regionsData from '@/data/regions.json';

export type Region = {
  code: string;
  name: string;
};

export type City = {
  name: string;
  regionCode: string;
};

const regions: Region[] = regionsData.regions
  .map((item) => ({
    code: item.code,
    name: item.region_name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const cities: City[] = regionsData.cities
  .map((city) => ({
    name: city.city_name,
    regionCode: city.region_code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const citiesByRegion = new Map<string, City[]>();
for (const city of cities) {
  if (!citiesByRegion.has(city.regionCode)) {
    citiesByRegion.set(city.regionCode, []);
  }
  citiesByRegion.get(city.regionCode)!.push(city);
}

export function getRegions(): Region[] {
  return regions;
}

export function getCitiesForRegion(regionCode?: string): City[] {
  if (!regionCode) {
    return cities;
  }
  return citiesByRegion.get(regionCode) ?? [];
}

export function findRegionByCode(code: string): Region | undefined {
  return regions.find((region) => region.code === code);
}

export function getRegionOptions() {
  return regions.map((region) => ({ label: region.name, value: region.code }));
}

export function getCityOptions(regionCode?: string) {
  const list = getCitiesForRegion(regionCode);
  return list.map((city) => ({ label: city.name, value: city.name }));
}

import regionsJson from '@/../public/data/ph/regions.json';
import citiesJson from '@/../public/data/ph/cities.json';

export type Region = { code: string; name: string };
export type City = { name: string };

type RegionRow = { region_code: string; region_name: string };
type CityRow = { region_code: string; city_name: string };

const regionsData = regionsJson as RegionRow[];
const citiesData = citiesJson as CityRow[];

export function getRegions(): Region[] {
  return regionsData.map(r => ({ code: r.region_code, name: r.region_name }));
}

export function getCitiesByRegion(code: string): City[] {
  return citiesData
    .filter(c => c.region_code === code)
    .map(c => ({ name: c.city_name }));
}

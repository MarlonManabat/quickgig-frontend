import regions from '@/data/ph/regions.json';
import provinces from '@/data/ph/provinces.json';
import cities from '@/data/ph/cities.json';

export interface Region { region_code: string; region_name: string }
export interface Province { region_code: string; province_code: string; province_name: string }
export interface City {
  region_code: string;
  province_code: string;
  city_code: string;
  city_name: string;
  is_city: boolean;
  is_municipality: boolean;
  psgc_code?: string;
}

export interface PhData {
  regions: Region[];
  provinces: Province[];
  cities: City[];
}

export const staticPhData: PhData = {
  regions: regions as Region[],
  provinces: provinces as Province[],
  cities: cities as City[],
};

export async function loadStaticPhData(): Promise<PhData> {
  try {
    const [regions, provinces, cities] = await Promise.all([
      fetch('/data/ph/regions.json').then(r => r.json()),
      fetch('/data/ph/provinces.json').then(r => r.json()),
      fetch('/data/ph/cities.json').then(r => r.json()),
    ]);
    return { regions, provinces, cities } as PhData;
  } catch {
    return staticPhData;
  }
}

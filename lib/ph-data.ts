import regions from '../public/data/ph/regions.json';
import adminAreas from '../public/data/ph/admin_areas.json';
import cities from '../public/data/ph/cities.json';

export interface Region { region_code: string; region_name: string }
export interface AdminArea { region_code: string; province_code: string; province_name: string }
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
  provinces: AdminArea[];
  cities: City[];
}

export const staticPhData: PhData = {
  regions: regions as Region[],
  provinces: adminAreas as AdminArea[],
  cities: cities as City[],
};

export async function loadStaticPhData(): Promise<PhData> {
  try {
    const [regions, provinces, cities] = await Promise.all([
      fetch('/data/ph/regions.json').then((r) => r.json()),
      fetch('/data/ph/admin_areas.json').then((r) => r.json()),
      fetch('/data/ph/cities.json').then((r) => r.json()),
    ]);
    return { regions, provinces, cities } as PhData;
  } catch {
    return staticPhData;
  }
}

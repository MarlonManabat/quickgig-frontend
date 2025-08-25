import { supabase } from './supabaseClient';

export type RegionOption = { label: string; value: string };
export type CityOption = { label: string; value: string };

export async function getRegions(): Promise<RegionOption[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('region, region_slug')
    .order('region');
  if (error) throw error;
  const map = new Map<string, string>();
  data?.forEach(row => {
    if (!map.has(row.region_slug)) map.set(row.region_slug, row.region);
  });
  return Array.from(map, ([value, label]) => ({ label, value }));
}

export async function getCities(regionSlug: string): Promise<CityOption[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('city, city_slug')
    .eq('region_slug', regionSlug)
    .order('city');
  if (error) throw error;
  return data?.map(row => ({ label: row.city, value: row.city_slug })) ?? [];
}

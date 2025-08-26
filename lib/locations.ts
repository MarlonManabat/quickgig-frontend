import { supabase } from "./supabaseClient";
import type { LocationRow } from "./types";
import { asString } from "./normalize";

export type RegionOption = { label: string; value: string };
export type CityOption = { label: string; value: string };

export function toRegionOptions(data: unknown): RegionOption[] {
  const rows: LocationRow[] = Array.isArray(data)
    ? (data as unknown[]).filter(
        (r): r is LocationRow =>
          !!r &&
          typeof (r as any).region_slug === "string" &&
          typeof (r as any).region === "string",
      )
    : [];
  const map = new Map<string, string>();
  for (const row of rows) {
    if (!map.has(row.region_slug)) map.set(row.region_slug, row.region);
  }
  return Array.from(map, ([value, label]) => ({ label, value }));
}

export async function getRegions(): Promise<RegionOption[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("region, region_slug")
    .order("region");
  if (error) throw error;
  return toRegionOptions(data);
}

export async function getCities(regionSlug: string): Promise<CityOption[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("city, city_slug")
    .eq("region_slug", regionSlug)
    .order("city");
  if (error) throw error;
  const rows: CityOption[] = Array.isArray(data)
    ? (data as any[])
        .map((row) => {
          const city = asString(row.city);
          const slug = asString(row.city_slug);
          return city && slug ? { label: city, value: slug } : null;
        })
        .filter((r): r is CityOption => !!r)
    : [];
  return rows;
}

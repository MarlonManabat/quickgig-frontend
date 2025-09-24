import rowsJson from "@/data/ph/cities.json";

export type PHRow = { region: string; province?: string; city: string };

type RawRow = PHRow & {
  region_code?: string;
  province_code?: string | null;
  city_code?: string;
  city_name?: string;
  is_city?: boolean;
  is_municipality?: boolean;
  psgc_code?: string | null;
};

function coerceRows(): PHRow[] {
  if (Array.isArray(rowsJson)) {
    return (rowsJson as RawRow[])
      .map((row) => ({
        region: row.region?.trim() ?? "",
        province: row.province?.trim() || undefined,
        city: row.city?.trim() ?? row.city_name?.trim() ?? "",
      }))
      .filter((row) => row.region && row.city);
  }
  return [];
}

export const ROWS: PHRow[] = coerceRows();

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export const ALL_REGIONS = unique(ROWS.map((r) => r.region)).sort();

export const DEFAULT_QC = ROWS.find((r) => /quezon city/i.test(r.city));
export const DEFAULT_REGION = DEFAULT_QC?.region ?? ALL_REGIONS[0] ?? "";
export const DEFAULT_PROVINCE = DEFAULT_QC?.province ?? "";
export const DEFAULT_CITY = DEFAULT_QC ? "Quezon City" : "";

export function provincesFor(region: string): string[] {
  const filtered = ROWS.filter((r) => !region || r.region === region);
  return unique(filtered.map((r) => r.province || "")).filter(Boolean).sort();
}

export function citiesFor(region: string, province: string): string[] {
  const filtered = ROWS.filter(
    (r) => (!region || r.region === region) && (!province || (r.province || "") === province),
  );
  return unique(filtered.map((r) => r.city)).sort();
}

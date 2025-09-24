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

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

const RAW_ROWS: RawRow[] = Array.isArray(rowsJson) ? (rowsJson as RawRow[]) : [];

const NCR_REGION = "National Capital Region";
const NCR_PROVINCE = "Metro Manila";
const NCR_CANONICAL: readonly string[] = [
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Manila",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Parañaque",
  "Pasay",
  "Pasig",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
] as const;

function normalizeRows(rows: RawRow[]): PHRow[] {
  const out: Mutable<PHRow>[] = rows
    .map((row) => {
      const region = row.region?.trim() ?? "";
      const province = row.province?.trim() ?? "";
      const city = row.city?.trim() ?? row.city_name?.trim() ?? "";
      return {
        region,
        province: province || undefined,
        city,
      } satisfies PHRow;
    })
    .filter((row) => row.region && row.city);

  for (const city of NCR_CANONICAL) {
    const existing = out.find((row) => row.city.toLowerCase() === city.toLowerCase());
    if (existing) {
      existing.city = city;
      if (!existing.region) existing.region = NCR_REGION;
      if (!existing.province) existing.province = NCR_PROVINCE;
      continue;
    }
    out.push({ region: NCR_REGION, province: NCR_PROVINCE, city });
  }

  return out;
}

export const ROWS: PHRow[] = normalizeRows(RAW_ROWS);

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

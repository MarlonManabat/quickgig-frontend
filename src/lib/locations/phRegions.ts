// Canonical PH Regions → Cities (NCR complete list)
// Notes:
// - Keep labels user-facing; values are normalized for queries.
// - Include "All regions" and "All cities" in the UI (not in this registry).

export type RegionKey =
  | "ncr"
  | "calabarzon"
  | "central_luzon"
  | "central_visayas"
  | "western_visayas"
  | "davao_region"
  | "northern_mindanao"
  | "bicol_region";

export type CityOption = { label: string; value: string };

export const REGIONS: { key: RegionKey; label: string }[] = [
  { key: "ncr", label: "Metro Manila" },
  { key: "calabarzon", label: "CALABARZON" },
  { key: "central_luzon", label: "Central Luzon" },
  { key: "central_visayas", label: "Central Visayas" },
  { key: "western_visayas", label: "Western Visayas" },
  { key: "davao_region", label: "Davao Region" },
  { key: "northern_mindanao", label: "Northern Mindanao" },
  { key: "bicol_region", label: "Bicol Region" },
];

// Use normalized values for stable filtering; labels are for UI.
export const CITIES_BY_REGION: Record<RegionKey, CityOption[]> = {
  ncr: [
    { label: "Caloocan", value: "caloocan" },
    { label: "Las Piñas", value: "las_pinas" },
    { label: "Makati", value: "makati" },
    { label: "Malabon", value: "malabon" },
    { label: "Mandaluyong", value: "mandaluyong" },
    { label: "Manila", value: "manila" },
    { label: "Marikina", value: "marikina" },
    { label: "Muntinlupa", value: "muntinlupa" },
    { label: "Navotas", value: "navotas" },
    { label: "Parañaque", value: "paranaque" },
    { label: "Pasay", value: "pasay" },
    { label: "Pasig", value: "pasig" },
    { label: "Pateros", value: "pateros" },
    { label: "Quezon City", value: "quezon_city" },
    { label: "San Juan", value: "san_juan" },
    { label: "Taguig", value: "taguig" },
    { label: "Valenzuela", value: "valenzuela" },
  ],
  calabarzon: [
    { label: "Antipolo", value: "antipolo" },
    { label: "Batangas City", value: "batangas_city" },
    { label: "Lipa", value: "lipa" },
    { label: "Lucena", value: "lucena" },
    { label: "Calamba", value: "calamba" },
    { label: "Sta. Rosa", value: "santa_rosa" },
    { label: "San Pablo", value: "san_pablo" },
    { label: "Tanauan", value: "tanauan" },
  ],
  central_luzon: [
    { label: "Angeles", value: "angeles" },
    { label: "Olongapo", value: "olongapo" },
    { label: "San Fernando (Pampanga)", value: "san_fernando_pampanga" },
    { label: "Tarlac City", value: "tarlac_city" },
    { label: "Balanga", value: "balanga" },
    { label: "Cabanatuan", value: "cabanatuan" },
  ],
  central_visayas: [
    { label: "Cebu City", value: "cebu_city" },
    { label: "Lapu-Lapu", value: "lapu_lapu" },
    { label: "Mandaue", value: "mandaue" },
    { label: "Dumaguete", value: "dumaguete" },
    { label: "Tagbilaran", value: "tagbilaran" },
  ],
  western_visayas: [
    { label: "Iloilo City", value: "iloilo_city" },
    { label: "Bacolod", value: "bacolod" },
    { label: "Roxas City", value: "roxas_city" },
    { label: "Kalibo", value: "kalibo" },
  ],
  davao_region: [
    { label: "Davao City", value: "davao_city" },
    { label: "Tagum", value: "tagum" },
    { label: "Panabo", value: "panabo" },
    { label: "Digos", value: "digos" },
  ],
  northern_mindanao: [
    { label: "Cagayan de Oro", value: "cagayan_de_oro" },
    { label: "Iligan", value: "iligan" },
    { label: "Valencia", value: "valencia" },
  ],
  bicol_region: [
    { label: "Legazpi", value: "legazpi" },
    { label: "Naga", value: "naga" },
    { label: "Sorsogon City", value: "sorsogon_city" },
  ],
};

export function getCitiesForRegion(regionKey?: RegionKey | null): CityOption[] {
  if (!regionKey) return [];
  return CITIES_BY_REGION[regionKey] ?? [];
}

// Helpers to map DB values ↔ normalized values
export function normalizeCityLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}

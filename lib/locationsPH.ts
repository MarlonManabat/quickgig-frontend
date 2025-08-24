export const REGIONS_PH = [
  "Metro Manila",
  "CALABARZON",
  "Central Luzon",
  "Central Visayas",
  "Western Visayas",
  "Davao Region",
  "Northern Mindanao",
  "Bicol Region",
] as const;

export const CITIES_BY_REGION: Record<string, string[]> = {
  "Metro Manila": ["Makati", "Taguig", "Quezon City", "Manila", "Pasig", "Mandaluyong"],
  "CALABARZON": ["Antipolo", "San Pedro", "Dasmariñas", "Bacoor"],
  "Central Luzon": ["Angeles", "San Fernando", "Olongapo"],
  "Central Visayas": ["Cebu City", "Mandaue", "Lapu-Lapu"],
  "Western Visayas": ["Iloilo City", "Bacolod"],
  "Davao Region": ["Davao City", "Tagum"],
  "Northern Mindanao": ["Cagayan de Oro", "Iligan"],
  "Bicol Region": ["Legazpi", "Naga"],
};

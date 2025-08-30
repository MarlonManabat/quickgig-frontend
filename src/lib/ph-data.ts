import regions from "@/data/ph/regions.json";
import locations from "@/data/ph/locations.json";
export type Region = { code: string; name: string };
export const PH_REGIONS = regions as Region[];
export const PH_LOCATIONS = locations as unknown;

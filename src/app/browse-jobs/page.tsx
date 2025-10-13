import LocationFilters from "@/components/location/LocationFilters";
import { apiBaseUrl } from "@/lib/env";
import { DEFAULT_CITY, DEFAULT_PROVINCE, DEFAULT_REGION } from "@/lib/ph-geo";

import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

type JobPayload = {
  id?: string | number;
  title?: string;
  company?: string;
  region?: string;
  province?: string;
  city?: string;
  location?: string;
  [key: string]: unknown;
};

const MOCK = process.env.MOCK_MODE === "1";

function mockJobs(): JobPayload[] {
  return [
    {
      id: "m1",
      title: "Delivery Helper (1-day)",
      company: "Metro Movers",
      region: "National Capital Region",
      province: "Metro Manila",
      city: "Quezon City",
    },
    {
      id: "m2",
      title: "Store Crew",
      company: "Southside Grocer",
      region: "Region IV-A (CALABARZON)",
      province: "Laguna",
      city: "Calamba",
    },
    {
      id: "m3",
      title: "Office Runner",
      company: "Cebu Services",
      region: "Central Visayas",
      province: "Cebu",
      city: "Cebu City",
    },
  ];
}

function readFirst(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === "string") return value;
  return null;
}

async function fetchJobsFromApi(query: {
  region?: string;
  province?: string;
  city?: string;
}): Promise<JobPayload[]> {
  let base: string | undefined;
  try {
    base = apiBaseUrl();
  } catch {
    base = undefined;
  }

  // For server-side fetching, construct absolute URL
  if (!base) {
    // Use Vercel URL or fallback to production domain
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    if (vercelUrl) {
      base = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    } else {
      // Fallback to production domain
      base = "https://app.quickgig.ph";
    }
    base = `${base}/api`;
  }

  const params = new URLSearchParams();
  if (query.region) params.set("region", query.region);
  if (query.province) params.set("province", query.province);
  if (query.city) params.set("city", query.city);

  const queryString = params.toString();
  const url = `${base}/gigs${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data?.items)) return data.items as JobPayload[];
    if (Array.isArray(data)) return data as JobPayload[];
    return [];
  } catch {
    return [];
  }
}

export default async function BrowseJobsPage({
  searchParams = {},
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const params = await Promise.resolve(searchParams);
  
  const hasRegion = Object.prototype.hasOwnProperty.call(params, "region");
  const hasProvince = Object.prototype.hasOwnProperty.call(params, "province");
  const hasCity = Object.prototype.hasOwnProperty.call(params, "city");

  const regionParam = readFirst(params.region);
  const provinceParam = readFirst(params.province);
  const cityParam = readFirst(params.city);

  const region = hasRegion ? regionParam ?? "" : "";
  const province = hasProvince ? provinceParam ?? "" : "";
  const city = hasCity ? cityParam ?? "" : "";

  const apiRegion = hasRegion ? regionParam ?? "" : "";
  const apiProvince = hasProvince ? provinceParam ?? "" : "";
  const apiCity = hasCity ? cityParam ?? "" : "";

  const initialJobs = MOCK
    ? mockJobs()
    : await fetchJobsFromApi({
        region: apiRegion || undefined,
        province: apiProvince || undefined,
        city: apiCity || undefined,
      });

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
      <LocationFilters />
      <JobsClient initialJobs={initialJobs} region={region} province={province} city={city} />
    </main>
  );
}

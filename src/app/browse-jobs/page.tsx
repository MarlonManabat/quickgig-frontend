"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LocationFilters from "@/components/location/LocationFilters";
import JobsClient from "./JobsClient";

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

function readFirst(value: string | string[] | null): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === "string") return value;
  return null;
}

export default function BrowseJobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<JobPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const hasRegion = searchParams.has("region");
  const hasProvince = searchParams.has("province");
  const hasCity = searchParams.has("city");

  const regionParam = readFirst(searchParams.get("region"));
  const provinceParam = readFirst(searchParams.get("province"));
  const cityParam = readFirst(searchParams.get("city"));

  const region = hasRegion ? regionParam ?? "" : "";
  const province = hasProvince ? provinceParam ?? "" : "";
  const city = hasCity ? cityParam ?? "" : "";

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (region) params.set("region", region);
        if (province) params.set("province", province);
        if (city) params.set("city", city);

        const queryString = params.toString();
        const url = `/api/gigs${queryString ? `?${queryString}` : ""}`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch jobs:", res.status, res.statusText);
          setJobs([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data?.items)) {
          setJobs(data.items);
        } else if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [region, province, city]);

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
      <LocationFilters />
      {loading ? (
        <div className="mt-6 text-center text-gray-600">Loading jobs...</div>
      ) : (
        <JobsClient initialJobs={jobs} region={region} province={province} city={city} />
      )}
    </main>
  );
}


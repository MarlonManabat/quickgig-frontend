"use client";

import { Suspense, useEffect, useState } from "react";
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

function BrowseJobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<JobPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const region = searchParams.get("region") || "";
  const province = searchParams.get("province") || "";
  const city = searchParams.get("city") || "";

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

        console.log('[Browse Jobs] Fetching from:', url);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch jobs:", res.status, res.statusText);
          setJobs([]);
          return;
        }

        const data = await res.json();
        console.log('[Browse Jobs] Received data:', data);
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

export default function BrowseJobsPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
        <div className="mt-6 text-center text-gray-600">Loading...</div>
      </main>
    }>
      <BrowseJobsContent />
    </Suspense>
  );
}


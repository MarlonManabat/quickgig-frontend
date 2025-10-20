"use client";
// Force rebuild to deploy location filtering fix
import { useEffect, useState } from "react";
import LocationFilters from "@/components/location/LocationFilters";

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

export default function BrowseJobsPage() {
  const [allJobs, setAllJobs] = useState<JobPayload[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch all jobs once on mount
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        console.log('[Browse Jobs] Fetching all jobs from: /api/gigs');
        const res = await fetch('/api/gigs', { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch jobs:", res.status, res.statusText);
          setAllJobs([]);
          setFilteredJobs([]);
          return;
        }

        const data = await res.json();
        console.log('[Browse Jobs] Received data:', data);
        const jobsList = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setAllJobs(jobsList);
        setFilteredJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setAllJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Filter jobs whenever selection changes
  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const jobRegion = String(job.region || "");
      const jobProvince = String(job.province || "");
      const jobCity = String(job.city || "");

      if (selectedRegion && jobRegion !== selectedRegion) return false;
      if (selectedProvince && jobProvince !== selectedProvince) return false;
      if (selectedCity && jobCity !== selectedCity) return false;

      return true;
    });

    console.log(`[Browse Jobs] Filtered ${filtered.length} jobs (region: ${selectedRegion}, province: ${selectedProvince}, city: ${selectedCity})`);
    setFilteredJobs(filtered);
  }, [allJobs, selectedRegion, selectedProvince, selectedCity]);

  // Handle filter changes from LocationFilters
  const handleFilterChange = (region: string, province: string, city: string) => {
    console.log('[Browse Jobs] Filter changed:', { region, province, city });
    setSelectedRegion(region);
    setSelectedProvince(province);
    setSelectedCity(city);
  };

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
      {/* Location filtering enabled */}
      <LocationFilters onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="mt-6 text-center text-gray-600">Loading jobs...</div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No jobs found matching your criteria.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.region}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/jobs/${job.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View details
                  </a>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm">
                    Apply (1 🎫)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}


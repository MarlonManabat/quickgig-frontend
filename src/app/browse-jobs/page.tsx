"use client";
import { useEffect, useState } from "react";
import { PHILIPPINE_LOCATIONS } from "@/lib/locations";

type JobPayload = {
  id?: string | number;
  title?: string;
  company?: string;
  description?: string;
  budget?: number;
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
      const jobCity = String(job.city || "");

      if (selectedRegion && jobRegion !== selectedRegion) return false;
      if (selectedCity && jobCity !== selectedCity) return false;

      return true;
    });

    console.log(`[Browse Jobs] Filtered ${filtered.length} jobs (region: ${selectedRegion}, city: ${selectedCity})`);
    setFilteredJobs(filtered);
  }, [allJobs, selectedRegion, selectedCity]);

  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    console.log('[Browse Jobs] Region changed to:', newRegion);
    setSelectedRegion(newRegion);
    setSelectedCity(""); // Reset dependent filter
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    console.log('[Browse Jobs] City changed to:', newCity);
    setSelectedCity(newCity);
  };

  // Get available cities for selected region
  const availableCities = selectedRegion 
    ? PHILIPPINE_LOCATIONS.cities.filter(c => c.region === selectedRegion)
    : [];

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
      
      {/* Location Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="filter-region"
          >
            <option value="">All regions</option>
            {PHILIPPINE_LOCATIONS.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City / Municipality
          </label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedRegion}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            data-testid="filter-city"
          >
            <option value="">All cities</option>
            {availableCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 text-center text-gray-600" data-testid="jobs-loading">
          Loading jobs...
        </div>
      ) : (
        <div className="mt-6 space-y-4" data-testid="jobs-list">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-600 py-8" data-testid="jobs-empty">
              No jobs found matching your criteria.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                data-testid="job-card"
              >
                <h2 className="text-lg font-semibold">{job.title}</h2>
                {job.company && <p className="text-gray-600">{job.company}</p>}
                {job.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description}</p>}
                <div className="mt-2 flex items-center gap-3 text-sm">
                  {(job.budget || (job as any).rate) && (
                    <span className="text-green-600 font-semibold">
                      ₱{Number(job.budget || (job as any).rate || 0).toLocaleString()}
                    </span>
                  )}
                  {job.region && (
                    <span className="text-gray-500">{job.region}</span>
                  )}
                  {job.city && (
                    <span className="text-gray-500">• {job.city}</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/browse-jobs/${job.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View details
                  </a>
                  <button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium"
                    data-testid="apply-button"
                  >
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


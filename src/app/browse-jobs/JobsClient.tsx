"use client";

import Link from "next/link";

type JobLike = {
  id?: string | number;
  title?: string;
  company?: string;
  region?: string | null;
  province?: string | null;
  city?: string | null;
  location?: string | null;
  [key: string]: unknown;
};

function getField(job: JobLike, candidates: string[]): string {
  for (const key of candidates) {
    const value = job[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export default function JobsClient({
  initialJobs,
  region,
  province,
  city,
}: {
  initialJobs: JobLike[];
  region: string;
  province: string;
  city: string;
}) {
  const items = Array.isArray(initialJobs) ? initialJobs : [];

  const filtered = items.filter((job) => {
    const jobRegion = getField(job, ["region", "location_region", "locationRegion"]);
    const jobProvince = getField(job, ["province", "location_province", "locationProvince"]);
    const jobCity = getField(job, ["city", "location_city", "locationCity"]);

    if (region && jobRegion !== region) return false;
    if (province && jobProvince !== province) return false;
    if (city && jobCity !== city) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="mt-6 rounded border p-4 text-gray-600" data-testid="jobs-empty">
        No jobs found for your filters. Try clearing or changing the location.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4" data-testid="jobs-list">
      {filtered.map((job, index) => {
        const rawId = job.id;
        const id = rawId != null ? String(rawId) : `job-${index}`;
        const title = (job.title ?? `Job #${id}`).toString();
        const company = typeof job.company === "string" ? job.company : undefined;
        const jobRegion = getField(job, ["region", "location_region", "locationRegion"]);
        const jobProvince = getField(job, ["province", "location_province", "locationProvince"]);
        const jobCity = getField(job, ["city", "location_city", "locationCity"]);
        const locationText = [jobCity, jobProvince, jobRegion].filter(Boolean).join(", ") || job.location || "—";

        return (
          <article key={id} className="rounded border p-4" data-testid="job-card">
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-sm text-gray-600">{company ?? "QuickGig"}</p>
            <p className="text-sm text-gray-500">{locationText}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href={`/browse-jobs/${encodeURIComponent(id)}`} className="text-blue-600 underline">
                View details
              </Link>
              <Link
                href={`/apply/${encodeURIComponent(id)}`}
                className="inline-block rounded bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 text-sm font-medium"
                data-testid="job-apply"
              >
                Apply (1 🎫)
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

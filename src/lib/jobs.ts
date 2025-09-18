import { apiBaseUrl, isVercelProd } from "@/lib/env";
import { supabase } from "@/lib/supabaseClient";
import { MOCK_JOBS, MOCK_JOB_BY_ID, type MockJob } from "@/mocks/jobs";
import type { Insert } from "@/types/db";

type JobsQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  location?: string;
  sort?: "newest" | "relevance" | "pay";
};

const DEFAULT_PAGE_SIZE = 10;

function filterMockJobs(
  jobs: MockJob[],
  q?: string,
  location?: string,
  sort: JobsQuery['sort'] = "newest",
): MockJob[] {
  let filtered = [...jobs];
  if (q) {
    const needle = q.trim().toLowerCase();
    if (needle) {
      filtered = filtered.filter((job) => {
        const title = job.title ?? "";
        const company = job.company ?? "";
        return `${title} ${company}`.toLowerCase().includes(needle);
      });
    }
  }
  if (location) {
    const loc = location.trim().toLowerCase();
    if (loc) {
      filtered = filtered.filter((job) => {
        const jobLocation = String(job.location ?? "").toLowerCase();
        if (jobLocation.includes(loc)) return true;
        if (!loc.includes("remote")) return false;
        const remoteFlag =
          "remote" in job && typeof (job as { remote?: boolean }).remote === "boolean"
            ? Boolean((job as { remote?: boolean }).remote)
            : false;
        return remoteFlag;
      });
    }
  }
  if (sort === "newest" || sort === "relevance") {
    filtered.sort((a, b) => {
      const aTs = a.postedAt ? Date.parse(a.postedAt) : 0;
      const bTs = b.postedAt ? Date.parse(b.postedAt) : 0;
      return bTs - aTs;
    });
  }
  return filtered;
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return start < 0 ? items.slice(0, pageSize) : items.slice(start, start + pageSize);
}

export async function fetchJobs(opts: JobsQuery = {}): Promise<{
  items: MockJob[];
  total: number;
}> {
  const isProd = isVercelProd();
  const base = apiBaseUrl();
  const page = Number.isFinite(opts.page) && (opts.page ?? 0) > 0 ? Number(opts.page) : 1;
  const rawPageSize =
    Number.isFinite(opts.pageSize) && (opts.pageSize ?? 0) > 0
      ? Number(opts.pageSize)
      : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(50, Math.max(1, rawPageSize));
  const q = opts.q?.trim();
  const location = opts.location?.trim();
  const sort =
    opts.sort && ["newest", "relevance", "pay"].includes(opts.sort) ? opts.sort : undefined;
  const effectiveSort = sort ?? "newest";
  const search = new URLSearchParams();
  if (page) search.set("page", String(page));
  if (pageSize) {
    search.set("pageSize", String(pageSize));
    search.set("limit", String(pageSize));
  }
  if (q) {
    search.set("q", q);
  }
  if (location) search.set("location", location);
  if (sort) search.set("sort", sort);
  const queryString = search.toString();

  const mockResponse = () => {
    const filtered = filterMockJobs(MOCK_JOBS, q, location, effectiveSort);
    return { items: paginate(filtered, page, pageSize), total: filtered.length };
  };

  if (!base) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock jobs fallback:", "API base unset");
      return mockResponse();
    }
    return { items: [], total: 0 };
  }
  try {
    const url = `${base}/jobs${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    const data: any = await res.json();
    const rawItems = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
        ? data
        : [];
    const items = rawItems as MockJob[];
    const total = Number.isFinite(data?.total) ? Number(data.total) : items.length;
    return { items, total };
  } catch (error) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock jobs fallback:", (error as Error).message);
      return mockResponse();
    }
    // eslint-disable-next-line no-console
    console.error("[WebServer] jobs fetch failed:", (error as Error).message);
    return { items: [], total: 0 };
  }
}

export async function fetchJob(id: string | number): Promise<MockJob | null> {
  const isProd = isVercelProd();
  const base = apiBaseUrl();
  if (!base) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock job fallback:", "API base unset");
      return MOCK_JOB_BY_ID(id);
    }
    return null;
  }
  try {
    const res = await fetch(`${base}/jobs/${encodeURIComponent(String(id))}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return (await res.json()) as MockJob;
  } catch (error) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock job fallback:", (error as Error).message);
      return MOCK_JOB_BY_ID(id);
    }
    // eslint-disable-next-line no-console
    console.error("[WebServer] job fetch failed:", (error as Error).message);
    return null;
  }
}

export type NewJob = {
  title: string;
  company?: string;
  is_online: boolean;
  region: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
};

export async function createJob(job: NewJob) {
  if (!job.is_online) {
    if (!job.region || !job.province)
      throw new Error("Region and province required");
    if (!job.city && !job.address)
      throw new Error("City or address required");
  } else {
    job.region = job.province = job.city = job.address = null;
  }
  const payload = {
    title: job.title,
    company: job.company,
    is_online: job.is_online,
    location_region: job.region,
    location_province: job.province,
    location_city: job.city,
    location_address: job.address,
  };
  const { data, error } = await supabase
    .from("jobs")
    .insert([
      payload satisfies Insert<"jobs">,
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

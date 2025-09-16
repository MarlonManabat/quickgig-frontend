import { getApiBase } from "@/lib/env";
import { supabase } from "@/lib/supabaseClient";
import { MOCK_JOBS, MOCK_JOB_BY_ID, type MockJob } from "@/mocks/jobs";
import type { Insert } from "@/types/db";

type Pagination = { page?: number; pageSize?: number };

export async function fetchJobs(opts: Pagination = {}): Promise<{
  items: MockJob[];
  total: number;
}> {
  const base = getApiBase();
  try {
    if (!base) throw new Error("no-api");
    const search = new URLSearchParams();
    if (opts.page) search.set("page", String(opts.page));
    if (opts.pageSize) search.set("pageSize", String(opts.pageSize));
    const url = `${base}/jobs${search.toString() ? `?${search.toString()}` : ""}`;
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
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock jobs fallback:", (error as Error).message);
    }
    return { items: MOCK_JOBS, total: MOCK_JOBS.length };
  }
}

export async function fetchJob(id: string | number): Promise<MockJob | null> {
  const base = getApiBase();
  try {
    if (!base) throw new Error("no-api");
    const res = await fetch(`${base}/jobs/${encodeURIComponent(String(id))}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return (await res.json()) as MockJob;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[WebServer] using mock job fallback:", (error as Error).message);
    }
    return MOCK_JOB_BY_ID(id);
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

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
};

interface JobsResponse {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
}

interface JobsParams {
  q?: string;
  page?: number;
  limit?: number;
  location?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function ensureBaseUrl() {
  if (!baseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_API_BASE_URL. Set it in your environment to fetch jobs.'
    );
  }
  return baseUrl;
}

export async function getJobs(params: JobsParams = {}): Promise<JobsResponse> {
  const url = new URL('/jobs', ensureBaseUrl());
  const { q, page, limit, location } = params;
  if (q) url.searchParams.set('q', q);
  if (typeof page === 'number') url.searchParams.set('page', String(page));
  if (typeof limit === 'number') url.searchParams.set('limit', String(limit));
  if (location) url.searchParams.set('location', location);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Jobs request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const url = `${ensureBaseUrl()}/jobs/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Job request failed with status ${res.status}`);
  }
  return res.json();
}


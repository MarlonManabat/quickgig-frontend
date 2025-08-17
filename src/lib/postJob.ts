export type JobPostPayload = {
  title: string;
  description: string;
  location?: string;
  category?: string;
  payMin?: number | null;
  payMax?: number | null;
  tags?: string[];
  email?: string; // contact email (optional)
};

export function normalizeJobPost(input: Record<string, unknown>): JobPostPayload {
  const toNum = (v: unknown) => {
    const n = typeof v === 'string' ? Number(v) : v;
    return typeof n === 'number' && Number.isFinite(n) ? n : null;
  };
  const t = (s: unknown) => (typeof s === 'string' ? s.trim() : '');
  const arr = (a: unknown) => Array.isArray(a) ? a.map(t).filter(Boolean) :
    typeof a === 'string' ? a.split(',').map(t).filter(Boolean) : [];
  const title = t(input.title);
  const description = t(input.description);
  if (!title || !description) throw new Error('title and description are required');
  const payload: JobPostPayload = {
    title,
    description,
    location: t(input.location),
    category: t(input.category),
    payMin: toNum(input.payMin),
    payMax: toNum(input.payMax),
    tags: arr(input.tags),
    email: t(input.email) || undefined,
  };
  return payload;
}

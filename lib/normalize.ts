export type Role = 'employer' | 'admin' | 'seeker';

export function toStr(v: unknown): string | null {
  if (v == null) return null;
  return typeof v === 'string' ? v : String(v);
}

export function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function toBool(v: unknown): boolean {
  // supports timestamps, truthy values, explicit booleans
  if (typeof v === 'boolean') return v;
  if (v == null) return false;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  return Boolean(v);
}

export function toRole(v: unknown): Role {
  return v === 'employer' || v === 'admin' || v === 'seeker' ? v : 'seeker';
}


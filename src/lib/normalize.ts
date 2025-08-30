import type { Role } from './types';

export function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

export function asNumber(v: unknown): number | null {
  return typeof v === 'number' && !Number.isNaN(v) ? v : null;
}

export function asRole(v: unknown): Role | null {
  return v === 'employer' || v === 'seeker' || v === 'admin' ? v : null;
}

// Legacy aliases
export const toStr = asString;
export const toNum = asNumber;
export function toRole(v: unknown): Role {
  return asRole(v) ?? 'seeker';
}

export function toBool(v: unknown): boolean {
  // supports timestamps, truthy values, explicit booleans
  if (typeof v === 'boolean') return v;
  if (v == null) return false;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  return Boolean(v);
}

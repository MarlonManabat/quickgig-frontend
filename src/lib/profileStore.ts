import { ApplicantProfile } from '@/types/profile';
const KEY='qq_profile';
export function getProfile(seed: Partial<ApplicantProfile>): ApplicantProfile {
  const now = new Date().toISOString();
  const p = typeof window==='undefined' ? null : JSON.parse(localStorage.getItem(KEY)||'null');
  if (p) return p;
  const base: ApplicantProfile = {
    id: seed.id || 'me', name: seed.name || '', email: seed.email || '',
    roles: [], updatedAt: now
  };
  if (typeof window!=='undefined') localStorage.setItem(KEY, JSON.stringify(base));
  return base;
}
export function saveProfile(p: ApplicantProfile){ p.updatedAt=new Date().toISOString(); if(typeof window!=='undefined') localStorage.setItem(KEY, JSON.stringify(p)); return p; }

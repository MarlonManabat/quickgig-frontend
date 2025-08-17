import { ApplicantProfile } from '@/types/profile';
import { UploadedFile } from '@/types/upload';

const KEY='qq_profile';
const RESUME_KEY='profile:resume:v2';
const AVATAR_KEY='profile:avatar:v2';

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

export function getResume(): UploadedFile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RESUME_KEY) || localStorage.getItem('profile:resume:v1');
    const p = raw ? JSON.parse(raw) : null;
    if (!p) return null;
    if (p.url) return p;
    if (p.data) return { name: p.name, url: p.data, contentType: p.type, size: p.size };
    return null;
  } catch {
    return null;
  }
}

export function setResume(f: UploadedFile | null): void {
  if (typeof window === 'undefined') return;
  if (f) localStorage.setItem(RESUME_KEY, JSON.stringify(f));
  else localStorage.removeItem(RESUME_KEY);
}

export function getAvatar(): UploadedFile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AVATAR_KEY) || localStorage.getItem('profile:avatar:v1');
    const p = raw ? JSON.parse(raw) : null;
    if (!p) return null;
    if (p.url) return p;
    if (p.data) return { name: p.name, url: p.data, contentType: p.type, size: p.size };
    return null;
  } catch {
    return null;
  }
}

export function setAvatar(f: UploadedFile | null): void {
  if (typeof window === 'undefined') return;
  if (f) localStorage.setItem(AVATAR_KEY, JSON.stringify(f));
  else localStorage.removeItem(AVATAR_KEY);
}

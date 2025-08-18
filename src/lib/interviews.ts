import type { Interview, NewInterviewInput } from '@/types/interview';
import type { RequestInit } from 'next/dist/server/web/spec-extension/request';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const KEY = 'quickgig:interviews';
let memory: Interview[] | null = null;

function read(): Interview[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Interview[]) : [];
  }
  return memory || [];
}

function write(list: Interview[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } else {
    memory = list;
  }
}

function seed() {
  const existing = read();
  if (!existing.length) {
    const now = new Date();
    const sample: Interview = {
      id: '1',
      jobId: '1',
      applicantId: '1',
      employerId: '1',
      startsAt: now.toISOString(),
      endsAt: new Date(now.getTime() + 30 * 60000).toISOString(),
      method: 'video',
      status: 'proposed',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    write([sample]);
  }
}

export async function listByUser(role: 'applicant' | 'employer'): Promise<Interview[]> {
  if (MODE === 'mock') {
    seed();
    return read();
  }
  const res = await fetch(`${BASE}/api/interviews?role=${role}`, {
    credentials: 'include',
  } as RequestInit);
  if (!res.ok) throw new Error('engine');
  return (await res.json()) as Interview[];
}

export async function createInvite(input: NewInterviewInput): Promise<Interview> {
  if (MODE === 'mock') {
    const list = read();
    const now = new Date();
    const starts = new Date(input.startsAt);
    const duration = input.durationMin || parseInt(process.env.NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES || '30', 10);
    const interview: Interview = {
      id: String(Date.now()),
      jobId: input.jobId,
      applicantId: input.applicantId,
      employerId: '1',
      startsAt: starts.toISOString(),
      endsAt: new Date(starts.getTime() + duration * 60000).toISOString(),
      method: input.method || (process.env.NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD as Interview['method']) || 'video',
      locationOrLink: input.locationOrLink,
      notes: input.notes,
      status: 'proposed',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    list.push(interview);
    write(list);
    return interview;
  }
  const res = await fetch(`${BASE}/api/interviews`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  } as RequestInit);
  if (!res.ok) throw new Error('engine');
  return (await res.json()) as Interview;
}

export async function updateInterview(
  id: string,
  patch: Partial<Pick<Interview, 'startsAt' | 'endsAt' | 'status' | 'notes'>>,
): Promise<Interview> {
  if (MODE === 'mock') {
    const list = read();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('not found');
    const interview = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    list[idx] = interview;
    write(list);
    return interview;
  }
  const res = await fetch(`${BASE}/api/interviews/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  } as RequestInit);
  if (!res.ok) throw new Error('engine');
  return (await res.json()) as Interview;
}

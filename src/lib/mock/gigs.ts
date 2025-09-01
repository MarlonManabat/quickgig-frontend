import { randomUUID } from 'crypto';
import type { Gig, GigInsert } from '@/types/gigs';

type MockGig = Gig & { region?: string; rate?: number };

const gigs: MockGig[] = [
  {
    id: randomUUID(),
    title: 'Sample Gig A',
    company: 'Company A',
    description: 'Sample description A',
    status: 'open',
    created_at: new Date().toISOString(),
    location: 'NCR',
    pay_min: 400,
    pay_max: 600,
    remote: false,
    region: 'NCR',
    rate: 500,
  },
  {
    id: randomUUID(),
    title: 'Sample Gig B',
    company: 'Company B',
    description: 'Sample description B',
    status: 'open',
    created_at: new Date().toISOString(),
    location: 'Region IV-A (CALABARZON)',
    pay_min: 250,
    pay_max: 350,
    remote: false,
    region: 'Region IV-A (CALABARZON)',
    rate: 300,
  },
  {
    id: randomUUID(),
    title: 'Another Sample',
    company: 'Company C',
    description: 'Another description',
    status: 'open',
    created_at: new Date().toISOString(),
    location: 'NCR',
    pay_min: 600,
    pay_max: 800,
    remote: true,
    region: 'NCR',
    rate: 700,
  },
];

export function list(): Gig[] {
  return gigs;
}

export function gigById(id: string | number) {
  return gigs.find((g) => g.id === String(id)) ?? null;
}

export function create(input: GigInsert): Gig {
  const gig: MockGig = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    status: input.status ?? 'open',
    ...input,
  };
  gigs.push(gig);
  return gig;
}

export function apply(gigId: string | number) {
  return { id: `mock-${Date.now()}`, gig_id: String(gigId), status: 'submitted' as const };
}

export { gigs };

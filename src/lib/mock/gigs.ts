export interface MockGig {
  id: number;
  title: string;
  description: string;
  company: string;
  region: string;
  rate: number;
  created_at: string;
}

export const gigs: MockGig[] = [
  {
    id: 1,
    title: 'Sample Gig A',
    description: 'Sample description A',
    company: 'Company A',
    region: 'NCR',
    rate: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Sample Gig B',
    description: 'Sample description B',
    company: 'Company B',
    region: 'Region IV-A (CALABARZON)',
    rate: 300,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Another Sample',
    description: 'Another description',
    company: 'Company C',
    region: 'NCR',
    rate: 700,
    created_at: new Date().toISOString(),
  },
];

export function list() {
  return gigs;
}

export function gigById(id: string | number) {
  return gigs.find((g) => g.id === Number(id)) ?? null;
}

export function apply(gigId: string | number) {
  return { id: `mock-${Date.now()}`, gig_id: String(gigId), status: 'submitted' as const };
}

export type MockJob = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  postedAt?: string;
  description?: string;
  applyUrl?: string;
};

export const MOCK_JOBS: MockJob[] = [
  {
    id: 101,
    title: 'Barista (Weekends)',
    company: 'BeanBox',
    location: 'Makati',
    postedAt: '2025-09-12T08:00:00Z',
    description: 'Serve coffee, great with customers, 2x weekend shifts.',
    applyUrl: 'https://app.quickgig.ph/apply/101',
  },
  {
    id: 102,
    title: 'Event Staff',
    company: 'BrightEvents',
    location: 'BGC',
    postedAt: '2025-09-10T08:00:00Z',
    description: 'Assist at weekend expo; on-your-feet role.',
    applyUrl: 'https://app.quickgig.ph/apply/102',
  },
  {
    id: 103,
    title: 'Delivery Rider (Part-time)',
    company: 'SwiftShip',
    location: 'Quezon City',
    postedAt: '2025-09-08T08:00:00Z',
    description: 'Own motorcycle preferred. Fuel stipend.',
    applyUrl: 'https://app.quickgig.ph/apply/103',
  },
];

export function MOCK_JOB_BY_ID(id: string | number): MockJob | null {
  const str = String(id);
  return MOCK_JOBS.find((job) => String(job.id) === str) ?? null;
}

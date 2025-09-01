import type { Application } from '@/types/applications';

const items: Application[] = [
  {
    id: 'mock-app-1',
    gig_id: '1',
    title: 'Frontend Developer',
    company: 'Acme Corp',
    status: 'submitted',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-app-2',
    gig_id: '2',
    title: 'Marketing Assistant',
    company: 'Bright Ideas Ltd.',
    status: 'reviewing',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-app-3',
    gig_id: '3',
    title: 'Data Analyst',
    company: 'DataWorks',
    status: 'rejected',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-app-4',
    gig_id: '4',
    title: 'UI Designer',
    company: 'DesignHub',
    status: 'accepted',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-app-5',
    gig_id: '5',
    title: 'Customer Support',
    company: 'HelpDesk Co.',
    status: 'submitted',
    created_at: new Date().toISOString(),
  },
];

export function list(_uid: string): Application[] {
  return items;
}


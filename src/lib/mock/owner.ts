import type { OwnerGigRow, ApplicantRow, AppStatus } from '@/types/owner';

type MockGig = OwnerGigRow & { owner: string };
type MockApplication = ApplicantRow & { gig_id: string };

const gigs: MockGig[] = [
  {
    id: 'g1',
    owner: 'stub-owner',
    title: 'Sample Gig One',
    city: 'Manila',
    budget: 5000,
    status: 'open',
    created_at: new Date().toISOString(),
  },
  {
    id: 'g2',
    owner: 'stub-owner',
    title: 'Sample Gig Two',
    city: 'Quezon City',
    budget: 7000,
    status: 'closed',
    created_at: new Date().toISOString(),
  },
];

const applications: MockApplication[] = [
  {
    id: 'a1',
    gig_id: 'g1',
    applicant: 'worker-1',
    created_at: new Date().toISOString(),
    status: 'submitted',
  },
  {
    id: 'a2',
    gig_id: 'g1',
    applicant: 'worker-2',
    created_at: new Date().toISOString(),
    status: 'accepted',
  },
  {
    id: 'a3',
    gig_id: 'g2',
    applicant: 'worker-3',
    created_at: new Date().toISOString(),
    status: 'submitted',
  },
];

export function listGigs(uid: string): OwnerGigRow[] {
  return gigs.filter((g) => g.owner === uid);
}

export function listApplicants(gigId: string): ApplicantRow[] {
  return applications
    .filter((a) => a.gig_id === gigId)
    .map(({ id, applicant, created_at, status }) => ({
      id,
      applicant,
      created_at,
      status,
    }));
}

export function setGigStatus(
  gigId: string,
  status: 'open' | 'closed',
): boolean {
  const gig = gigs.find((g) => g.id === gigId);
  if (!gig) return false;
  gig.status = status;
  return true;
}

export function setApplicationStatus(
  appId: string,
  status: AppStatus,
): boolean {
  const app = applications.find((a) => a.id === appId);
  if (!app) return false;
  app.status = status;
  return true;
}

export type AppStatus = 'submitted' | 'accepted' | 'rejected';

export interface OwnerGigRow {
  id: string;
  title: string;
  city: string;
  budget: number;
  status: 'open' | 'closed';
  created_at: string;
}

export interface ApplicantRow {
  id: string;
  applicant: string;
  created_at: string;
  status: AppStatus;
}

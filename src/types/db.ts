export interface Gig {
  id: number;
  owner: string;
  title: string;
  description: string;
  budget: number | null;
  city: string | null;
  created_at: string;
  status: string | null;
  published: boolean;
}

export interface GigInsert {
  owner: string;
  title: string;
  description: string;
  budget?: number | null;
  city?: string | null;
  status?: string | null;
  published?: boolean;
}

export interface GigApplicationInsert {
  gig_id: number;
  applicant: string;
  cover_letter?: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  can_post_job: boolean | null;
}

export type ApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  id: string;
  title: string;
  company: string;
  status: ApplicationStatus;
  created_at: string;
}

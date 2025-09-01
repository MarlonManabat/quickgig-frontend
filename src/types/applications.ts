export interface ApplicationRequest {
  gig_id: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'rejected'
  | 'accepted';

export interface Application {
  id: string;
  gig_id: string;
  title: string;
  company: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface ApplicationCreateResponse {
  id: string;
  status: 'submitted';
}

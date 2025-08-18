import type { OfferTerms } from './application';

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'hired'
  | 'withdrawn'
  | 'interviewing'
  | 'offer_made'
  | 'offer_accepted'
  | 'offer_declined'
  | 'not_selected';

export interface ApplicationEvent {
  at: string;
  type: ApplicationStatus | 'note';
  by?: 'applicant' | 'employer';
  note?: string;
  meta?: OfferTerms | Record<string, unknown>;
}
export interface ApplicationDetail {
  id: string; jobId: string; jobTitle: string; company?: string;
  status: ApplicationStatus; events: ApplicationEvent[];
  resumeUrl?: string; avatarUrl?: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'viewed'
  | 'shortlisted'
  | 'rejected'
  | 'hired'
  | 'withdrawn'
  | 'interviewing'
  | 'offer_made'
  | 'offer_accepted'
  | 'offer_declined'
  | 'not_selected';

export type HireStatus =
  | 'applied'
  | 'interviewing'
  | 'offer_made'
  | 'offer_accepted'
  | 'offer_declined'
  | 'hired'
  | 'not_selected';

export interface OfferTerms {
  startDate?: string;
  rate?: string;
  notes?: string;
}

export interface HireEvent {
  at: string;
  type: HireStatus;
  by: 'employer' | 'applicant';
  meta?: OfferTerms | Record<string, unknown>;
}

export interface HireState {
  events: HireEvent[];
  status: HireStatus;
}

export function appendEvent(events: HireEvent[], e: HireEvent): HireEvent[] {
  return [e, ...events].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}

export function currentStatus(events: HireEvent[]): HireStatus {
  return events.length ? events[0].type : 'applied';
}

export const hireBadges: Record<HireStatus, string> = {
  applied: 'bg-gray-200 text-gray-800',
  interviewing: 'bg-blue-200 text-blue-800',
  offer_made: 'bg-yellow-200 text-yellow-800',
  offer_accepted: 'bg-green-200 text-green-800',
  offer_declined: 'bg-red-200 text-red-800',
  hired: 'bg-green-200 text-green-800',
  not_selected: 'bg-gray-200 text-gray-800',
};
export interface ApplicationSummary {
  id: string;       // application id
  jobId: string;
  jobTitle: string;
  company?: string;
  location?: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO
  updatedAt: string;   // ISO
  unreadCount?: number; // messages for this job thread
}

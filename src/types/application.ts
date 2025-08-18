export type ApplicationStatus = 'applied'|'viewed'|'shortlisted'|'rejected'|'hired';
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

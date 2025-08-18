export type ApplicationStatus = 'new'|'reviewing'|'shortlisted'|'rejected'|'hired'|'withdrawn';
export interface ApplicationEvent { at: string; type: ApplicationStatus|'note'; by?: 'applicant'|'employer'; note?: string; }
export interface ApplicationDetail {
  id: string; jobId: string; jobTitle: string; company?: string;
  status: ApplicationStatus; events: ApplicationEvent[];
  resumeUrl?: string; avatarUrl?: string;
}

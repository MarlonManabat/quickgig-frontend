export type ApplicantStatus = 'new' | 'shortlist' | 'interview' | 'hired' | 'rejected';
export type ApplicantSummary = {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
  resumeUrl?: string;
  notes?: string;
  status: ApplicantStatus;
};

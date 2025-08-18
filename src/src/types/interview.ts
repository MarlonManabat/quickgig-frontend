export type InterviewMethod = 'video' | 'phone' | 'in_person';
export type InterviewStatus = 'proposed' | 'accepted' | 'declined' | 'cancelled' | 'rescheduled';

export interface Interview {
  id: string;
  appId: string;            // application id
  jobId: string;
  employerId: string;
  applicantId: string;
  method: InterviewMethod;
  whenISO: string;          // ISO date
  durationMins: number;
  note?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

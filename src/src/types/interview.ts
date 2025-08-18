export type InterviewMode = 'video' | 'phone' | 'in_person';
export type InterviewStatus =
  | 'pending'
  | 'proposed'
  | 'accepted'
  | 'declined'
  | 'canceled'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface Interview {
  id: string;
  jobId: string;
  applicantId: string;
  employerId: string;
  mode?: InterviewMode;
  startISO?: string;
  durationMins?: number;
  place?: string;
  status: InterviewStatus;
  notes?: string;
  note?: string;
  updatedAt: string;
  createdAt: string;
  // legacy fields
  appId?: string;            // application id
  method?: InterviewMode;
  whenISO: string;          // ISO date
  startsAt: string;
  endsAt?: string;
}

export type InterviewMethod = InterviewMode; // compat

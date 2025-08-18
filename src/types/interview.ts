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
  startISO?: string; // UTC ISO
  durationMins?: number;
  place?: string; // in_person address or video/phone instructions
  status: InterviewStatus;
  notes?: string;
  note?: string;
  updatedAt: string;
  createdAt: string;
  // legacy/compat fields
  appId?: string;
  method?: InterviewMode;
  whenISO: string;
  startsAt: string;
  endsAt?: string;
  locationOrLink?: string;
}

export interface NewInterviewInput {
  jobId: string;
  applicantId: string;
  employerId?: string;
  startISO?: string; // ISO
  durationMins?: number;
  mode?: InterviewMode;
  place?: string;
  notes?: string;
  // legacy names
  startsAt: string;
  durationMin?: number;
  method?: InterviewMode;
  locationOrLink?: string;
}

export type InterviewMethod = InterviewMode; // backward compat

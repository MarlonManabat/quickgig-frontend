export type InterviewMethod = 'video'|'phone'|'in_person';
export type InterviewStatus = 'proposed'|'accepted'|'declined'|'cancelled'|'completed'|'rescheduled';

export interface Interview {
  id: string;
  jobId: string;
  applicantId: string;
  employerId: string;
  startsAt: string;   // ISO
  endsAt: string;     // ISO
  method: InterviewMethod;
  locationOrLink?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string; updatedAt: string;
}

export interface NewInterviewInput {
  jobId: string;
  applicantId: string;
  startsAt: string; // ISO
  durationMin?: number;
  method?: InterviewMethod;
  locationOrLink?: string;
  notes?: string;
}

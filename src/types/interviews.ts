export type InterviewStatus = 'proposed'|'accepted'|'declined'|'cancelled'|'done';
export interface InterviewSlot { at: string; tz?: string; }
export interface Interview {
  id: string;
  jobId: string;
  appId: string;               // applicant id
  status: InterviewStatus;
  method: 'in-person'|'phone'|'video';
  location?: string;           // address or link
  slots: InterviewSlot[];      // 1–3 proposed
  chosen?: InterviewSlot;      // when accepted
  note?: string;
  createdAt: string;
  updatedAt: string;
}

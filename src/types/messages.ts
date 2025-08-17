export type Message = {
  id: string;
  threadId: string;
  fromId: string;            // user id
  toId: string;              // user id
  jobId?: string;
  body: string;
  createdAt: string;         // ISO
  read?: boolean;
};

export type Thread = {
  id: string;
  participants: string[];    // [employerId, applicantId]
  jobId?: string;
  lastMessageAt: string;
  unreadFor?: string[];      // user ids with unread
  title?: string;            // e.g., "Job Title · Employer"
};

export type Conversation = Thread;

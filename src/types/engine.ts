import type { Job } from './jobs';
import type { ApplicationSummary, ApplicationStatus } from './application';
import type { Conversation, Message, Thread } from './messages';

// Job search/detail
export interface JobDTO {
  id: string | number;
  title: string;
  company: string;
  location: string;
  rate?: string;
  description?: string;
  tags?: string[];
}

export const mapJob = (dto: JobDTO): Job => ({
  id: String(dto.id),
  title: dto.title,
  company: dto.company,
  location: dto.location,
  rate: dto.rate,
  description: dto.description || '',
  tags: dto.tags,
});

export interface JobsResponseDTO {
  items: JobDTO[];
}

export const mapJobs = (dto: JobsResponseDTO): Job[] => dto.items.map(mapJob);

// Apply
export interface ApplyRequestDTO {
  resumeUrl?: string;
  avatarUrl?: string;
  resumeBase64?: string; // fallback for mock
  avatarBase64?: string; // fallback for mock
}

// Account profile
export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const mapProfile = (dto: ProfileDTO): Profile => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  avatar: dto.avatar,
});

// Applications
export interface ApplicationDTO {
  id: string;
  job_id: string;
  job_title: string;
  status: string;
  submitted_at: string;
  updated_at: string;
}

export const mapApplication = (dto: ApplicationDTO): ApplicationSummary => ({
  id: dto.id,
  jobId: dto.job_id,
  jobTitle: dto.job_title,
  status: dto.status as ApplicationStatus,
  submittedAt: dto.submitted_at,
  updatedAt: dto.updated_at,
});

// Employer data (feature gated)
export interface EmployerJobDTO extends JobDTO {
  applicants?: number;
}

export const mapEmployerJob = (dto: EmployerJobDTO): Job => mapJob(dto);

export interface EmployerApplicantDTO extends ApplicationDTO {
  applicant_name?: string;
}

export const mapEmployerApplicant = (dto: EmployerApplicantDTO): ApplicationSummary => mapApplication(dto);

// Messages (read-only)
export interface MessageDTO {
  id: string;
  from?: string;
  body?: string;
}

export const mapMessage = (dto: MessageDTO): Message => ({ from: dto.from, body: dto.body });

export interface MessageThreadDTO {
  id: string;
  title?: string;
  unread?: boolean;
  messages?: MessageDTO[];
}

export const mapConversation = (dto: MessageThreadDTO): Conversation => ({
  id: dto.id,
  title: dto.title,
  unread: dto.unread,
});

export const mapThread = (dto: MessageThreadDTO): Thread => ({
  messages: (dto.messages || []).map(mapMessage),
});


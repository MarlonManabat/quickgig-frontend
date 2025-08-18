export interface JobMetrics { views: number; applies: number; messages: number; updatedAt: string; }
export interface JobReport { id: string; jobId: string; reason: 'spam'|'duplicate'|'offensive'|'other'; notes?: string; createdAt: string; resolved?: boolean; }

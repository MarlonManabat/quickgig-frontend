export type AlertFreq = 'daily' | 'weekly';
export type JobAlert = {
  id: string;
  q?: string;
  loc?: string;
  cat?: string;
  sort?: string;
  size?: number;
  freq: AlertFreq;
  createdAt: number;
  muted?: boolean;
};

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  rate?: string;
  description: string;
  tags?: string[];
}

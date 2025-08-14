export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  rate: string;
  postedAt: string;
  tags?: string[];
}

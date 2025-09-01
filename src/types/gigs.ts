export type GigSort = 'new' | 'pay_high';

export interface GigsQuery {
  q?: string;
  region?: string;
  sort?: GigSort;
  page?: number;
  limit?: number;
}

export interface GigCardData {
  id: number;
  title: string;
  company: string;
  region: string | null;
  rate: number | null;
  created_at: string;
}

export interface GigsResponse {
  items: GigCardData[];
  total: number;
  page: number;
  limit: number;
}

export interface Gig {
  id: number;
  title: string;
  company: string;
  region: string | null;
  rate: number | null;
  created_at: string;
  description: string;
}

export interface GigResponse {
  gig: Gig;
}

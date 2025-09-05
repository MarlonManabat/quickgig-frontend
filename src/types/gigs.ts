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
  city_name?: string;
  province_code?: string;
}

export interface GigsResponse {
  items: GigCardData[];
  total: number;
  page: number;
  limit: number;
}

export interface GigDetail {
  id: number;
  title: string;
  company: string;
  region: string | null;
  rate: number | null;
  created_at: string;
  description: string;
}

export interface GigResponse {
  gig: GigDetail;
}

export type Gig = {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  status: 'open' | 'closed';
  created_at: string;
  user_id?: string;
  pay_min?: number;
  pay_max?: number;
  remote?: boolean;
};

export type GigInsert = Omit<Gig, 'id' | 'created_at' | 'status'> & {
  status?: Gig['status'];
};

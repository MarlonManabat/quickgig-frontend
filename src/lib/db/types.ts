export interface Gig {
  id: number;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  is_remote: boolean;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  gig_id: number;
  applicant_id: string;
  status: "applied" | "in_review" | "offered" | "hired" | "rejected";
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedGig {
  user_id: string;
  gig_id: number;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      gigs: { Row: Gig };
      applications: { Row: Application };
      saved_gigs: { Row: SavedGig };
      profiles: { Row: { id: string; full_name: string | null } };
    };
  };
};

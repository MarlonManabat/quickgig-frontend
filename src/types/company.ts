export interface CompanyProfile {
  id: string;
  name: string;
  logoUrl?: string; // S3/public URL
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  about?: string;
  updatedAt: string; // ISO
}

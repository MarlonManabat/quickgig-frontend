export type ApplicantProfile = {
  id: string;               // session user id
  name: string;
  email: string;            // from session; read-only in UI
  phone?: string;
  city?: string;
  barangay?: string;
  roles?: string[];         // preferred roles/titles
  expectedRate?: string;    // e.g., "₱800/day"
  bio?: string;
  resumeUrl?: string;       // GDrive/Dropbox link for now
  avatarUrl?: string;
  updatedAt: string;
};

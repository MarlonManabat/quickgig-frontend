export type Role = 'applicant' | 'employer' | 'admin';
export type Session = { id: string; email: string; name: string; role: Role } | null;

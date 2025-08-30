// Minimal fallback; replaced by real generated types when available.
export interface Database {
  public: {
    Tables: Record<string, { Row: any; Insert: any; Update: any }>;
    Enums: Record<string, any>;
  };
}
declare module '@/types/supabase' {
  export type { Database };
}

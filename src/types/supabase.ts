export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string | number>;
  };
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: { id: number; gig_id: number; applicant_id: string; worker_id: string | null; status: string };
        Insert: { id?: number; gig_id: number; applicant_id: string; worker_id?: string | null; status?: string };
        Update: { gig_id?: number; applicant_id?: string; worker_id?: string | null; status?: string };
      };
      ticket_balances: {
        Row: { user_id: string; balance: number };
        Insert: { user_id: string; balance: number };
        Update: { user_id?: string; balance?: number };
      };
      messages: {
        Row: { id: number; application_id: number; sender_id: string; body: string; created_at: string };
        Insert: { id?: number; application_id: number; sender_id: string; body: string };
        Update: { application_id?: number; sender_id?: string; body?: string };
      };
      notifications: {
        Row: { id: number; user_id: string; type: string; title: string; body: string; link: string | null; read: boolean };
        Insert: { id?: number; user_id: string; type: string; title: string; body: string; link?: string | null; read?: boolean };
        Update: { user_id?: string; type?: string; title?: string; body?: string; link?: string | null; read?: boolean };
      };
      gigs: {
        Row: { id: number; owner_id: string; title: string; description: string | null; price: number | null; budget?: number | null };
        Insert: { id?: number; owner_id: string; title: string; description?: string | null; price?: number | null; budget?: number | null };
        Update: { owner_id?: string; title?: string; description?: string | null; price?: number | null; budget?: number | null };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

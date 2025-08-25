import { supabase } from '@/lib/supabaseClient';

export type NewJob = {
  title: string;
  company?: string;
  is_online: boolean;
  region: string | null;
  city: string | null;
  address: string | null;
};

export async function createJob(job: NewJob) {
  const { data, error } = await supabase.from('jobs').insert(job).select().single();
  if (error) throw error;
  return data;
}

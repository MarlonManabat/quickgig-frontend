import { supabase } from "@/lib/supabaseClient";

export type NewJob = {
  title: string;
  company?: string;
  is_online: boolean;
  region: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
};

export async function createJob(job: NewJob) {
  if (!job.is_online) {
    if (!job.region || !job.province)
      throw new Error("Region and province required");
    if (!job.city && !job.address)
      throw new Error("City or address required");
  } else {
    job.region = job.province = job.city = job.address = null;
  }
  const payload = {
    title: job.title,
    company: job.company,
    is_online: job.is_online,
    location_region: job.region,
    location_province: job.province,
    location_city: job.city,
    location_address: job.address,
  };
  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

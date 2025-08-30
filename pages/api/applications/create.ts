import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSupabase } from '@/lib/supabase-server';
import type { Insert } from '@/types/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_pref")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role_pref === "employer")
    return res.status(403).json({ error: { code: "FORBIDDEN" } });

  const { jobId, message, expectedRate } = req.body || {};
  const fieldErrors: Record<string, string> = {};
  if (typeof message !== 'string' || message.trim().length < 20)
    fieldErrors.message = 'Message too short';
  const rateNum = Number(expectedRate);
  if (!rateNum || rateNum <= 0)
    fieldErrors.expectedRate = 'Expected rate must be > 0';
  if (!jobId || typeof jobId !== 'string') fieldErrors.jobId = 'Job required';
  if (Object.keys(fieldErrors).length)
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_FAILED', fields: fieldErrors } });

  const { data: job } = await supabase
    .from('jobs')
    .select('id,is_closed')
    .eq('id', jobId)
    .maybeSingle();
  if (!job || job.is_closed)
    return res.status(400).json({ error: { code: 'JOB_CLOSED' } });

  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('worker_id', user.id)
    .maybeSingle();
  if (existing)
    return res.status(400).json({ error: { code: 'DUPLICATE_APPLICATION' } });

  const { data, error } = await supabase
    .from('applications')
    .insert([
      {
        job_id: jobId,
        worker_id: user.id,
        message: message.trim(),
        expected_rate: rateNum,
      } satisfies Insert<'applications'>,
    ])
    .select('id')
    .single();
  if (error)
    return res.status(400).json({ error: { code: 'DB_ERROR', message: error.message } });

  res.status(201).json({ id: data.id });
}

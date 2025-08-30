import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/credits-server';

const QuerySchema = z.object({
  applicationId: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED' } });
  }

  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'BAD_REQUEST', issues: parsed.error.issues } });
  }

  const { applicationId } = parsed.data;
  const supabase = await getServerSupabase();
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user) return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });
  const me = auth.user.id;

  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, worker_id, job_id')
    .eq('id', applicationId)
    .single<{ id: string; worker_id: string; job_id: string }>();
  if (appErr || !app) return res.status(404).json({ error: { code: 'APPLICATION_NOT_FOUND' } });

  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .select('id, employer_id')
    .eq('id', app.job_id)
    .single<{ id: string; employer_id: string }>();
  if (jobErr || !job) return res.status(404).json({ error: { code: 'JOB_NOT_FOUND' } });

  if (app.worker_id !== me && job.employer_id !== me) {
    return res.status(403).json({ error: { code: 'FORBIDDEN' } });
  }

  const { data: messages, error: msgErr } = await supabase
    .from('messages')
    .select('id, sender_id, body, created_at')
    .eq('application_id', app.id)
    .order('created_at', { ascending: true });
  if (msgErr) return res.status(500).json({ error: { code: 'MESSAGE_HISTORY_FAILED' } });

  return res.status(200).json({ messages });
}

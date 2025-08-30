import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/credits-server';
import type { Insert } from '@/types/db';

const BodySchema = z.object({
  applicationId: z.string().min(1),
  body: z.string().min(1).max(4000),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED' } });
  }

  const parsed = BodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'BAD_REQUEST', issues: parsed.error.issues } });
  }

  const { applicationId, body } = parsed.data;

  const supabase = await getServerSupabase();
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user) return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });
  const me = auth.user.id;

  // Fetch application
  type AppRow = { id: string; job_id: string; worker_id: string };
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, job_id, worker_id')
    .eq('id', applicationId)
    .single<AppRow>();
  if (appErr || !app) return res.status(404).json({ error: { code: 'APPLICATION_NOT_FOUND' } });

  // Fetch job (employer)
  type JobRow = { id: string; employer_id: string };
  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .select('id, employer_id')
    .eq('id', app.job_id)
    .single<JobRow>();
  if (jobErr || !job) return res.status(404).json({ error: { code: 'JOB_NOT_FOUND' } });

  // Determine counterparty
  const other = app.worker_id === me ? job.employer_id : app.worker_id;

  // Insert message
  const { data: msg, error: msgErr } = await supabase
    .from('messages')
    .insert([
      { application_id: app.id, sender_id: me, body } satisfies Insert<'messages'>,
    ])
    .select('id')
    .single();
  if (msgErr || !msg) return res.status(500).json({ error: { code: 'MESSAGE_CREATE_FAILED' } });

  // Best-effort notification
  await supabase
    .from('notifications')
    .insert([
      {
        user_id: other,
        type: 'message_new',
        data: { applicationId: app.id, messageId: msg.id },
      } satisfies Insert<'notifications'>,
    ]);

  return res.status(201).json({ id: msg.id });
}

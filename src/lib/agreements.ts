import 'server-only';

import supabaseServer, { adminSupabase } from '@/lib/supabase/server';
import { getApplicationById } from '@/lib/applications/server';

export type AgreementRole = 'employer' | 'worker';

function computeAgreementTotal(app: any): number {
  const price = (app && (app.price_php ?? app.price)) || 0;
  return Number(price) || 0;
}

export async function createAgreementFromApplication(
  appId: string,
  actorId: string,
): Promise<string> {
  const app = await getApplicationById(appId);
  if (!app) throw new Error('Application not found');
  const amount = computeAgreementTotal(app);
  const supa = await adminSupabase();
  if (!supa) {
    return `mock-agreement-${appId}`;
  }
  const { data, error } = await supa
    .from('agreements')
    .insert(
      {
        application_id: app.id,
        gig_id: app.gig_id ?? app.gigId ?? null,
        employer_id: app.employer_id ?? actorId,
        worker_id: app.candidate_id ?? app.worker_id ?? app.candidateId ?? null,
        amount,
        status: 'pending',
      },
    )
    .select('id')
    .single();
  if (error || !data) throw error || new Error('Failed to create agreement');
  return data.id as string;
}

export async function assertUserCanConfirmAgreement(
  agreementId: string,
  userId: string,
) {
  const supa = supabaseServer();
  if (!supa) throw new Error('Server not configured');

  const { data, error } = await supa
    .from('agreements')
    .select(
      'id, employer_id, worker_id, status, employer_confirmed_at, worker_confirmed_at, reached_at'
    )
    .eq('id', agreementId)
    .single();

  if (error || !data) throw new Error('Agreement not found');

  let role: AgreementRole | null = null;
  if (data.employer_id === userId) role = 'employer';
  else if (data.worker_id === userId) role = 'worker';
  if (!role) throw new Error('Forbidden');

  const already =
    role === 'employer'
      ? data.employer_confirmed_at != null
      : data.worker_confirmed_at != null;

  return { agreement: data, role, already } as const;
}

export async function confirmAgreementSide(
  agreementId: string,
  role: AgreementRole,
) {
  const supa = supabaseServer();
  if (!supa) throw new Error('Server not configured');

  const field = role === 'employer' ? 'employer_confirmed_at' : 'worker_confirmed_at';
  const other = role === 'employer' ? 'worker_confirmed_at' : 'employer_confirmed_at';

  const now = new Date().toISOString();

  const { data, error } = await supa
    .from('agreements')
    .update({ [field]: now } as any)
    .eq('id', agreementId)
    .is(field, null)
    .select('id, status, employer_confirmed_at, worker_confirmed_at, reached_at, employer_id, worker_id')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to confirm');

  if (data[field] && data[other] && data.status !== 'reached') {
    const { data: reached, error: err2 } = await supa
      .from('agreements')
      .update({ status: 'reached', reached_at: now } as any)
      .eq('id', agreementId)
      .select('id, status, employer_confirmed_at, worker_confirmed_at, reached_at, employer_id, worker_id')
      .single();
    if (err2) throw new Error(err2.message);
    return reached;
  }

  return data;
}


import 'server-only';

import { getServerSupabase } from '@/lib/supabase';

export async function createAgreementFromApplication(applicationId: string, employerId: string) {
  const db = getServerSupabase();

  const { data: app, error: appErr } = await db
    .from('applications')
    .select('id, employer_id, seeker_id, quoted_amount')
    .eq('id', applicationId)
    .eq('employer_id', employerId)
    .maybeSingle();

  if (appErr) return { error: appErr.message } as const;
  if (!app) return { error: 'application_not_found_or_forbidden' } as const;

  const { data, error: insErr } = await db
    .from('agreements')
    .insert({
      application_id: app.id,
      employer_id: employerId,
      seeker_id: app.seeker_id,
      amount: app.quoted_amount ?? 0,
      status: 'pending',
    })
    .select('id')
    .maybeSingle();

  if (insErr) return { error: insErr.message } as const;
  return { id: data?.id } as const;
}

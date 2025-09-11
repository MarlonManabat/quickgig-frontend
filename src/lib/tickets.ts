import { getServerSupabase, getAdminClient } from './supabase';

const FREE_STARTER = Number(process.env.FREE_TICKETS_ON_FIRST_LOGIN ?? 3) || 0;

function serverSupabase() {
  return getServerSupabase();
}

export async function ensureTicketsRow(userId: string): Promise<void> {
  const supa = await getAdminClient();

  try {
    // @ts-ignore: rpc name may not be in typed client
    await supa.rpc('ensure_tickets_row', { p_user: userId, p_init: FREE_STARTER });
    return;
  } catch (_) {
    // ignore and try upsert
  }

  // @ts-ignore
  await supa
    .from('user_tickets')
    .upsert(
      { user_id: userId, balance: FREE_STARTER },
      { onConflict: 'user_id', ignoreDuplicates: true },
    );
}

export async function getTicketBalance(userId?: string): Promise<number> {
  if (userId) {
    const supa = await getAdminClient();
    const { data, error } = await supa.rpc('ticket_balance', {
      p_user: userId,
    });
    if (error) throw error;
    return (data as number) ?? 0;
  }
  const supa = serverSupabase();
  const { data, error } = await supa.rpc('ticket_balance');
  if (error) throw error;
  return (data as number) ?? 0;
}

export async function ensureTickets(
  userId: string,
  needed = 1,
): Promise<boolean> {
  const bal = await getTicketBalance(userId);
  return bal >= needed;
}

type CreateGigArgs = {
  title: string;
  description: string;
  region_code?: string;
  city_code?: string;
  price_php?: number;
};

export async function deductTicketOnCreate(
  userId: string,
  info: CreateGigArgs,
): Promise<string> {
  const supa = await getAdminClient();

  const { data, error } = await supa
    .rpc('rpc_debit_tickets_and_create_gig', {
      p_title: info.title,
      p_description: info.description,
      p_region_code: info.region_code ?? null,
      p_city_code: info.city_code ?? null,
      p_price_php: info.price_php ?? null,
      p_user_id: userId,
    })
    .single();

  if (error) throw new Error(error.message);
  return String(data);
}

export async function ensureSignupBonus(): Promise<number> {
  const supa = serverSupabase();
  const { data, error } = await supa.rpc('award_signup_bonus');
  if (error) throw error;
  return (data as number) ?? 0;
}

export async function spendOneTicket(
  reason = 'spend',
  meta: Record<string, unknown> = {},
): Promise<number> {
  const supa = serverSupabase();
  const { data, error } = await supa.rpc('spend_one_ticket', {
    p_reason: reason,
    p_meta: meta,
  });
  if (error) throw error;
  return (data as number) ?? 0;
}


export async function debitTickets(
  employerId: string,
  agreementId: string,
  amount: number,
) {
  const admin = await getAdminClient();
  const { error } = await admin.rpc('tickets_debit', {
    employer_id: employerId,
    agreement_id: agreementId,
    amount,
  });
  if (error) throw new Error(`tickets_debit failed: ${error.message}`);
}


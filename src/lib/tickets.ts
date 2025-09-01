import { adminSupabase } from './supabase/server';

const FREE_STARTER = Number(process.env.FREE_TICKETS_ON_FIRST_LOGIN ?? 3) || 0;

export async function ensureTicketsRow(userId: string): Promise<void> {
  const supa = await adminSupabase();
  if (!supa) return;

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

export async function getTicketBalance(userId: string): Promise<number> {
  const supa = await adminSupabase();
  if (!supa) return 0;
  const { data, error } = await supa
    .from('user_tickets')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return 0;
  return data?.balance ?? 0;
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
  const supa = await adminSupabase();
  if (!supa) throw new Error('Server not configured');

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


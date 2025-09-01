import { adminSupabase } from './supabase/server';

export async function getTicketBalance(userId: string): Promise<number> {
  const supa = await adminSupabase();
  if (!supa) return 0;
  const { data } = await supa
    .from('profiles')
    .select('tickets')
    .eq('id', userId)
    .single();
  return Number(data?.tickets) || 0;
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


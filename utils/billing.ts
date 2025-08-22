import { supabase } from '@/utils/supabaseClient';

export async function hasApprovedOrder(userId: string) {
  if (!process.env.NEXT_PUBLIC_REQUIRE_PAYMENT || process.env.NEXT_PUBLIC_REQUIRE_PAYMENT !== 'true') return true;
  const { data, error } = await supabase
    .from('orders')
    .select('id,status')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .limit(1);
  if (error) { console.error(error); return false; }
  return !!(data && data.length);
}

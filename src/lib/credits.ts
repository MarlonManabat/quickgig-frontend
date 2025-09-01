import { supabaseBrowser } from '@/lib/supabase/browser';

export async function getCredits() {
  const supabase = supabaseBrowser;
  const { data } = await supabase.from('user_credits').select('credits').single();
  return data?.credits ?? 0;
}

export async function consumeOneCredit() {
  const supabase = supabaseBrowser;
  const { data, error } = await supabase.rpc('decrement_credit');
  if (error) throw error;
  return data as number;
}

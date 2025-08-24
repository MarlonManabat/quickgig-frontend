import { supabase } from '@/lib/supabaseClient';
import { calcExpectedTickets } from '@/lib/payments';

export async function submitReceipt({
  amountPhp,
  gcashRef,
}: {
  amountPhp: number;
  gcashRef: string;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const expected = calcExpectedTickets(amountPhp);
  if (expected <= 0) throw new Error('Amount too low');

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    amount_php: amountPhp,
    expected_tickets: expected,
    gcash_reference: gcashRef,
    status: 'pending',
  });
  if (error) throw error;
}


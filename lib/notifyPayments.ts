import { sendTemplate } from '@/lib/email';
import { supabase } from '@/lib/supabaseClient';

export async function notifyPaymentApproved(paymentId: string) {
  const { data: p } = await supabase
    .from('payments')
    .select('id,user_id,expected_tickets')
    .eq('id', paymentId)
    .single();
  const { data: u } = await supabase.auth.admin.getUserById(p.user_id);
  await sendTemplate(u.user?.email!, 'payment-approved', {
    tickets: p.expected_tickets,
  });
}

export async function notifyPaymentRejected(paymentId: string, reason: string) {
  const { data: p } = await supabase
    .from('payments')
    .select('id,user_id')
    .eq('id', paymentId)
    .single();
  const { data: u } = await supabase.auth.admin.getUserById(p.user_id);
  await sendTemplate(u.user?.email!, 'payment-rejected', { reason });
}


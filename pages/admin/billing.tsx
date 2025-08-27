import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProofCard from '@/components/billing/ProofCard';
import { withAdminGuard } from '@/components/guards/withAdminGuard';
import toast from '@/utils/toast';

type Status = 'pending' | 'approved' | 'rejected';

function AdminBillingPage() {
  const supabase = createClientComponentClient();
  const [status, setStatus] = useState<Status>('pending');
  const [proofs, setProofs] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase
      .from('payment_proofs')
      .select('*, profiles:profiles(email)')
      .eq('status', status)
      .order('created_at', { ascending: false });
    setProofs(data || []);
  }

  useEffect(() => {
    load();
  }, [status]);

  async function approve(p: any) {
    const { error: gErr } = await supabase.rpc('grant_credits', {
      p_user: p.user_id,
      p_delta: p.credits,
    });
    if (gErr) {
      toast.error('Failed to grant credits');
      return;
    }
    const { error } = await supabase
      .from('payment_proofs')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', p.id);
    if (error) toast.error('Update failed');
    else toast.success('Approved');
    load();
  }

  async function reject(p: any) {
    const { error } = await supabase
      .from('payment_proofs')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', p.id);
    if (error) toast.error('Update failed');
    else toast.success('Rejected');
    load();
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manual GCash Proofs</h1>
      <div className="flex gap-4">
        {(['pending', 'approved', 'rejected'] as Status[]).map((s) => (
          <button
            key={s}
            className={`underline ${s === status ? 'font-bold' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {proofs.map((p) => (
        <ProofCard key={p.id} proof={{ ...p, user_email: p.profiles?.email }}>
          {status === 'pending' && (
            <div className="flex gap-2">
              <button
                className="qg-btn qg-btn--primary"
                onClick={() => approve(p)}
              >
                Approve
              </button>
              <button
                className="qg-btn qg-btn--white"
                onClick={() => reject(p)}
              >
                Reject
              </button>
            </div>
          )}
        </ProofCard>
      ))}
      {proofs.length === 0 && <p>No proofs.</p>}
    </main>
  );
}

export default withAdminGuard(AdminBillingPage);

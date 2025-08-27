import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProofCard from '@/components/billing/ProofCard';

export default function BillingHistory() {
  const supabase = createClientComponentClient();
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });
      setProofs(data || []);
    })();
  }, [supabase]);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Payment History</h1>
      {proofs.length === 0 && <p>No proofs yet.</p>}
      {proofs.map((p) => (
        <ProofCard key={p.id} proof={p} />
      ))}
    </main>
  );
}

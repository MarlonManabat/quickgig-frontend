'use client';
import { useState } from 'react';

async function cancelAgreement(id: string) {
  const r = await fetch(`/api/agreements/${id}/cancel`, { method: 'POST' });
  const j = await r.json();
  if (!r.ok || !j?.ok) throw new Error(j?.error ?? 'cancel_failed');
  return j;
}

export function CancelAgreementButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn-outline"
      disabled={busy}
      onClick={async () => {
        if (!confirm('Cancel this agreement? 1 ticket will be returned to each party.')) return;
        setBusy(true);
        try {
          await cancelAgreement(id);
          alert('Agreement cancelled. Tickets refunded to both parties.');
          location.reload();
        } catch (e: any) {
          alert(e?.message ?? 'Unable to cancel');
        } finally {
          setBusy(false);
        }
      }}
    >
      Cancel agreement
    </button>
  );
}

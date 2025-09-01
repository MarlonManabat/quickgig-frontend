'use client';

import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import PaymentProofModal from '@/components/PaymentProofModal';
import { TICKET_PRICE_PHP } from '@/lib/payments';

type Props = {
  initialBalance: number;
  next: string | null;
};

export default function TicketsClient({ initialBalance, next }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!polling) return;
    let tries = 0;
    const id = setInterval(async () => {
      tries++;
      try {
        const r = await fetch('/api/billing/balance', { cache: 'no-store' });
        if (r.ok) {
          const { balance } = await r.json();
          setBalance(balance);
          if (balance >= 1) {
            toast.success('Tickets credited!');
            if (next) location.replace(next);
            else location.replace('/gigs/create');
          }
        }
      } catch {}
      if (tries > 22) {
        clearInterval(id);
        setPolling(false);
        toast.info('Still pending approval. We’ll credit your ticket once verified.');
      }
    }, 8000);
    return () => clearInterval(id);
  }, [polling, next]);

  function handleProofSubmitted() {
    toast.success('Proof submitted. Waiting for admin approval…');
    setPolling(true);
  }

  return (
    <div className="space-y-4">
      {initialBalance >= 1 && (
        <div className="rounded-lg border p-3 bg-green-50">
          You’ve received {initialBalance} free starter {initialBalance === 1 ? 'ticket' : 'tickets'} 🎉
        </div>
      )}
      <div className="rounded-lg border p-3">
        <div className="text-sm opacity-70">Current tickets</div>
        <div className="text-3xl font-semibold">{balance}</div>
      </div>

      <button
        className="rounded-xl border px-4 py-2"
        onClick={() => setOpen(true)}
        disabled={uploading}
      >
        Upload GCash proof
      </button>

      <PaymentProofModal
        open={open}
        onClose={() => setOpen(false)}
        pricePHP={TICKET_PRICE_PHP}
        credits={1}
        next={next || undefined}
        onStart={() => setUploading(true)}
        onDone={() => { setUploading(false); handleProofSubmitted(); }}
        onError={() => { setUploading(false); toast.error('Upload failed. Please try again.'); }}
      />

      {!polling && (
        <p className="text-sm opacity-70">
          After you upload your GCash receipt, we’ll automatically credit your ticket once approved.
        </p>
      )}

      {polling && (
        <p className="text-sm">
          Waiting for approval… we’ll check every few seconds. You can leave this page.
        </p>
      )}
    </div>
  );
}

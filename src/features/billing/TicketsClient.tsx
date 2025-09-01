'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentProofModal from '@/components/PaymentProofModal';
import { TICKET_PRICE_PHP } from '@/lib/payments';

type Props = { balance: number; next?: string | null };

export default function TicketsClient({ balance, next }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [bal, setBal] = useState(balance);
  const router = useRouter();

  useEffect(() => {
    if (!pending) return;
    const id = setInterval(async () => {
      const res = await fetch('/api/billing/status');
      if (res.ok) {
        const j = await res.json();
        const t = j.tickets ?? 0;
        setBal(t);
        if (t > balance) {
          router.replace(next || '/gigs/create');
        }
      }
    }, 5000);
    return () => clearInterval(id);
  }, [pending, next, balance, router]);

  return (
    <div className="space-y-4">
      <p>Current ticket balance: {bal}</p>
      <button
        className="rounded-xl border px-4 py-2"
        onClick={() => setOpen(true)}
      >
        Buy Ticket
      </button>
      {pending && <p>Pending admin approval…</p>}
      <PaymentProofModal
        open={open}
        onClose={() => {
          setOpen(false);
          setPending(true);
        }}
        pricePHP={TICKET_PRICE_PHP}
        credits={1}
        next={next || undefined}
      />
      {next && <input type="hidden" name="next" value={next} />}
    </div>
  );
}


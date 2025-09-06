'use client';

import { ReactNode, useState, useEffect } from 'react';

export function RequireTickets({ need = 1, children }: { need?: number; children: (ok: boolean, spend: () => Promise<boolean>) => ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/tickets/balance', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setBalance(Number(j?.balance ?? 0)))
      .catch(() => setBalance(0));
  }, []);

  async function spend() {
    setBusy(true);
    try {
      const r = await fetch('/api/tickets/spend', { method: 'POST', body: JSON.stringify({ amount: need, reason: 'action' }) });
      if (!r.ok) return false;
      const j = await r.json();
      setBalance(Number(j?.balance ?? 0));
      return true;
    } finally {
      setBusy(false);
    }
  }

  const ok = (balance ?? 0) >= need && !busy;
  return <>{children(ok, spend)}</>;
}

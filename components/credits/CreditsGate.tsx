'use client';
import Link from 'next/link';
import { useState } from 'react';
import { PRICE_PER_CREDIT } from '@/config/billing';

export default function CreditsGate() {
  const [loading] = useState(false);
  return (
    <div className="rounded-xl border p-4 bg-slate-50 dark:bg-slate-900">
      <p className="mb-2">
        You’re out of posting credits. Buy more to continue.
      </p>
      <p className="text-sm opacity-80 mb-4">
        Current price: ₱{PRICE_PER_CREDIT} / credit
      </p>
      <div className="flex gap-3">
        <Link
          data-testid="buy-credits"
          href="/billing/manual-gcash"
          className="px-3 py-2 rounded-lg border shadow-sm"
        >
          Buy credits (GCash)
        </Link>
        <Link
          href="/support"
          className="px-3 py-2 rounded-lg border"
        >
          Contact support
        </Link>
      </div>
      {loading && <div className="mt-3 text-sm">Checking account…</div>}
    </div>
  );
}


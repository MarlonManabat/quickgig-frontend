"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCredits } from '@/lib/credits';

export default function CreditsGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const c = await getCredits();
      setAllowed(c > 0);
    })();
  }, []);

  if (allowed === null) return null;
  if (!allowed) {
    return (
      <div className="text-center space-y-4 mt-8">
        <h1 className="text-xl font-bold">You have 0 credits</h1>
        <div className="flex flex-col gap-2 items-center">
          <Link href="/billing/manual-gcash" className="qg-btn qg-btn--primary">
            Buy credits (GCash)
          </Link>
          <Link href="/support" className="underline">
            Contact support
          </Link>
          <Link href="/" className="underline">
            Back
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

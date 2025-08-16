export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import LegacyShell from '@/app/(marketing)/LegacyShell';
import { verifyLegacyAssets } from '@/lib/legacyFragments';

export default function Page() {
  const legacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  const strict = process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL === 'true';

  if (legacy) {
    const missing = verifyLegacyAssets();
    if (!missing.length) {
      return <LegacyShell fragment="index" />;
    }
    if (strict) {
      // eslint-disable-next-line no-console
      console.error('[legacy] missing assets:', missing.join(', '));
      return (
        <div className="p-4 text-red-600">
          Missing legacy assets: {missing.join(', ')}
        </div>
      );
    }
  }

  // Fallback: existing React home (keep your current implementation below)
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold">QuickGig</h1>
        <p className="mt-4 text-lg">Gigs and talent, matched fast.</p>
      </div>
    </main>
  );
}

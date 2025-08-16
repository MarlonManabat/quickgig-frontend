export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { loadLegacyFragment } from '@/lib/legacy/fragment';

export default async function Page() {
  const useLegacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  if (useLegacy) {
    const html = await loadLegacyFragment('home');
    if (html) {
      return <main dangerouslySetInnerHTML={{ __html: html }} />;
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

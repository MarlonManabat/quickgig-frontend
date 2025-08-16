export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { loadFragment, injectLegacyStyles } from '@/lib/legacyFragments';

export default function Page() {
  const legacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  const strict = process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL === 'true';

  if (legacy && strict) {
    const header = loadFragment('header');
    const main = loadFragment('index');
    const footer = loadFragment('footer');
    const html = injectLegacyStyles(`${header}${main}${footer}`);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (legacy) {
    const main = loadFragment('index');
    const html = injectLegacyStyles(main);
    return <main dangerouslySetInnerHTML={{ __html: html }} />;
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

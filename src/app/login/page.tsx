export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { loadLegacyFragment } from '@/lib/legacy/fragment';

export default async function LoginPage() {
  const useLegacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  if (useLegacy) {
    const html = await loadLegacyFragment('login');
    if (html) {
      return <main dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
  // Fallback: keep existing client login component, but ensure same-origin POST
  return (
    <main>
      <form method="POST" action="/api/session/login" className="mx-auto mt-12 max-w-md space-y-4 p-6">
        <input name="email" type="email" required className="w-full rounded border p-2" placeholder="Email" />
        <input name="password" type="password" required className="w-full rounded border p-2" placeholder="Password" />
        <button className="w-full rounded bg-yellow-400 p-2 font-semibold">Login</button>
      </form>
    </main>
  );
}

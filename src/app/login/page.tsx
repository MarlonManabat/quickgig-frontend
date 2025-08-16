export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import LegacyShell from '@/app/(marketing)/LegacyShell';
import { verifyLegacyAssets } from '@/lib/legacyFragments';
import './legacy-login.css';

interface Props {
  searchParams?: { next?: string };
}

export default function LoginPage({ searchParams }: Props) {
  const legacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  const strict = process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL === 'true';
  const nextUrl = typeof searchParams?.next === 'string' ? searchParams.next : undefined;

  if (legacy) {
    const missing = verifyLegacyAssets();
    if (!missing.length) {
      return <LegacyShell fragment="login" nextUrl={nextUrl} />;
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

  return <div className="p-4">Login</div>;
}

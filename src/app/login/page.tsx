export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { loadFragment, injectLegacyStyles } from '@/lib/legacyFragments';
import LegacyLogin from './LegacyLogin';
import './legacy-login.css';

interface Props {
  searchParams?: { next?: string };
}

export default function LoginPage({ searchParams }: Props) {
  const legacy = process.env.NEXT_PUBLIC_LEGACY_UI === 'true';
  const strict = process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL === 'true';
  const nextUrl = typeof searchParams?.next === 'string' ? searchParams.next : undefined;

  if (legacy) {
    const header = strict ? loadFragment('header') : '';
    const footer = strict ? loadFragment('footer') : '';
    const main = loadFragment('login');
    const html = injectLegacyStyles(`${header}${main}${footer}`);
    return <LegacyLogin html={html} nextUrl={nextUrl} />;
  }

  return <div className="p-4">Login</div>;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { renderFragment } from '@/lib/legacy/renderFragment';
import LegacyLogin from './LegacyLogin';
import './legacy-login.css';

interface Props {
  searchParams?: { next?: string };
}

export default async function LoginPage({ searchParams }: Props) {
  const html = await renderFragment('login');
  const nextUrl = typeof searchParams?.next === 'string' ? searchParams.next : undefined;
  return <LegacyLogin html={html} nextUrl={nextUrl} />;
}

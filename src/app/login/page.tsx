export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { renderFragment } from '@/lib/legacy/renderFragment';
import LegacyLogin from './LegacyLogin';
import './legacy-login.css';

export default async function LoginPage() {
  const html = await renderFragment('login');
  return <LegacyLogin html={html} />;
}

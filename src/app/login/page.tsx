export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import { legacyUI } from '@/lib/flags';
import { renderLegacyLogin } from '@/lib/legacy/renderLegacy';

export default async function LoginPage() {
  if (legacyUI) {
    const html = await renderLegacyLogin();
    return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <div className="p-4">Login</div>;
}

'use client';

import { notFound } from 'next/navigation';
import { env } from '@/config/env';
import { apiOrigin, engineMode, cookieStrategy } from '@/lib/flags';

export default function EnvDebugPage() {
  if (!env.NEXT_PUBLIC_ENABLE_SETTINGS) notFound();
  return (
    <div className="qg-container py-6 space-y-2">
      <h1 className="text-xl font-bold mb-4">Env Debug</h1>
      <p>API origin: {apiOrigin}</p>
      <p>Engine mode: {engineMode}</p>
      <p>Cookie strategy: {cookieStrategy}</p>
    </div>
  );
}

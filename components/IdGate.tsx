'use client';
import * as React from 'react';
import { useRouter } from 'next/router';

export default function IdGate({ id, fallback = null, redirect = '/applications', children }: { id?: string | string[]; fallback?: React.ReactNode; redirect?: string; children: React.ReactNode; }) {
  const router = useRouter();
  React.useEffect(() => {
    if (!id || (Array.isArray(id) && !id[0])) {
      // eslint-disable-next-line no-console
      console.error(`Missing id param, redirecting to ${redirect}`);
      router.replace(redirect);
    }
  }, [id, redirect, router]);
  if (!id || (Array.isArray(id) && !id[0])) return <>{fallback}</>;
  return <>{children}</>;
}

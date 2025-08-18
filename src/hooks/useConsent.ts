import { useEffect, useState } from 'react';
import { env } from '@/config/env';

export function useConsent() {
  const [granted, setGranted] = useState(!env.NEXT_PUBLIC_ENABLE_CONSENT);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_CONSENT) return;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('consent') === 'granted' : false;
    setGranted(stored);
  }, []);

  const grant = () => {
    if (!env.NEXT_PUBLIC_ENABLE_CONSENT) return;
    setGranted(true);
    if (typeof window !== 'undefined') window.localStorage.setItem('consent', 'granted');
  };

  return { granted, grant };
}

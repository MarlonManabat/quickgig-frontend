'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    const run = async () => {
      try {
        await createClient().auth.signOut();
      } catch {}
      // Let server clear cookies, then land home.
      window.location.replace('/api/logout?next=/');
    };
    run();
  }, [router]);
  return <p style={{ padding: '2rem' }}>Signing you out…</p>;
}

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const router = useRouter();
  createClientComponentClient();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next =
      params.get('next') || process.env.NEXT_PUBLIC_DEFAULT_REDIRECT || '/start';
    const id = setTimeout(() => router.replace(next), 150);
    return () => clearTimeout(id);
  }, [router]);
  return null;
}

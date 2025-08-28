"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getSupabaseBrowser } from '@/lib/supabase.client';

const Editor = dynamic(() => import('@/components/gigs/Editor'), { ssr: false });

export default function GigEditPage() {
  const [gig, setGig] = useState<any>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return; // on CI build or missing envs, no-op
    (async () => {
      const id = new URL(window.location.href).pathname.split('/').at(-2);
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setGig(data);
    })();
  }, []);

  return <Editor gig={gig} />;
}

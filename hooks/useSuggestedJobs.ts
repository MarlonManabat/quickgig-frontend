import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type JobCard = { id: number | string; title: string; city?: string | null; budget?: number | null };

export function useSuggestedJobs(city?: string | null) {
  const [jobs, setJobs] = useState<JobCard[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from('gigs')
        .select('id,title,city,budget,published,created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(12);
      if (city) {
        const { data: cityRows, error: cityErr } = await q.in('city', [city, 'Online']).limit(6);
        if (!cityErr && cityRows && cityRows.length > 0) {
          if (!cancelled) {
            setJobs(cityRows as any);
            setLoading(false);
          }
          return;
        }
      }
      const { data, error } = await q.limit(6);
      if (!cancelled) {
        setJobs(!error && data ? (data as any) : []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  return { jobs, loading };
}

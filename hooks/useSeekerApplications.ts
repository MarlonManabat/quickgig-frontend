import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Application = {
  id: string;
  status?: string;
  job_id?: string;
  gig_id?: string;
  job_title?: string;
  gig_title?: string;
};

export function useSeekerApplications(userId?: string) {
  const [apps, setApps] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const candidates = [
        { table: 'applications', userCol: 'user_id', jobCol: 'job_id', titleJoin: { table: 'jobs', titleCol: 'title', idCol: 'id', mapTo: 'job_title' } },
        { table: 'applications', userCol: 'user_id', jobCol: 'gig_id', titleJoin: { table: 'gigs', titleCol: 'title', idCol: 'id', mapTo: 'gig_title' } },
        { table: 'applicants',   userCol: 'user_id', jobCol: 'gig_id', titleJoin: { table: 'gigs', titleCol: 'title', idCol: 'id', mapTo: 'gig_title' } },
      ];

      for (const c of candidates) {
        const { data, error } = await supabase
          .from(c.table)
          .select(`id,status,${c.userCol},${c.jobCol}`)
          .eq(c.userCol, userId)
          .limit(20);

        if (!error && data) {
          const rows: Application[] = [];
          for (const r of data as any[]) {
            const app: Application = { id: r.id, status: r.status, [c.jobCol]: r[c.jobCol] };
            if (r[c.jobCol] && c.titleJoin) {
              const { data: t } = await supabase
                .from(c.titleJoin.table)
                .select(`${c.titleJoin.titleCol}`)
                .eq(c.titleJoin.idCol as any, r[c.jobCol])
                .maybeSingle();
              if (t?.[c.titleJoin.titleCol]) (app as any)[c.titleJoin.mapTo] = t[c.titleJoin.titleCol];
            }
            rows.push(app);
          }
          if (!cancelled) {
            setApps(rows);
            setLoading(false);
          }
          return;
        }
      }

      if (!cancelled) {
        setApps([]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { apps, loading };
}

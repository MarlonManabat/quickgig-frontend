'use client';
import { useEffect } from 'react';
import { track } from '@/lib/track';
import { env } from '@/config/env';

export default function TrackView({ id, isEmployer }: { id: string | number; isEmployer?: boolean }) {
  useEffect(() => {
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('view_job', { id });
    if (env.NEXT_PUBLIC_ENABLE_JOB_VIEWS && !isEmployer) {
      const key = `v_j_${id}`;
      const has = document.cookie.includes(`${key}=1`);
      if (!has) {
        fetch(`/api/jobs/${id}/metrics/views`, { method: 'POST' }).catch(() => {});
        const maxAge = 60 * 60 * 24;
        document.cookie = `${key}=1; path=/; max-age=${maxAge}`;
      }
    }
  }, [id, isEmployer]);
  return null;
}

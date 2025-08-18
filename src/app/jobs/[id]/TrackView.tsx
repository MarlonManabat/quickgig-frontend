'use client';
import { useEffect } from 'react';
import { track } from '@/lib/track';
import { env } from '@/config/env';

export default function TrackView({ id }: { id: string | number }) {
  useEffect(() => {
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('view_job', { id });
  }, [id]);
  return null;
}

'use client';
import { useEffect } from 'react';
import { initMonitoring } from '@/lib/monitoring';

export default function ClientBootstrap() {
  useEffect(() => {
    initMonitoring();
  }, []);

  return null;
}

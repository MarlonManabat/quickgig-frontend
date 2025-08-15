'use client';
import { useEffect, useRef } from 'react';

export function usePolling(fn: () => void, ms: number, { enabled = true } = {}) {
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      saved.current();
    }, ms);
    return () => clearInterval(interval);
  }, [enabled, ms]);
}

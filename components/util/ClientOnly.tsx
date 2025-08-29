'use client';
import { useEffect, useState, type ReactNode } from 'react';
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? <>{children}</> : null;
}

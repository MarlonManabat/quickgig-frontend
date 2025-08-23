'use client';
import { ReactNode } from 'react';

export default function FieldRow({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

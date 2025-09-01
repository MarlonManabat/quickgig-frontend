'use client';

export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200/60 ${className}`.trim()} />;
}

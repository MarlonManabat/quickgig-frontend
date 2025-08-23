import * as React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="p-4 rounded-2xl shadow-soft bg-surface-raised text-center">
      <p className="text-sm text-brand-muted">{title}</p>
      <p className="text-2xl font-bold text-brand-foreground">{value}</p>
    </div>
  );
}

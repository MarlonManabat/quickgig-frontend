import React from 'react';

export default function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-surface-raised rounded-2xl shadow-soft border border-brand-border ${className}`.trim()}
      {...props}
    />
  );
}

import React from 'react';

interface EmptyProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function Empty({ title, subtitle, action, className = '' }: EmptyProps) {
  return (
    <div className={`text-center space-y-2 ${className}`.trim()}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-brand-subtle">{subtitle}</p>}
      {action}
    </div>
  );
}

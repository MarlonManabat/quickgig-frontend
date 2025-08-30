import * as React from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      <p className="text-lg font-medium mb-2">{title}</p>
      {message && <p className="text-brand-muted mb-4">{message}</p>}
      {action}
    </div>
  );
}

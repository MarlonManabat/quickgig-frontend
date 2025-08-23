'use client';
import { ReactNode } from 'react';

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export default function FormShell({ title, description, children }: Props) {
  return (
    <main className="mx-auto w-full max-w-[700px] px-4 sm:px-0">
      {title && <h1 className="text-2xl font-semibold mb-2">{title}</h1>}
      {description && <p className="mb-4 text-brand-subtle text-sm">{description}</p>}
      <div className="grid gap-4">{children}</div>
    </main>
  );
}

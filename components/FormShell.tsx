'use client';
import { ReactNode } from 'react';

export default function FormShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <main className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl">
        {title && <h1 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h1>}
        <div className="rounded-2xl border p-6 md:p-8 shadow-sm bg-white">
          {children}
        </div>
      </div>
    </main>
  );
}

import { env } from '@/config/env';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function EnvPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const entries = Object.entries(env).filter(([key]) =>
    key.startsWith('NEXT_PUBLIC'),
  );

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl">Environment variables</h1>
      <ul className="space-y-2">
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className="font-mono">{key}</span>: {value ? (
              <span>{String(value)}</span>
            ) : (
              <span className="rounded bg-red-200 px-1 text-red-800">missing</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

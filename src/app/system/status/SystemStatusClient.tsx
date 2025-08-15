'use client';

import { useEffect, useState } from 'react';

type Props = {
  envEntries: [string, string][];
  jwtCookie: string;
};

type PingResult = { ok: boolean; status?: number; bodySnippet?: string };

export default function SystemStatusClient({ envEntries, jwtCookie }: Props) {
  const [ping, setPing] = useState<PingResult | null>(null);

  useEffect(() => {
    fetch('/api/system/ping')
      .then((r) => r.json())
      .then((data) => setPing(data))
      .catch(() => setPing({ ok: false }));
  }, []);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">System status</h1>
      <p className="text-sm text-gray-500">Internal diagnostics</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Public env vars</h2>
          <ul className="space-y-1">
            {envEntries.map(([key, value]) => (
              <li key={key} className="flex items-center gap-2">
                <span className="font-mono text-xs md:text-sm">{key}</span>
                {value ? (
                  <span className="rounded bg-green-200 px-1 text-green-800 text-xs">set</span>
                ) : (
                  <span className="rounded bg-red-200 px-1 text-red-800 text-xs">missing</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            Set variables in Vercel → Settings → Environment Variables; redeploy after changes.
          </p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">API Ping</h2>
          {ping ? (
            <p className={ping.ok ? 'text-green-600' : 'text-red-600'}>
              {ping.ok ? 'API reachable' : 'API unreachable'}
              {ping.status ? ` (status ${ping.status})` : ''}
            </p>
          ) : (
            <p className="text-gray-600">Checking…</p>
          )}
          {ping?.bodySnippet && (
            <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-gray-500">
              {ping.bodySnippet}
            </pre>
          )}
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Auth</h2>
          <p>
            Cookie name: <span className="font-mono text-sm">{jwtCookie}</span>
          </p>
        </div>
      </div>
    </main>
  );
}

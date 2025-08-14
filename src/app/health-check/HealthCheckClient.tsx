'use client';

import { useEffect, useState } from 'react';
import { runHealthChecks, type HealthResult } from '@/lib/health';

type Status = 'loading' | 'ok' | 'error';

export default function HealthCheckClient({
  serverResults,
}: {
  serverResults: HealthResult[];
}) {
  const [clientResults, setClientResults] = useState<HealthResult[] | null>(
    null,
  );
  const [appStatus, setAppStatus] = useState<Status>('loading');

  useEffect(() => {
    runHealthChecks()
      .then(setClientResults)
      .catch(() => setClientResults([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    fetch('/', { method: 'HEAD', signal: controller.signal })
      .then((res) =>
        setAppStatus(res.status >= 200 && res.status < 400 ? 'ok' : 'error'),
      )
      .catch(() => setAppStatus('error'))
      .finally(() => clearTimeout(timeout));
    return () => controller.abort();
  }, []);

  const paths = serverResults.map((r) => r.path);

  function renderResult(res?: HealthResult) {
    if (!res)
      return <span className="text-gray-500">—</span>;
    return (
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-1 text-white text-xs rounded ${res.pass ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {res.pass ? 'OK' : 'FAIL'}
        </span>
        <span className="text-xs">{res.status}</span>
        <span className="font-mono break-all text-xs">{res.body}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        {appStatus === 'loading' ? (
          <span className="text-sm text-gray-500">Checking APP…</span>
        ) : (
          <span
            className={`px-2 py-1 text-white text-xs rounded ${
              appStatus === 'ok' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            APP: {appStatus === 'ok' ? 'OK' : 'ERROR'}
          </span>
        )}
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Endpoint</th>
            <th className="p-2">Server</th>
            <th className="p-2">Client</th>
          </tr>
        </thead>
        <tbody>
          {paths.map((p) => {
            const server = serverResults.find((r) => r.path === p);
            const client = clientResults?.find((r) => r.path === p);
            return (
              <tr key={p} className="border-b">
                <td className="p-2 font-mono">{p}</td>
                <td className="p-2">{renderResult(server)}</td>
                <td className="p-2">
                  {clientResults ? renderResult(client) : '…'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        <a
          href="https://api.quickgig.ph/health"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          Open API /health
        </a>
      </p>
    </div>
  );
}


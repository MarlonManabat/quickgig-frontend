'use client';

import { useEffect, useState } from 'react';
import { runHealthChecks, type HealthResult } from '@/lib/health';

export default function HealthCheckClient({
  serverResults,
}: {
  serverResults: HealthResult[];
}) {
  const [clientResults, setClientResults] = useState<HealthResult[] | null>(
    null,
  );

  useEffect(() => {
    runHealthChecks()
      .then(setClientResults)
      .catch(() => setClientResults([]));
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


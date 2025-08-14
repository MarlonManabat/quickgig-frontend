'use client';

import { useState } from 'react';
import type { HealthResult } from '@/lib/health';

export default function HealthCheckClient({ initial }: { initial: HealthResult[] }) {
  const [results, setResults] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function recheck() {
    setLoading(true);
    try {
      const res = await fetch('/api/health-check');
      const data: HealthResult[] = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Endpoint</th>
            <th className="p-2">Code</th>
            <th className="p-2">Result</th>
            <th className="p-2">Body</th>
            <th className="p-2">Latency</th>
            <th className="p-2">Hint</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.path} className="border-b">
              <td className="p-2 font-mono">{r.path}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                {r.pass ? (
                  <span className="text-green-600">PASS</span>
                ) : (
                  <span className="text-red-600">FAIL</span>
                )}
              </td>
              <td className="p-2 font-mono break-all">{r.body}</td>
              <td className="p-2">{r.latency} ms</td>
              <td className="p-2">
                {!r.pass && r.hint ? (
                  <span className="bg-red-600 text-white px-2 py-1 rounded">{r.hint}</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={recheck}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Re-check'}
      </button>
    </div>
  );
}


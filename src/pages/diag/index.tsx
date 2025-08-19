import { useEffect, useState } from 'react';
import { APP_VERSION } from '../../../lib/version';

interface StatusResponse {
  ok: boolean;
  backend?: unknown;
  baseUrl: string;
  used?: '/status' | '/health.php';
  durationMs?: number;
  status?: number;
  contentType?: string | null;
  sample?: string;
  message?: string;
}

export default function DiagPage() {
  const [data, setData] = useState<StatusResponse | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/diag/status');
      const json: StatusResponse = await res.json();
      setData(json);
    } catch (err) {
      setData({ ok: false, baseUrl: '', message: (err as Error).message });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const ok = data?.ok;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Frontend → Backend status</h1>
      <p className="text-sm text-gray-600">Version: {APP_VERSION}</p>
      <div className="flex items-center space-x-2">
        {ok === undefined ? (
          <span className="px-2 py-1 text-xs bg-gray-400 text-white rounded">…</span>
        ) : ok ? (
          <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">OK</span>
        ) : (
          <span className="px-2 py-1 text-xs bg-red-600 text-white rounded">FAIL</span>
        )}
        {typeof data?.durationMs === 'number' && (
          <span className="text-sm">{Math.round(data.durationMs)}ms</span>
        )}
      </div>
      <div>Backend base URL: {data?.baseUrl || 'unknown'}</div>
      <div>Used path: {data?.used || 'unknown'}</div>
      <pre className="bg-gray-100 p-2 text-xs overflow-auto">
        {data ? JSON.stringify(data.ok ? data.backend : data, null, 2) : 'Loading...'}
      </pre>
      <button
        onClick={load}
        className="px-3 py-1 border rounded"
      >
        Retry
      </button>
    </main>
  );
}

import { apiBase } from '@/lib/apiBase';
import { safeFetch } from '@/lib/safeFetch';
import { useEffect, useState } from 'react';

type Result = {
  ok: boolean;
  status: number;
  json: unknown;
  error: string | null;
};

export default async function Page() {
  const initial = await safeFetch(`${apiBase}/health`);
  return <HealthCheck initial={initial} />;
}

function HealthCheck({ initial }: { initial: Result }) {
  'use client';
  const [result, setResult] = useState<Result>(initial);

  const run = async () => {
    setResult(await safeFetch(`${apiBase}/health`));
  };

  useEffect(() => {
    if (!initial.ok) run();
  }, [initial.ok]);

  const json = result.json as { status?: string } | null;
  const isUp = json?.status === 'ok';

  return (
    <div className="p-4 space-y-4">
      <div>API URL: {`${apiBase}/health`}</div>
      <div>HTTP status: {result.status}</div>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(json, null, 2)}</pre>
      <div className={`text-2xl font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? 'UP' : 'DOWN'}
      </div>
      <button onClick={run} className="px-4 py-2 border rounded">Re-run check</button>
    </div>
  );
}

export const dynamic = 'force-dynamic';

async function getHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, { cache: 'no-store' });
    const json = await res.json();
    return { ok: res.ok, json };
  } catch (err) {
    return { ok: false, json: { error: (err as Error).message } };
  }
}

export default async function HealthCheckPage() {
  const { ok, json } = await getHealth();
  return (
    <main className="p-8 font-mono">
      <h1 className="text-xl mb-4">API Health Check</h1>
      <pre>{JSON.stringify(json, null, 2)}</pre>
      <p className="mt-4">{ok ? 'API reachable' : 'API unreachable'}</p>
    </main>
  );
}

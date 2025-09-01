export const dynamic = 'force-dynamic';

function envBool(name: string) {
  return process.env[name] ? 'set' : 'unset';
}

export default async function StatusPage() {
  const info = {
    node: process.version,
    vercel: process.env.VERCEL ?? 'false',
    vercelEnv: process.env.VERCEL_ENV ?? 'local',
    appOrigin: process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'n/a',
    supabaseUrl: envBool('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnon: envBool('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseService: envBool('SUPABASE_SERVICE_ROLE'),
  };
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Status</h1>
      <ul className="grid gap-1 text-sm">
        {Object.entries(info).map(([k, v]) => (
          <li key={k} className="flex justify-between border-b py-1">
            <span className="text-slate-600">{k}</span>
            <span className="font-mono">{String(v)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-slate-500 text-xs">
        Health endpoint: <code>/api/health</code>
      </p>
    </main>
  );
}

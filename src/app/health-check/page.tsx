import HealthCheckClient from './HealthCheckClient';
import { runHealthChecks } from '@/lib/health';

export const dynamic = 'force-dynamic';

export default async function HealthCheckPage() {
  const serverResults = await runHealthChecks();
  return (
    <main className="p-4">
      <h1 className="text-xl mb-4">API Health Check</h1>
      <HealthCheckClient serverResults={serverResults} />
    </main>
  );
}


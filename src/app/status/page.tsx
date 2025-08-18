import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { env } from '@/config/env';
import { t } from '@/lib/i18n';
import { health } from '@/lib/engineAdapter';
import { getMetrics } from '@/middleware/rateLimit';

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  if (!env.NEXT_PUBLIC_ENABLE_STATUS_PAGE) notFound();
  const info = await health();
  const metrics = env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT ? getMetrics() : null;
  const hdrs = headers();
  (hdrs as unknown as Headers).set('X-Robots-Tag', 'noindex');
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">{t('status.title')}</h1>
      <table className="mt-4">
        <tbody>
          <tr>
            <td>{t('status.engine_ok')}</td>
            <td data-testid="status-engine">{info.engine ? 'ok' : 'down'}</td>
          </tr>
          <tr>
            <td>{t('status.db_ok')}</td>
            <td data-testid="status-db">{info.db ? 'ok' : 'down'}</td>
          </tr>
          <tr>
            <td>{t('status.timestamp')}</td>
            <td>{info.timestamp}</td>
          </tr>
          {env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT && metrics && (
            <tr>
              <td>{t('status.uptime')}</td>
              <td data-testid="status-uptime">
                {Math.round(metrics.uptime / 1000)}s
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

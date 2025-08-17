import * as React from 'react';
import type { GetServerSideProps } from 'next';
import ProductShell from '@/components/layout/ProductShell';
import { HeadSEO } from '@/components/HeadSEO';
import { requireAuthSSR } from '@/lib/auth';
import { t } from '@/lib/t';
import type { JobAlert } from '@/types/alert';
import { env } from '@/config/env';
import Link from 'next/link';
import { removeAlert, upsertAlert } from '@/lib/alertsStore';
import { toast } from '@/lib/toast';

interface Props { alerts: JobAlert[] }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  if (!env.NEXT_PUBLIC_ENABLE_ALERTS) return { notFound: true };
  return requireAuthSSR([], async ({ req }) => {
    const base = process.env.BASE_URL || `http://${req.headers.host}`;
    try {
      const r = await fetch(`${base}/api/alerts`, { headers: { cookie: req.headers.cookie || '' } });
      const alerts = await r.json().catch(() => []);
      return { alerts };
    } catch {
      return { alerts: [] };
    }
  })(ctx);
};

export default function AlertsPage({ alerts: initial }: Props) {
  const [alerts, setAlerts] = React.useState<JobAlert[]>(initial);
  async function onDelete(id: string) {
    setAlerts((a) => a.filter((x) => x.id !== id));
    removeAlert(id);
    try {
      await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      toast(t('alerts.delete_success'));
    } catch {
      // ignore
    }
  }
  async function onToggleMute(a: JobAlert) {
    const muted = !a.muted;
    setAlerts((arr) => arr.map((al) => (al.id === a.id ? { ...al, muted } : al)));
    upsertAlert({ ...a, muted, id: a.id });
    try {
      await fetch(`/api/alerts/${a.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ muted }),
      });
    } catch {
      // ignore
    }
  }
  return (
    <ProductShell>
      <HeadSEO titleKey="alerts.title" />
      <h1>{t('alerts.title')}</h1>
      {!alerts.length ? (
        <div>
          <h3>{t('alerts.empty_title')}</h3>
          <p>{t('alerts.empty_body')}</p>
          <Link href="/find-work">{t('nav_find')}</Link>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {alerts.map((a) => {
            const parts = [a.q, a.loc, a.cat].filter(Boolean);
            parts.push(t(a.freq === 'daily' ? 'alerts.freq_daily' : 'alerts.freq_weekly'));
            return (
              <li key={a.id} style={{ marginBottom: 8 }}>
                <span>{parts.join(', ')} </span>
                <button onClick={() => onToggleMute(a)} style={{ marginLeft: 8 }}>
                  {a.muted ? t('alerts.unmute') : t('alerts.mute')}
                </button>
                <Link
                  href={{ pathname: '/find-work', query: { q: a.q, loc: a.loc, cat: a.cat, sort: a.sort } }}
                  style={{ marginLeft: 8 }}
                >
                  {t('alerts.view_results')}
                </Link>
                <button onClick={() => onDelete(a.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </ProductShell>
  );
}

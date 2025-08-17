import * as React from 'react';
import { useRouter } from 'next/router';
import { t } from '../../lib/t';
import { env } from '@/config/env';
import { findByParams, upsertAlert } from '@/lib/alertsStore';
import type { AlertFreq, JobAlert } from '@/types/alert';
import { toast } from '@/lib/toast';

type Props = {
  q?: string;
  loc?: string;
  cat?: string;
  sort?: string;
};
const cats = ['', 'IT', 'Admin', 'Sales', 'Design', 'Marketing'];
export default function FilterBar({ q = '', loc = '', cat = '', sort = 'relevant' }: Props) {
  const r = useRouter();
  const [state, set] = React.useState({ q, loc, cat, sort });
  const [alert, setAlert] = React.useState<JobAlert | undefined>();
  const [show, setShow] = React.useState(false);
  const [freq, setFreq] = React.useState<AlertFreq>('daily');
  React.useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_ALERTS) return;
    const existing = findByParams({ q, loc, cat, sort, size: 12 });
    setAlert(existing);
    if (existing) setFreq(existing.freq);
  }, [q, loc, cat, sort]);
  function push(next: typeof state & { page?: number }) {
    const qs = new URLSearchParams();
    if (next.q) qs.set('q', next.q);
    if (next.loc) qs.set('loc', next.loc);
    if (next.cat) qs.set('cat', next.cat);
    if (next.sort && next.sort !== 'relevant') qs.set('sort', next.sort);
    if (next.page && next.page > 1) qs.set('page', String(next.page));
    r.push(`/find-work${qs.toString() ? `?${qs}` : ''}`);
  }
  async function saveAlert() {
    const body = { q: state.q, loc: state.loc, cat: state.cat, sort: state.sort, size: 12, freq };
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = (await res.json()) as JobAlert;
      upsertAlert(j);
      setAlert(j);
      toast(t('alerts.create_success'));
    } catch {
      // ignore
    }
    setShow(false);
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        push(state);
      }}
      style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr 1fr auto auto' }}
    >
      <input
        placeholder={t('search_placeholder')}
        value={state.q}
        onChange={(e) => set((s) => ({ ...s, q: e.target.value }))}
      />
      <input
        placeholder="Location"
        value={state.loc}
        onChange={(e) => set((s) => ({ ...s, loc: e.target.value }))}
      />
      <select value={state.cat} onChange={(e) => set((s) => ({ ...s, cat: e.target.value }))}>
        {cats.map((c) => (
          <option key={c} value={c}>
            {c || 'All categories'}
          </option>
        ))}
      </select>
      <select
        value={state.sort}
        onChange={(e) => {
          const sort = e.target.value;
          set((s) => ({ ...s, sort }));
        }}
      >
        <option value="relevant">Relevance</option>
        <option value="new">Newest</option>
        <option value="pay">Pay (high→low)</option>
      </select>
      <button type="submit">Search</button>
      {env.NEXT_PUBLIC_ENABLE_ALERTS && (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label="alert"
            title={alert ? t('alerts.bell_tooltip_on') : t('alerts.bell_tooltip_off')}
            onClick={() => setShow((s) => !s)}
          >
            {alert ? '🔔' : '🔕'}
          </button>
          {show && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                padding: 8,
                borderRadius: 4,
                zIndex: 10,
              }}
            >
              <select value={freq} onChange={(e) => setFreq(e.target.value as AlertFreq)}>
                <option value="daily">{t('alerts.freq_daily')}</option>
                <option value="weekly">{t('alerts.freq_weekly')}</option>
              </select>
              <button type="button" onClick={saveAlert} style={{ marginLeft: 8 }}>
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

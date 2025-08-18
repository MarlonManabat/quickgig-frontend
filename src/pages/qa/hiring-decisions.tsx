import { useEffect, useState } from 'react';
import BulkActions from '@/components/employer/BulkActions';
import { t } from '@/lib/i18n';
import type { ApplicationSummary } from '@/types/application';

interface Props { auto: boolean }

export default function HiringDecisionsQA({ auto }: Props) {
  const [apps, setApps] = useState<ApplicationSummary[]>([]);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    (async () => {
      const list = await fetch('/api/applications');
      const arr: ApplicationSummary[] = await list.json();
      setApps(arr.filter((a) => a.jobId === '1'));
      if (!auto) return;
      await fetch('/api/applications/1/hire', { method: 'POST' });
      await fetch('/api/employer/jobs/1/bulk/reject', { method: 'POST' });
      await fetch('/api/employer/jobs/1/close', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reason: 'filled', bulkNotify: false }),
      });
      const after = await fetch('/api/applications');
      const arr2: ApplicationSummary[] = await after.json();
      setApps(arr2.filter((a) => a.jobId === '1'));
      setClosed(true);
    })();
  }, [auto]);
  return (
    <main className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">{t('qa.hiringQATitle')}</h1>
      <ul className="space-y-2">
        {apps.map((a) => (
          <li key={a.id} data-testid={`status-${a.status}`}>
            {a.id} - {a.status}
          </li>
        ))}
      </ul>
      {closed && (
        <div data-testid="closeout-preview">{t('qa.closeoutDone')}</div>
      )}
      <BulkActions
        applicants={apps
          .filter((a) => a.status === 'not_selected')
          .map((a) => ({ id: a.id, name: a.id }))}
        job={{ id: '1', title: 'Sample Job' }}
        auto={auto}
      />
    </main>
  );
}

export async function getServerSideProps(ctx: { query: { [k: string]: string } }) {
  if (
    process.env.NEXT_PUBLIC_ENABLE_HIRING_QA !== 'true' ||
    process.env.ENGINE_MODE === 'php'
  ) {
    return { notFound: true };
  }
  return { props: { auto: ctx.query.auto === '1' } };
}

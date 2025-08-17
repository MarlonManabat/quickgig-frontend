import * as React from 'react';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import { useSavedJobs } from '../src/product/useSavedJobs';
import { JobGrid } from '../src/product/JobCard';
import { searchJobs, type JobSummary } from '../src/lib/api';
import { t } from '../src/lib/t';

export default function SavedPage() {
  const { ids } = useSavedJobs();
  const [jobs, setJobs] = React.useState<JobSummary[]>([]);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!ids.length) { setJobs([]); return; }
      // naive: fetch by ids via search endpoint if it supports ids, else filter client side by q
      // fallback: parallel fetch by details if needed; for now, try search by q= to get something
      try {
        const res = await searchJobs({ q: ids.join(' ') });
        const items = res.items.filter(j => ids.includes(String(j.id)));
        if (alive) setJobs(items);
      } catch { if (alive) setJobs([]); }
    })();
    return () => { alive = false; };
  }, [ids]);
  return (
    <ProductShell>
      <HeadSEO titleKey="saved_title" descKey="saved_title" />
      <h1>{t('saved_title')}</h1>
      {!ids.length ? <p>{t('saved_empty')}</p> : <JobGrid jobs={jobs} />}
    </ProductShell>
  );
}

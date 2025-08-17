import * as React from 'react';
import type { GetServerSideProps } from 'next';
import { HeadSEO } from '../src/components/HeadSEO';
import DashboardShell from '../src/components/product/DashboardShell';
import { Tabs, TabList, Tab, TabPanel } from '../src/components/product/Tabs';
import { JobGrid } from '../src/product/JobCard';
import { useSavedJobs } from '../src/product/useSavedJobs';
import { searchJobs, type JobSummary } from '../src/lib/api';
import { listApplied } from '../src/lib/appliedStore';
import { t } from '../src/lib/t';
import { OnboardingBanner } from '../src/product/onboarding/Banner';

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default function AccountPage() {
  const { ids } = useSavedJobs();
  const [savedJobs, setSavedJobs] = React.useState<JobSummary[]>([]);
  const [appliedJobs, setAppliedJobs] = React.useState<JobSummary[]>([]);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!ids.length) { setSavedJobs([]); return; }
      try {
        const res = await searchJobs({ q: ids.join(' ') });
        const items = res.items.filter(j => ids.includes(String(j.id)));
        if (alive) setSavedJobs(items);
      } catch { if (alive) setSavedJobs([]); }
    })();
    return () => { alive = false; };
  }, [ids]);
  React.useEffect(() => {
    setAppliedJobs(listApplied());
  }, []);
  return (
    <>
      <HeadSEO titleKey="nav_account" descKey="nav_account_desc" />
      <OnboardingBanner />
      <Tabs>
        <DashboardShell
          title={t('nav_account')}
          tabs={
            <TabList>
              <Tab index={0}>{t('saved_title')}</Tab>
              <Tab index={1}>{t('applied_title')}</Tab>
            </TabList>
          }
        >
          <TabPanel index={0}>
            {ids.length ? <JobGrid jobs={savedJobs} /> : <p>{t('saved_empty')}</p>}
          </TabPanel>
          <TabPanel index={1}>
            {appliedJobs.length ? <JobGrid jobs={appliedJobs} /> : <p>{t('applied_empty')}</p>}
          </TabPanel>
        </DashboardShell>
      </Tabs>
    </>
  );
}

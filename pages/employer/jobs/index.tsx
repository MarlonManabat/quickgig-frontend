import * as React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import DashboardShell from '../../../src/components/product/DashboardShell';
import { HeadSEO } from '../../../src/components/HeadSEO';
import { Table, Th, Td, Tr } from '../../../src/components/product/Table';
import { listMyJobs } from '../../../src/lib/apiEmployer';
import { t } from '../../../src/lib/t';
import type { JobSummary } from '../../../src/types/job';

interface Props { jobs: JobSummary[]; }

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const jobs = await listMyJobs();
  return { props: { jobs } };
};

export default function EmployerJobs({ jobs }: Props) {
  return (
    <>
      <HeadSEO titleKey="employer_jobs_title" descKey="employer_title" />
      <DashboardShell title={t('employer_jobs_title')}>
        {jobs.length ? (
          <Table>
            <thead>
              <Tr>
                <Th>Title</Th>
                <Th>Location</Th>
                <Th>Posted</Th>
                <Th>Applicants</Th>
              </Tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <Tr key={String(j.id)}>
                  <Td>{j.title}</Td>
                  <Td>{j.location || '-'}</Td>
                  <Td>{j.postedAt ? new Date(j.postedAt).toLocaleDateString() : '-'}</Td>
                  <Td>
                    <Link href={`/employer/jobs/${j.id}/applicants`} legacyBehavior>
                      <a>{j.applicants ?? 0}</a>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>
            {t('employer_empty')} <Link href="/employer/post">Post</Link>
          </p>
        )}
      </DashboardShell>
    </>
  );
}

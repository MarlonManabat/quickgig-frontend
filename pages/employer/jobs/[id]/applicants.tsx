import * as React from 'react';
import DashboardShell from '../../../../src/components/product/DashboardShell';
import { HeadSEO } from '../../../../src/components/HeadSEO';
import { Table, Th, Td, Tr } from '../../../../src/components/product/Table';
import { listApplicants } from '../../../../src/lib/apiEmployer';
import { t } from '../../../../src/lib/t';
import type { ApplicantSummary } from '../../../../src/types/job';
import { requireAuthSSR } from '@/lib/auth';
import type { Session } from '../../../../src/types/user';

interface Props { applicants: ApplicantSummary[]; session: Session; }

export const getServerSideProps = requireAuthSSR(['employer', 'admin'], async ({ params }) => {
  const id = String(params?.id || '');
  const applicants = await listApplicants(id);
  return { applicants };
});

function relTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ApplicantsPage({ applicants, session }: Props) {
  return (
    <>
      <HeadSEO titleKey="employer_applicants_title" descKey="employer_title" />
      <DashboardShell title={t('employer_applicants_title')}>
        <p>Hi, {session?.name}!</p>
        {applicants.length ? (
          <Table>
            <thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Submitted</Th>
              </Tr>
            </thead>
            <tbody>
              {applicants.map(a => (
                <Tr key={a.id}>
                  <Td>{a.name}</Td>
                  <Td><a href={`mailto:${a.email}`}>{a.email}</a></Td>
                  <Td>{relTime(a.submittedAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>{t('employer_empty')}</p>
        )}
      </DashboardShell>
    </>
  );
}

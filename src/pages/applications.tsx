import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import type { ApplicationSummary } from '@/types/application';
import { fetchApplications } from '@/lib/applicationsApi';
import { env } from '@/config/env';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!env.NEXT_PUBLIC_ENABLE_APPLICANT_APPS) return { notFound: true } as const;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/session/me`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    if (!res.ok) {
      return {
        redirect: {
          destination: `/login?return=/applications`,
          permanent: false,
        },
      } as const;
    }
  } catch {
    return {
      redirect: {
        destination: `/login?return=/applications`,
        permanent: false,
      },
    } as const;
  }
  return { props: {} } as const;
};

const statuses = ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'] as const;

type SortKey = 'newest' | 'oldest' | 'updated';

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | (typeof statuses)[number]>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    fetchApplications().then(setApps).catch(() => {});
  }, []);

  const filtered = apps.filter((a) =>
    statusFilter === 'all' ? true : a.status === statusFilter,
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest')
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    if (sort === 'oldest')
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <Head>
        <title>My applications | QuickGig</title>
      </Head>
      <main className="qg-container py-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">My applications</h1>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | (typeof statuses)[number])
              }
              className="border rounded p-2 text-sm"
            >
              <option value="all">All</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border rounded p-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>
        </div>
        {sorted.length ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2">Job</th>
                <th className="py-2">Company</th>
                <th className="py-2">Location</th>
                <th className="py-2">Status</th>
                <th className="py-2">Updated</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="py-2">
                    <Link href={`/applications/${app.id}`}>{app.jobTitle}</Link>
                  </td>
                  <td className="py-2">{app.company}</td>
                  <td className="py-2">{app.location}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs">
                      {app.status}
                    </span>
                    {env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT &&
                      app.status !== 'hired' &&
                      app.status === 'not_selected' && (
                        <span className="ml-2 text-xs text-gray-500">
                          Job closed
                        </span>
                      )}
                  </td>
                  <td className="py-2">
                    {Math.round(
                      (Date.now() - new Date(app.updatedAt).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                    d ago
                  </td>
                  <td className="py-2 space-x-2">
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View job
                    </Link>
                    <Link
                      href={`/messages?jobId=${app.jobId}`}
                      className="text-blue-600 hover:underline"
                    >
                      Message employer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <p className="mb-4">No applications yet.</p>
            <Link
              href="/find-work"
              className="text-blue-600 hover:underline"
            >
              Find work
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

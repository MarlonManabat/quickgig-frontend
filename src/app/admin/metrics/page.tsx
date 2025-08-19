'use client';
import { useEffect, useState } from 'react';
import { env } from '@/config/env';
import { API } from '@/config/api';
import MiniSparkline from '@/components/MiniSparkline';

interface Summary {
  signups?: number;
  applies?: number;
  messages?: number;
  jobPosts?: number;
  topJobs?: { id: string | number; title: string; views: number }[];
}

type Series = Record<string, number[]>;

export default function AdminMetricsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [series, setSeries] = useState<Series>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sRes = await fetch(`${env.API_URL!}${API.metricsSummary}?range=7`);
        const sJson = await sRes.json();
        setSummary(sJson || {});
        const metrics = ['signups', 'applies', 'messages', 'job_posts'];
        const ts: Series = {};
        await Promise.all(
          metrics.map(async (m) => {
            try {
              const r = await fetch(
                `${env.API_URL!}${API.metricsTimeseries}?metric=${m}&range=30`,
              );
              const j = await r.json();
              ts[m] = Array.isArray(j) ? j : j.values || [];
            } catch {
              ts[m] = [];
            }
          }),
        );
        setSeries(ts);
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Metrics</h1>
      {!summary ? (
        <p>Backend metrics API not available yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded p-4">
              <p className="text-sm">Signups</p>
              <p className="text-2xl font-semibold">{summary.signups ?? 0}</p>
              <MiniSparkline data={series.signups || []} className="w-full h-12 mt-2" />
            </div>
            <div className="border rounded p-4">
              <p className="text-sm">Applies</p>
              <p className="text-2xl font-semibold">{summary.applies ?? 0}</p>
              <MiniSparkline data={series.applies || []} className="w-full h-12 mt-2" />
            </div>
            <div className="border rounded p-4">
              <p className="text-sm">Messages</p>
              <p className="text-2xl font-semibold">{summary.messages ?? 0}</p>
              <MiniSparkline data={series.messages || []} className="w-full h-12 mt-2" />
            </div>
            <div className="border rounded p-4">
              <p className="text-sm">Job Posts</p>
              <p className="text-2xl font-semibold">{summary.jobPosts ?? 0}</p>
              <MiniSparkline data={series['job_posts'] || []} className="w-full h-12 mt-2" />
            </div>
          </div>
          {summary.topJobs?.length ? (
            <div>
              <h2 className="text-lg font-semibold mt-6 mb-2">Top job views</h2>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left">Job</th>
                    <th className="border px-2 py-1">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topJobs.map((j) => (
                    <tr key={j.id}>
                      <td className="border px-2 py-1">{j.title}</td>
                      <td className="border px-2 py-1 text-right">{j.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}
      {error && <p className="text-sm text-red-600">Backend metrics API not available yet</p>}
    </main>
  );
}

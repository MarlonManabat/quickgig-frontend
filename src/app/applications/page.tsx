'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';

interface Application {
  id: string | number;
  jobTitle: string;
  company: string;
  status: string;
  submittedAt: string;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Application[]>(API.applicationsMine);
        setApps(res.data);
      } catch {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">{error}</main>;

  if (!apps.length) {
    return (
      <main className="p-4">
        <p>You haven’t applied to any jobs yet.</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Applications</h1>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Job</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Submitted</th>
            <th className="p-2">View</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} className="border-b">
              <td className="p-2">{app.jobTitle}</td>
              <td className="p-2">{app.company}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">{new Date(app.submittedAt).toLocaleDateString()}</td>
              <td className="p-2">
                <Link href={`/applications/${app.id}`} className="text-qg-accent">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

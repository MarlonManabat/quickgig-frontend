'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';

interface EmployerApplication {
  id: string | number;
  applicantName: string;
  applicantEmail?: string;
  jobTitle: string;
  status: string;
  submittedAt: string;
}

export default function EmployerApplicationsPage() {
  const [apps, setApps] = useState<EmployerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get<EmployerApplication[]>(API.employerApplications);
      setApps(res.data);
    } catch {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">{error}</main>;
  if (!apps.length)
    return (
      <main className="p-4">
        <p>No applications yet.</p>
      </main>
    );

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Applications</h1>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Applicant</th>
            <th className="p-2 text-left">Job</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Submitted</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} className="border-b">
              <td className="p-2">{app.applicantName}</td>
              <td className="p-2">{app.jobTitle}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">{new Date(app.submittedAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <Link href={`/employer/applications/${app.id}`} className="text-qg-accent">
                  Open
                </Link>
                {app.applicantEmail && (
                  <a href={`mailto:${app.applicantEmail}`} className="text-qg-accent">
                    Email
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

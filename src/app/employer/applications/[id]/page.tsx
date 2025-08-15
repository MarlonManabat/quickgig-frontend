'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';

interface ApplicationDetail {
  id: string | number;
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  jobTitle: string;
  status: string;
  submittedAt: string;
  note?: string;
}

export default function EmployerApplicationDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<ApplicationDetail>(API.applicationDetail(id));
        setApp(res.data);
      } catch {
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">{error}</main>;
  if (!app) return null;

  return (
    <main className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">{app.jobTitle}</h1>
      <p>Applicant: {app.applicantName}</p>
      {app.applicantEmail && <p>Email: {app.applicantEmail}</p>}
      {app.applicantPhone && <p>Phone: {app.applicantPhone}</p>}
      <p>Status: {app.status}</p>
      <p>Submitted: {new Date(app.submittedAt).toLocaleString()}</p>
      {app.note && (
        <div>
          <h2 className="font-semibold">Note</h2>
          <p>{app.note}</p>
        </div>
      )}
    </main>
  );
}

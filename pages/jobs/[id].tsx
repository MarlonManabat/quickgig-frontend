import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ApplyForm from '@/components/jobs/ApplyForm';
import { supabase } from '@/utils/supabaseClient';
import { getRolePref } from '@/lib/rolePref';
import { getString } from '@/utils/getString';

export default function JobDetail() {
  const router = useRouter();
  const id = getString(router.query.id);
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'worker' | 'employer' | null>(null);
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('jobs')
      .select('id,title,description,owner_id,is_closed')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setJob(data));
  }, [id]);

  useEffect(() => {
    if (!id || !user || user.id !== job?.owner_id) return;
    supabase
      .from('applications')
      .select(
        'id,worker:profiles(full_name),message,expected_rate,status,created_at'
      )
      .eq('job_id', id)
      .then(({ data }) => setApps((data as any) || []));
  }, [id, user, job]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const r = await getRolePref(data.user.id);
        setRole(r);
      }
    });
  }, []);

  if (!job) return <p>Loading...</p>;

  const isOwner = user?.id === job.owner_id;
  const isClosed = job.is_closed;
  const canApply = user && role === 'worker' && !isOwner && !isClosed;

  async function updateStatus(appId: string, status: 'accepted' | 'declined') {
    await fetch('/api/applications/updateStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, status }),
    });
    setApps((rows) =>
      rows.map((r) => (r.id === appId ? { ...r, status } : r))
    );
  }

  async function closeJob() {
    if (!confirm('Close this job?')) return;
    await fetch('/api/jobs/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: id }),
    });
    setJob((j: any) => ({ ...j, is_closed: true }));
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p>{job.description}</p>
      {isClosed && (
        <p
          className="text-red-600"
          aria-live="polite"
          data-testid="job-closed-banner"
        >
          This job is closed to new applications.
        </p>
      )}
      {isOwner && !isClosed && (
        <button
          onClick={closeJob}
          className="underline text-sm"
          data-testid="btn-close-job"
        >
          Close job
        </button>
      )}
      {!user && (
        <p>
          <Link href={`/auth?next=/jobs/${id}`}>Log in</Link> to apply.
        </p>
      )}
      {canApply && <ApplyForm jobId={job.id} />}
      {isOwner && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Applications</h2>
          <ul className="space-y-4">
            {apps.map((a) => (
              <li key={a.id} className="border p-3 rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {a.worker?.full_name || a.worker_id}
                    </div>
                    <div className="text-sm text-brand-subtle">
                      {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      a.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : a.status === 'declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-200'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="mt-2">{a.message}</p>
                <p className="mt-1 text-sm">Rate: {a.expected_rate}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    disabled={a.status !== 'submitted'}
                    onClick={() => updateStatus(a.id, 'accepted')}
                    className="text-sm underline"
                  >
                    Accept
                  </button>
                  <button
                    disabled={a.status !== 'submitted'}
                    onClick={() => updateStatus(a.id, 'declined')}
                    className="text-sm underline"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
            {apps.length === 0 && <p>No applications yet.</p>}
          </ul>
        </section>
      )}
    </main>
  );
}

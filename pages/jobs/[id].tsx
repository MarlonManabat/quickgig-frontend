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

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p>{job.description}</p>
      {isClosed && (
        <p className="text-red-600" aria-live="polite">
          Applications closed
        </p>
      )}
      {!user && (
        <p>
          <Link href={`/auth?next=/jobs/${id}`}>Log in</Link> to apply.
        </p>
      )}
      {canApply && <ApplyForm jobId={job.id} />}
    </main>
  );
}

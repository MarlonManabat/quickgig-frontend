import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

import { ApplyButton } from '@/components/jobs/apply-button';
import { getSession } from '@/lib/auth';
import { applyToJob, fetchJob } from '@/lib/jobs';
import { findRegionByCode } from '@/lib/regions';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await fetchJob(params.id);
  if (!job) {
    return {
      title: 'Job not found • QuickGig.ph',
    };
  }
  return {
    title: `${job.title} • QuickGig.ph`,
    description: job.description.slice(0, 120),
  };
}

async function applyAction(formData: FormData) {
  'use server';

  const jobId = formData.get('jobId');
  if (!jobId || typeof jobId !== 'string') {
    throw new Error('Missing job id');
  }
  const session = getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/jobs/${jobId}`)}`);
  }
  await applyToJob(jobId, session);
  redirect('/applications');
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await fetchJob(params.id);
  if (!job) {
    notFound();
  }
  const region = findRegionByCode(job.region);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">{region?.name ?? job.region}</p>
        <h1 className="text-3xl font-semibold">{job.title}</h1>
        <p className="text-muted-foreground">{job.city}</p>
      </header>
      <section className="prose max-w-none">
        <p>{job.description}</p>
      </section>
      <form action={applyAction} className="pt-4">
        <input type="hidden" name="jobId" value={job.id} />
        <ApplyButton jobId={job.id} />
      </form>
    </article>
  );
}

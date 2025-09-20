import { redirect } from 'next/navigation';

import { JobForm, type FormState } from '@/components/jobs/job-form';
import { getSession } from '@/lib/auth';
import { createJob } from '@/lib/jobs';

async function createJobAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  'use server';

  const session = getSession();
  if (!session) {
    redirect('/login?next=/gigs/create');
  }

  const payload = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    region: String(formData.get('region') ?? ''),
    city: String(formData.get('city') ?? ''),
    published: formData.get('published') === 'on',
  };

  try {
    await createJob(payload, session);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Hindi namin na-post ang gig. Subukan muli.' };
  }

  redirect('/browse-jobs?posted=1');
}

export default function CreateGigPage() {
  const session = getSession();
  if (!session) {
    redirect('/login?next=/gigs/create');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Mag-post ng Gig</h1>
        <p className="text-muted-foreground">Punan ang detalye ng gig para maabot ang mga QuickGigers.</p>
      </header>
      <JobForm action={createJobAction} />
    </div>
  );
}

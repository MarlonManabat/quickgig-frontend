'use client';
import { useRouter } from 'next/navigation';
import { isSignedIn } from '@/lib/devAuth';
import { addApplication } from '@/lib/applicationsStore';
import { ROUTES } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

interface Job {
  id: string;
  title: string;
  description: string;
}

export default function JobDetailClient({ job }: { job: Job }) {
  const router = useRouter();

  function handleApply() {
    if (!isSignedIn()) {
      router.push(loginNext(ROUTES.applications));
      return;
    }
    addApplication({ id: job.id, title: job.title });
    router.push(ROUTES.applications);
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p>{job.description}</p>
      <button
        id="apply-button"
        data-testid="apply-button"
        onClick={handleApply}
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
      >
        Apply
      </button>
    </div>
  );
}

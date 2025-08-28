import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionAndCredits } from '@/lib/credits-server';
import NewJobForm from '@/components/jobs/NewJobForm';
import CreditsGate from '@/components/credits/CreditsGate';

export default async function NewJobPage() {
  const { user, credits } = await getSessionAndCredits();

  if (!user) {
    redirect('/auth');
  }

  if (credits <= 0) {
    return (
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">You have 0 credits</h1>
        <CreditsGate />
        <div className="pt-4">
          <Link className="underline" href="/">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <NewJobForm />
    </main>
  );
}


import { useRouter } from 'next/router';
import CreditsGate from '@/components/credits/Gate';
import NewJobForm from '@/components/jobs/NewJobForm';

export default function NewJob() {
  const router = useRouter();
  return (
    <main className="p-4">
      <CreditsGate>
        <NewJobForm onCreated={() => router.push('/find')} />
      </CreditsGate>
    </main>
  );
}

import { useRouter } from 'next/router';
import GigForm from '@/components/gigs/GigForm';
import { createGig } from '@/lib/gigs/api';
import CreditsGate from '@/components/credits/Gate';
import { consumeOneCredit } from '@/lib/credits';
import { mutate } from 'swr';

export default function NewJob() {
  const router = useRouter();
  return (
    <main className="p-4">
      <CreditsGate>
        <GigForm
          onSubmit={async (g) => {
            const { data } = await createGig(g);
            if (data) {
              try {
                await consumeOneCredit();
                mutate('credits');
              } catch {
                // non-blocking
              }
              router.push(`/gigs/${data.id}`);
            }
          }}
        />
      </CreditsGate>
    </main>
  );
}

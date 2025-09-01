import PostGigForm from '@/components/gigs/PostGigForm';

export const dynamic = 'force-dynamic';

export default function CreateGigPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <PostGigForm />
    </main>
  );
}

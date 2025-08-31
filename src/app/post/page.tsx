import GigForm from '@/components/GigForm';

export const dynamic = 'force-dynamic';

async function fetchMe() {
  const res = await fetch('/api/me', { cache: 'no-store' });
  if (!res.ok) return { needsProfile: true } as any;
  return res.json();
}

export default async function PostPage() {
  const me = await fetchMe();
  if (me.needsProfile || !me.can_post_job) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p>You need a completed profile with posting access to post a gig.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Post a gig</h1>
      <GigForm />
    </main>
  );
}

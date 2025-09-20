import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const session = getSession();
  if (session) {
    redirect(searchParams.next ?? '/browse-jobs');
  }

  const next = searchParams.next ?? '/browse-jobs';

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Mag-login sa QuickGig.ph</h1>
        <p className="text-muted-foreground">Gamitin ang magic link para makapag-apply o makapag-post ng gigs.</p>
      </header>
      <form action={`/api/auth/demo?next=${encodeURIComponent(next)}`} method="post" className="space-y-4">
        <Button type="submit" className="w-full">
          Gamitin ang Demo Login
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Kapag may Supabase credentials ka, palitan ang demo login sa magic link authentication.
      </p>
    </div>
  );
}

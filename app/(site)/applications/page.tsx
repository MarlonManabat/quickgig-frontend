import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';
import { listMyApplications } from '@/lib/jobs';
import { formatDate } from '@/lib/utils';

export default async function ApplicationsPage() {
  const session = getSession();
  if (!session) {
    redirect('/login?next=/applications');
  }

  const applications = await listMyApplications(session);

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Aking Mga Application</h1>
          <p className="text-muted-foreground">Wala ka pang na-applyan. Simulan na ang paghahanap ng gigs ngayon!</p>
        </header>
        <div
          data-testid="applications-empty"
          className="rounded-xl border border-dashed border-muted-foreground/40 p-10 text-center"
        >
          <p className="font-medium">Wala pang nakalistang application.</p>
          <Button className="mt-4" asChild>
            <a href="/browse-jobs">Maghanap ng Trabaho</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Aking Mga Application</h1>
        <p className="text-muted-foreground">Narito ang mga gigs na inaplayan mo sa QuickGig.ph.</p>
      </header>
      <ul data-testid="applications-list" className="space-y-4">
        {applications.map((application) => (
          <li key={application.id} data-testid="application-row" className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{application.job?.title ?? 'Gig archived'}</p>
                <p className="text-sm text-muted-foreground">Submitted {formatDate(application.createdAt)}</p>
              </div>
              {application.job ? (
                <Button variant="outline" asChild>
                  <a href={`/jobs/${application.job.id}`}>Tignan muli</a>
                </Button>
              ) : null}
            </div>
            {application.job ? (
              <p className="mt-3 text-sm text-muted-foreground">{application.job.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

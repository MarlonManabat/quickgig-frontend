import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { getProfile } from '@/utils/session';
import { copy } from '@/copy';

export default function Home() {
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    getProfile().then((p) => setCanPost(!!p?.can_post_job));
  }, []);

  return (
    <Card className="p-6 text-center space-y-4">
      <h1>QuickGig.ph</h1>
      <p>Connect with opportunities — find work or hire talent quickly.</p>
      <div className="flex justify-center gap-4">
        <Link
          href="/gigs?focus=search"
          className="btn-primary"
          data-testid="cta-findwork"
        >
          {copy.nav.findWork}
        </Link>
        {canPost && (
          <Link
            href="/gigs/new?focus=title"
            className="btn-secondary"
            data-testid="cta-postjob"
          >
            {copy.nav.postJob}
          </Link>
        )}
        <Link
          href="/auth?focus=email"
          className="btn-secondary"
          data-testid="cta-auth"
        >
          Sign up / Mag-login
        </Link>
      </div>
    </Card>
  );
}

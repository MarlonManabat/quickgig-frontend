import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { H1, P } from '@/components/ui/Text';
import { getProfile } from '@/utils/session';
import { copy } from '@/copy';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const [canPost, setCanPost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile().then((p) => setCanPost(!!p?.can_post_job));
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) router.replace('/home');
    })();
  }, []);

  return (
    <Card className="p-6 text-center space-y-4">
      <H1>QuickGig.ph</H1>
      <P>Connect with opportunities — find work or hire talent quickly.</P>
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

export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { getProfile } from '@/utils/session';
import Card from '@/components/ui/Card';
import Empty from '@/components/ui/Empty';
import Spinner from '@/components/ui/Spinner';
import Banner from '@/components/ui/Banner';

export default function GigsList() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canPostJob, setCanPostJob] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      setCanPostJob(!!profile?.can_post_job);
    })();
  }, []);

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setGigs(data || []);
      }
      setLoading(false);
    }
    fetchGigs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-right">
        {canPostJob && (
          <Link href="/gigs/new" className="btn-primary">Post Job</Link>
        )}
      </div>
      <h1>Gigs</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Banner kind="error">{error}</Banner>
      ) : gigs.length === 0 ? (
        <Empty
          title="No gigs found"
          action={
            canPostJob ? (
              <Link href="/gigs/new" className="btn-primary">Post a Job</Link>
            ) : (
              <Link href="/auth" className="btn-primary">Sign in</Link>
            )
          }
        />
      ) : (
        <ul className="space-y-4">
          {gigs.map((gig) => (
            <li key={gig.id}>
              <Card className="p-4">
                <Link
                  href={`/gigs/${gig.id}`}
                  className="text-lg font-semibold"
                  data-testid="gig-card"
                >
                  {gig.title}
                </Link>
                <p className="text-sm text-brand-subtle">
                  {gig.city} · ₱{gig.budget} · {gig.published ? 'published' : 'draft'}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

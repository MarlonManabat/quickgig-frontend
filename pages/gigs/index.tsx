import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import { hasApprovedOrder } from '@/utils/billing';
import Card from '@/components/ui/Card';
import Empty from '@/components/ui/Empty';
import Spinner from '@/components/ui/Spinner';
import Banner from '@/components/ui/Banner';
import { focusFromQuery } from '@/utils/focusTarget';

export default function GigsList() {
  const router = useRouter();
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    focusFromQuery('focus', { search: '#search' });
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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

  const handlePostJob = async () => {
    const {
      data: { user: current },
    } = await supabase.auth.getUser();
    if (!current) {
      router.push('/auth');
      return;
    }
    const ok = await hasApprovedOrder(current.id);
    if (!ok) {
      setRedirecting(true);
      router.push('/billing?message=' + encodeURIComponent('Complete payment to post jobs.'));
      return;
    }
    router.push('/gigs/new');
  };

  return (
    <div
      className="space-y-4"
      data-testid={router.query.mine === '1' ? 'my-gigs' : 'gigs-list'}
    >
      {redirecting && <p data-testid="paywall-redirect">Redirecting...</p>}
      <div className="text-right">
        <button onClick={handlePostJob} className="btn-primary">Post Job</button>
      </div>
      <h1>Gigs</h1>
      <input
        id="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search gigs"
        className="w-full max-w-md" />
      {loading ? (
        <Spinner />
      ) : error ? (
        <Banner kind="error">{error}</Banner>
      ) : gigs.length === 0 ? (
        <Empty
          title="No gigs found"
          action={
            user ? (
              <button onClick={handlePostJob} className="btn-primary">Post a Job</button>
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

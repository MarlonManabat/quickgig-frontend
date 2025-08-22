import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { getProfile } from '@/utils/session';

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
    <div>
      {canPostJob && (
        <div className="mb-4 text-right">
          <Link href="/gigs/new" className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 hover:opacity-90">Post a Job</Link>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">Gigs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : gigs.length === 0 ? (
        <p>No gigs found.</p>
      ) : (
        <ul className="space-y-4">
          {gigs.map((gig) => (
            <li key={gig.id} className="border rounded p-4">
              <Link href={`/gigs/${gig.id}`} className="text-lg font-semibold">
                {gig.title}
              </Link>
              <p>{gig.description}</p>
              <p className="text-sm text-gray-600">
                {gig.city} · ₱{gig.budget}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

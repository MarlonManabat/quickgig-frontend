import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabaseClient';

export default function GigsList() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Gigs</h1>
      <div className="mb-4">
        <Link href="/gigs/new" className="text-blue-500 underline">Post a Gig</Link>
      </div>
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

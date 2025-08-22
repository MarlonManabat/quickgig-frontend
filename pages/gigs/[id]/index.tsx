import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

type Gig = {
  id: string; owner: string; title: string; description?: string;
  budget?: number; location?: string; status: 'draft'|'published'|'closed';
};

export default function GigViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return; // wait for router ready
    let mounted = true;

    (async () => {
      try {
        // get session user id (may be null)
        const { data: u } = await supabase.auth.getUser();
        const me = u.user?.id ?? null;

        // fetch the gig
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) { setErr('Not found'); return; }

        // Enforce published visibility for non-owners
        if (data.status !== 'published' && data.owner !== me) {
          setErr('This gig is not public.');
          return;
        }

        if (!mounted) return;
        setGig(data as Gig);
        setIsOwner(!!me && data.owner === me);
      } catch (e:any) {
        if (mounted) setErr(e.message ?? 'Error loading gig');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <p style={{padding:16}}>Loading…</p>;
  if (err) return <p style={{padding:16}}>⚠️ {err}</p>;
  if (!gig) return <p style={{padding:16}}>Not found</p>;

  return (
    <main style={{maxWidth:720,margin:'24px auto',padding:'16px'}}>
      <h1>{gig.title}</h1>
      {gig.description && <p>{gig.description}</p>}
      <p>Budget: {gig.budget ?? '—'} | Location: {gig.location ?? '—'} | Status: {gig.status}</p>
      {isOwner && <p><a href={`/gigs/${gig.id}/edit`}>Edit gig</a></p>}
    </main>
  );
}

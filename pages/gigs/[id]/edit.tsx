import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import GigForm from '@/components/GigForm';
import Banner from '@/components/ui/Banner';
import Spinner from '@/components/ui/Spinner';

export default function GigEditPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const [{ data: u }, { data, error }] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from('gigs').select('*').eq('id', id).maybeSingle()
        ]);
        if (error) throw error;
        if (!data) { setMsg('Gig not found'); return; }
        const me = u.user?.id ?? null;
        if (data.owner !== me) { setMsg('You are not allowed to edit this gig.'); return; }
        if (!mounted) return;
        setGig(data);
        setAllowed(true);
      } catch (e:any) {
        if (mounted) setMsg(e.message ?? 'Error'); 
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (values: any) => {
    const { error } = await supabase
      .from('gigs')
      .update({
        title: values.title,
        description: values.description,
        budget: values.budget,
        city: values.city,
        image_url: values.image_url ?? null,
      })
      .eq('id', id);
    if (error) throw error;
    router.push(`/gigs/${id}`);
  };

  if (loading) return <Spinner />;
  if (!allowed) return <Banner kind="error">{msg ?? 'Not allowed'}</Banner>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-subtle">Gigs / Edit gig</p>
      <h1>Edit gig</h1>
      <GigForm
        initialGig={gig}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

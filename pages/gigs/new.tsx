import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import GigForm from '@/components/GigForm';
import { uploadPublicFile } from '@/lib/storage';
import { useRequireUser } from '@/lib/useRequireUser';
import { isAccessDenied } from '@/utils/errors';
import Banner from '@/components/ui/Banner';
import { hasApprovedOrder } from '@/utils/billing';

export default function NewGig() {
  const router = useRouter();
  const { ready, userId } = useRequireUser();
  const [rlsDenied, setRlsDenied] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ready || !userId) return;
    (async () => {
      const ok = await hasApprovedOrder(userId);
      setAllowed(ok);
      setChecking(false);
      if (!ok)
        router.replace(
          '/billing?message=' + encodeURIComponent('Complete payment to post jobs.')
        );
    })();
  }, [ready, userId, router]);

  const handleSubmit = async (values: any) => {
    setRlsDenied(false);
    const { data, error } = await supabase
      .from('gigs')
      .insert({
        title: values.title,
        description: values.description,
        budget: values.budget,
        city: values.city,
        image_url: values.image_url ?? null,
        owner: values.owner,
      })
      .select()
      .single();
    if (error) {
      if (isAccessDenied(error)) {
        setRlsDenied(true);
        return;
      }
      throw error;
    }
    router.push(`/gigs/${data.id}`);
  };

  const handleFileUpload = async (file: File) => {
    return await uploadPublicFile(file, 'gigs');
  };

  if (!ready || checking) return null;
  if (!allowed) return <p data-testid="paywall-redirect">Redirecting...</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-subtle">Gigs / Post job</p>
      <h1>Post a Job</h1>
      {rlsDenied && <Banner kind="error">Only job posters can post</Banner>}
      <GigForm
        initialGig={{}}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        submitLabel="Create Gig"
      />
    </div>
  );
}

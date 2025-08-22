import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import GigForm from '@/components/GigForm';
import { uploadPublicFile } from '@/lib/storage';
import { useRequireUser } from '@/lib/useRequireUser';
import { isAccessDenied } from '@/utils/errors';
import Banner from '@/components/ui/Banner';

export default function NewGig() {
  const router = useRouter();
  const { ready } = useRequireUser();
  const [rlsDenied, setRlsDenied] = useState(false);

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

  if (!ready) return null;

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

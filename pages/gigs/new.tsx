import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import GigForm from '@/components/GigForm';
import { uploadPublicFile } from '@/lib/storage';
import { useRequireUser } from '@/lib/useRequireUser';
import { isAccessDenied } from '@/utils/errors';

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
    <div>
      <h1 className="text-3xl font-bold mb-1">Post a Job</h1>
      {rlsDenied && <p className="text-sm text-red-600 mb-4">Only job posters can post</p>}
      <GigForm
        initialGig={{}}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        submitLabel="Create Gig"
      />
    </div>
  );
}

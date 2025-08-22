import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import GigForm from '../../../components/GigForm';
import { uploadPublicFile } from '../../../lib/storage';

export default function EditGig() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [gig, setGig] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('gigs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setGig(data);
      });
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

  const handleFileUpload = async (file: File) => {
    return await uploadPublicFile(file, 'gigs');
  };

  if (error) return <p className="p-4">{error}</p>;
  if (!gig) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Gig</h1>
      <GigForm
        initialGig={gig}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        submitLabel="Save"
      />
    </div>
  );
}

import { useRouter } from 'next/router';
import { useState } from 'react';
import supabase from '../../utils/supabaseClient';
import GigForm from '../../components/GigForm';
import useRequireUser from '../../lib/useRequireUser';
import { uploadPublicFile } from '../../lib/storage';

export default function NewGig() {
  const router = useRouter();
  const { user, ready } = useRequireUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!ready) return null;

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('gigs')
      .insert({
        title: values.title,
        description: values.description,
        budget: values.budget ? parseFloat(values.budget) : null,
        city: values.city,
        image_url: values.image_url ?? null,
      })
      .select()
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
    } else if (data) {
      router.push(`/gigs/${data.id}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    return await uploadPublicFile(file, 'gigs');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Post a Gig</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <GigForm
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        submitLabel={loading ? 'Submitting...' : 'Create Gig'}
      />
    </div>
  );
}

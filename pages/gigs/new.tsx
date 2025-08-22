import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import GigForm from '../../components/GigForm';
import { uploadPublicFile } from '../../lib/storage';

export default function NewGig() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
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
    if (error) throw error;
    router.push(`/gigs/${data.id}`);
  };

  const handleFileUpload = async (file: File) => {
    return await uploadPublicFile(file, 'gigs');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Post a Gig</h1>
      <GigForm
        initialGig={{}}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        submitLabel="Create Gig"
      />
    </div>
  );
}

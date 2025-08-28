import { useRouter } from 'next/router';
import GigForm from './GigForm';
import { getSupabaseBrowser } from '@/lib/supabase.client';

interface Props {
  gig: any;
}

export default function Editor({ gig }: Props) {
  const router = useRouter();
  if (!gig) return null;
  return (
    <GigForm
      initial={gig}
      onSubmit={async (g) => {
        const supabase = getSupabaseBrowser();
        if (!supabase) return;
        await supabase.from('gigs').update(g).eq('id', gig.id);
        router.push(`/gigs/${gig.id}`);
      }}
    />
  );
}

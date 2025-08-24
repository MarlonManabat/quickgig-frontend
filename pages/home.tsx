import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import HomeSeeker from '@/components/home/HomeSeeker';
import HomeEmployer from '@/components/home/HomeEmployer';

export default function HomePage() {
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const { data, error } = await supabase.from('gigs').select('id').eq('owner', user.id).limit(1);
      setIsEmployer(!error && data && data.length > 0);
    })();
  }, []);

  if (isEmployer === null) return <div className="p-4">Loading…</div>;
  return isEmployer ? <HomeEmployer /> : <HomeSeeker />;
}

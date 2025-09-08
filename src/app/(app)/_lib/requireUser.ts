import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { getServerSupabase } from '@/lib/supabase-server';

export async function requireUser() {
  const supabase = getServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) {
    const h = headers();
    const url = h.get('x-url') || h.get('referer') || ROUTES.home;
    let path = '/';
    try {
      path = new URL(url, 'https://quickgig.ph').pathname || ROUTES.home;
    } catch {
      path = ROUTES.home;
    }
    redirect(`${ROUTES.login}?next=${encodeURIComponent(path)}`);
  }
  return { supabase, user };
}

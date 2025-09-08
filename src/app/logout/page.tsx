import { cookies } from 'next/headers';
import ClientLogout from './ClientLogout';

export const dynamic = 'force-dynamic';

export default async function LogoutPage() {
  // Best-effort: clear server cookies so SSR reads as logged-out.
  const jar = cookies();
  try {
    (['sb-access-token', 'sb-refresh-token', 'qg_next'] as const).forEach((n) => {
      // @ts-ignore – cookie typings differ across Next versions
      jar.delete(n);
    });
  } catch {}
  // Render a client component to clear Supabase localStorage & redirect home.
  return <ClientLogout />;
}

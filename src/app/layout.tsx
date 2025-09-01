import '@/styles/globals.css';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { ensureTicketsRow, getTicketBalance } from '@/lib/tickets';
import { userIdFromCookie } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'QuickGig App',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const uid = await userIdFromCookie();
  if (uid) await ensureTicketsRow(uid);
  const balance = uid ? await getTicketBalance(uid) : 0;
  return (
    <html lang="en">
      <body>
        <AppHeader balance={balance} />
        {children}
      </body>
    </html>
  );
}

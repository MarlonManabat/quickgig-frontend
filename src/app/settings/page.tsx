import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import HeadSEO from '@/components/HeadSEO';
import { env } from '@/config/env';
import SettingsForm from './SettingsForm';

function requireAuthSSR() {
  const token = cookies().get(env.JWT_COOKIE_NAME!);
  if (!token) {
    redirect('/login?return=/settings');
  }
}

export default function SettingsPage() {
  if (!env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    notFound();
  }
  requireAuthSSR();
  return (
    <>
      <HeadSEO title="Settings • QuickGig" />
      <SettingsForm />
    </>
  );
}

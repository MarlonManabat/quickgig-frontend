import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import HeadSEO from '@/components/HeadSEO';
import { env } from '@/config/env';
import SettingsForm from './SettingsForm';

export default function SettingsPage() {
  if (!env.NEXT_PUBLIC_ENABLE_SETTINGS) {
    notFound();
  }
  const token = cookies().get(env.JWT_COOKIE_NAME);
  if (!token) {
    redirect('/login?return=/settings');
  }
  return (
    <>
      <HeadSEO title="Settings • QuickGig" />
      <SettingsForm />
    </>
  );
}


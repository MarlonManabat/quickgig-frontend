import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { env } from '@/config/env';
import { getPrefs, savePrefs } from '@/lib/prefs';
import type { UserPrefs, EmailPrefs } from '@/types/prefs';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from '@/lib/toast';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!env.NEXT_PUBLIC_ENABLE_SETTINGS)
    return { notFound: true } as const;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/session/me`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    if (!res.ok) {
      return {
        redirect: {
          destination: `/login?return=/settings`,
          permanent: false,
        },
      } as const;
    }
  } catch {
    return {
      redirect: { destination: `/login?return=/settings`, permanent: false },
    } as const;
  }
  return { props: {} } as const;
};

export default function SettingsPage() {
  const [copy, setCopy] = useState<UserPrefs['copy']>('english');
  const [emails, setEmails] = useState<EmailPrefs>('ops_only');

  useEffect(() => {
    const p = getPrefs();
    setCopy(p.copy);
    setEmails(p.emails);
  }, []);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePrefs({ copy, emails });
    toast(t('settings.toast.saved'));
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
      <Head>
        <title>{t('settings.title')} | QuickGig</title>
      </Head>
      <main className="qg-container py-8 max-w-xl">
        <Card className="p-6" hover={false}>
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">{t('settings.title')}</h1>
            <form onSubmit={onSave} className="space-y-6">
              <div>
                <p className="font-medium mb-2">{t('settings.language.label')}</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="copy"
                      value="english"
                      checked={copy === 'english'}
                      onChange={() => setCopy('english')}
                    />
                    English
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="copy"
                      value="taglish"
                      checked={copy === 'taglish'}
                      onChange={() => setCopy('taglish')}
                    />
                    Taglish
                  </label>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">{t('settings.emails.label')}</p>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="emails"
                      value="all"
                      checked={emails === 'all'}
                      onChange={() => setEmails('all')}
                    />
                    {t('settings.emails.all')}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="emails"
                      value="ops_only"
                      checked={emails === 'ops_only'}
                      onChange={() => setEmails('ops_only')}
                    />
                    {t('settings.emails.ops_only')}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="emails"
                      value="none"
                      checked={emails === 'none'}
                      onChange={() => setEmails('none')}
                    />
                    {t('settings.emails.none')}
                  </label>
                </div>
              </div>
              <Button type="submit">{t('settings.saved')}</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

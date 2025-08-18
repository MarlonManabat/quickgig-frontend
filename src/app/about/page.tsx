import type { Metadata } from 'next';
import { t } from '@/lib/i18n';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'About QuickGig',
  description: env.NEXT_PUBLIC_ENABLE_I18N_POLISH
    ? 'Learn how QuickGig connects gig workers and employers fast.'
    : 'QuickGig connects gigs and talent fast.',
};

export default function AboutPage() {
  const enable = env.NEXT_PUBLIC_ENABLE_I18N_POLISH;
  return (
    <main className="qg-container py-12">
      <h1 className="text-3xl font-heading mb-4" data-testid="about-heading">
        {enable ? t('marketing.about.heading') : 'About QuickGig'}
      </h1>
      <p className="text-lg font-body" data-testid="about-tagline">
        {enable
          ? t('marketing.about.body')
          : 'QuickGig connects gig workers with employers fast.'}
      </p>
    </main>
  );
}


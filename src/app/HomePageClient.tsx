'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, MousePointerClick, Shield } from 'lucide-react';
import { checkHealth } from '@/lib/api';
import { track } from '@/lib/track';
import { env } from '@/config/env';
import { t } from '@/lib/i18n';

type ApiStatus = 'loading' | 'ok' | 'error';

export default function HomePageClient() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  useEffect(() => {
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('view_home');
    checkHealth()
      .then((res) => setStatus(res.ok ? 'ok' : 'error'))
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  const enable = env.NEXT_PUBLIC_ENABLE_I18N_POLISH;
  const features = enable
    ? [
        { title: t('marketing.home.features.post'), icon: Briefcase },
        { title: t('marketing.home.features.apply'), icon: MousePointerClick },
        { title: t('marketing.home.features.secure'), icon: Shield },
      ]
    : [
        { title: 'Post a gig in minutes', icon: Briefcase },
        { title: 'Apply with one tap', icon: MousePointerClick },
        { title: 'Secure messaging & updates', icon: Shield },
      ];

  return (
    <div>
      <section className="hero text-fg">
        <div className="qg-container text-center py-24">
          <h1 className="font-heading text-6xl font-bold mb-4">QuickGig</h1>
          <p
            className="font-body text-xl mb-8 text-fg opacity-90"
            data-testid="home-tagline"
          >
            {enable ? t('marketing.home.tagline') : 'Gigs and talent, matched fast.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg"
                data-cta="signup"
                data-testid="home-primary-cta"
              >
                {enable ? t('marketing.home.cta.primary') : 'Simulan Na!'}
              </Button>
            </Link>
            <Link href="/find-work">
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-fg text-fg hover:bg-fg hover:text-bg"
                data-cta="browse-jobs"
                data-testid="home-secondary-cta"
              >
                {enable ? t('marketing.home.cta.secondary') : 'Browse Jobs'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-bg">
        <div className="qg-container py-2 flex justify-center">
          {status === 'loading' ? (
            <span className="text-sm text-fg opacity-80">Checking API…</span>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-fg ${
                status === 'ok' ? 'bg-primary' : 'bg-red-600'
              }`}
            >
              API: {status === 'ok' ? 'OK' : 'ERROR'}
            </span>
          )}
        </div>
      </div>

      <section className="py-20">
        <div className="qg-container grid gap-8 md:grid-cols-3">
          {features.map(({ title, icon: Icon }) => (
            <Card key={title} className="text-center">
              <CardContent className="flex flex-col items-center">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold text-fg">
                  {title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


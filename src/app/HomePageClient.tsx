'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, MousePointerClick, Shield } from 'lucide-react';
import { checkHealth } from '@/lib/api';

type ApiStatus = 'loading' | 'ok' | 'error';

export default function HomePageClient() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  useEffect(() => {
    checkHealth()
      .then((res) => setStatus(res.ok ? 'ok' : 'error'))
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  const features = [
    { title: 'Post a gig in minutes', icon: Briefcase },
    { title: 'Apply with one tap', icon: MousePointerClick },
    { title: 'Secure messaging & updates', icon: Shield },
  ];

  return (
    <div>
      <section className="hero text-fg">
        <div className="qg-container text-center py-24">
          <h1 className="font-heading text-6xl font-bold mb-4">QuickGig</h1>
          <p className="font-body text-xl mb-8 text-fg opacity-90">
            Gigs and talent, matched fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" prefetch={false}>
              <Button size="lg" variant="secondary" className="text-lg">
                Open the app
              </Button>
            </Link>
            <Link href="/health-check">
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-fg text-fg hover:bg-fg hover:text-bg"
              >
                Health check
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


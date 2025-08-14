'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, MousePointerClick, Shield } from 'lucide-react';
import { safeFetch } from '@/lib/api';

export const metadata = {
  title: 'QuickGig',
  description: 'Gigs and talent, matched fast.',
};

type ApiStatus = 'loading' | 'ok' | 'error';

export default function HomePage() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  useEffect(() => {
    async function check() {
      try {
        const res = await safeFetch('/health');
        if (!res.ok) throw new Error(String(res.status));
        const data = JSON.parse(res.body);
        if (data?.status === 'ok' || data?.message === 'QuickGig API') setStatus('ok');
        else setStatus('error');
      } catch {
        setStatus('error');
      }
    }
    check();
  }, []);

  const features = [
    { title: 'Post a gig in minutes', icon: Briefcase },
    { title: 'Apply with one tap', icon: MousePointerClick },
    { title: 'Secure messaging & updates', icon: Shield },
  ];

  return (
    <div>
      <section className="qg-hero bg-gradient-to-br from-qg-primary via-qg-primary-dark to-qg-navy text-white">
        <div className="qg-container text-center py-24">
          <h1 className="font-heading text-5xl font-bold mb-4">QuickGig</h1>
          <p className="font-body text-xl mb-8 text-white/90">
            Gigs and talent, matched fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.quickgig.ph"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" className="text-lg">
                Open the app
              </Button>
            </a>
            <Link href="/health-check">
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-white text-white hover:bg-white hover:text-qg-navy"
              >
                Health check
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-gray-100">
        <div className="qg-container py-2 flex justify-center">
          {status === 'loading' ? (
            <span className="text-sm text-gray-600">Checking API…</span>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                status === 'ok' ? 'bg-green-600' : 'bg-red-600'
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
                <Icon className="h-10 w-10 text-qg-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold text-qg-navy">
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


'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { env } from '@/config/env';

type ApiStatus = 'loading' | 'ok' | 'error';

export default function MarketingHome() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  useEffect(() => {
    if (env.NEXT_PUBLIC_SHOW_API_BADGE) {
      fetch('/api/health-check')
        .then((res) => setStatus(res.ok ? 'ok' : 'error'))
        .catch(() => setStatus('error'));
    }
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="wordmark">QuickGig</div>
        <p className="headline">Kahit saan sa Pinas, may gig para sa’yo!</p>
        <p className="subheadline">Gigs and talent, matched fast.</p>
        <div className="cta-group">
          <Link href="/register" className="btn primary">
            Simulan Na!
          </Link>
          <Link href="/find-work" className="btn secondary">
            Browse Jobs
          </Link>
        </div>
      </section>
      {env.NEXT_PUBLIC_SHOW_API_BADGE && (
        <div className="api-badge">
          {status === 'loading'
            ? 'Checking API…'
            : `API: ${status === 'ok' ? 'OK' : 'ERROR'}`}
        </div>
      )}
      <section className="features">
        <div className="feature">
          <span className="icon">📝</span>Post gig in minutes
        </div>
        <div className="feature">
          <span className="icon">⚡</span>Apply with one tap
        </div>
        <div className="feature">
          <span className="icon">🔒</span>Secure messaging
        </div>
      </section>
    </div>
  );
}

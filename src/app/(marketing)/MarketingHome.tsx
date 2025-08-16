'use client';

import Link from 'next/link';

export default function MarketingHome() {

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

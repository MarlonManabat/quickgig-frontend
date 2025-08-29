import Link from 'next/link';
import LandingHeader from '@/components/landing/Header';
import { appHref } from '@/lib/appOrigin';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="...">
        <h1>
          Kahit saan sa Pinas, <span className="accent">may gig para sa'yo!</span>
        </h1>
        <p>
          Ang pinakamabilis na paraan para makahanap ng trabaho o mag-hire ng skilled professionals. Dito sa QuickGig.ph, madali lang!
        </p>
        <div className="actions">
          <Link href={appHref('/')} prefetch={false} className="btn btn-primary">
            Simulan na
          </Link>
          <Link href={appHref('/find')} prefetch={false} className="btn btn-secondary">
            Browse jobs
          </Link>
        </div>
      </main>
    </>
  );
}

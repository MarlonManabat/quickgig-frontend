import Link from 'next/link';
import LandingHeader from '@/components/landing/Header';

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ||
  'https://app.quickgig.ph';

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
          <Link href={`${APP_ORIGIN}/`} prefetch={false} className="btn btn-primary">
            Simulan na
          </Link>
          <Link href={`${APP_ORIGIN}/find`} prefetch={false} className="btn btn-secondary">
            Browse jobs
          </Link>
        </div>
      </main>
    </>
  );
}

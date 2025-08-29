import Link from 'next/link';
import { appHref } from '@/lib/appOrigin';

export default function LandingHero() {
  return (
    <section className="...">
      <Link href={appHref('/')} prefetch={false} className="btn btn-primary">
        Simulan na
      </Link>
      <Link href={appHref('/find')} prefetch={false} className="btn btn-secondary">
        Browse jobs
      </Link>
      {/* If you show a “Mag-post ng Gig” button here, link it too */}
      {/* <Link href={appHref('/post')} prefetch={false} className="btn">Mag-post ng Gig</Link> */}
    </section>
  );
}

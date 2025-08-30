import Link from 'next/link';
import { withAppOrigin } from '@/lib/url';

export default function LandingHero() {
  return (
    <section className="...">
      <Link href={withAppOrigin('/')} prefetch={false} className="btn btn-primary">
        Simulan na
      </Link>
      <Link href={withAppOrigin('/find')} prefetch={false} className="btn btn-secondary">
        Browse jobs
      </Link>
      {/* If you show a “Mag-post ng Gig” button here, link it too */}
      {/* <Link href={withAppOrigin('/post')} prefetch={false} className="btn">Mag-post ng Gig</Link> */}
    </section>
  );
}

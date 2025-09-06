import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function MainNav() {
  return (
    <nav className="flex gap-4">
      <Link href="/gigs" className="hover:underline">
        Find Work
      </Link>
      <Link href={ROUTES.postJob} className="hover:underline">
        Post a Gig
      </Link>
      <Link href="/owner/gigs" className="hover:underline">
        My Gigs
      </Link>
    </nav>
  );
}

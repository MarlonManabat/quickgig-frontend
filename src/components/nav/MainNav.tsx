import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/app/lib/routes';

export default function MainNav() {
  return (
    <nav className="flex gap-4">
      <LinkApp href={ROUTES.BROWSE_JOBS} className="hover:underline">
        Find Work
      </LinkApp>
      <LinkApp href={ROUTES.GIGS_CREATE} className="hover:underline">
        Post a Gig
      </LinkApp>
      <Link href="/owner/gigs" className="hover:underline">
        My Gigs
      </Link>
    </nav>
  );
}

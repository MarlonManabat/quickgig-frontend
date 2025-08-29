import Link from 'next/link';
import { appHref } from '@/lib/appOrigin';

export default function LandingHeader() {
  return (
    <nav className="...">
      <Link
        href={appHref('/find')}
        prefetch={false}
        className="..."
      >
        Find work
      </Link>
      <Link
        href={appHref('/post')}
        prefetch={false}
        className="..."
      >
        Post job
      </Link>
      <Link
        href={appHref('/login')}
        prefetch={false}
        className="..."
      >
        Login
      </Link>
    </nav>
  );
}

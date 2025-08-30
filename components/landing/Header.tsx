import Link from 'next/link';
import { withAppOrigin } from '@/lib/url';

export default function LandingHeader() {
  return (
    <nav className="...">
      <Link
        href={withAppOrigin('/find')}
        prefetch={false}
        className="..."
      >
        Find work
      </Link>
      <Link
        href={withAppOrigin('/post')}
        prefetch={false}
        className="..."
      >
        Post job
      </Link>
      <Link
        href={withAppOrigin('/login')}
        prefetch={false}
        className="..."
      >
        Login
      </Link>
    </nav>
  );
}

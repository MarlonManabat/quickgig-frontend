import { appHref } from '@/lib/appLinks';

export default function LandingHeader() {
  return (
    <nav className="...">
      <a
        href={appHref('/find')}
        className="..."
        data-e2e="hdr-findwork"
      >
        Find work
      </a>
      <a
        href={appHref('/post')}
        className="..."
        data-e2e="hdr-postjob"
      >
        Post job
      </a>
      <a
        href={appHref('/login')}
        className="..."
        data-e2e="hdr-login"
      >
        Login
      </a>
    </nav>
  );
}

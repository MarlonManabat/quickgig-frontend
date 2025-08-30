import { withAppOrigin } from '@/lib/url';

export default function LandingHeader() {
  return (
    <nav className="...">
      <a href={withAppOrigin('/find')} className="...">
        Find work
      </a>
      <a href={withAppOrigin('/post')} className="...">
        Post job
      </a>
      <a href={withAppOrigin('/login')} className="...">
        Login
      </a>
    </nav>
  );
}

import { appHref } from '@/lib/appOrigin';

export default function LandingHeader() {
  return (
    <nav className="...">
      <a href={appHref('/find')} className="...">Find work</a>
      <a href={appHref('/post')} className="...">Post job</a>
      <a href={appHref('/login')} className="...">Login</a>
    </nav>
  );
}

import { appUrl } from '@/lib/urls';
import LandingCTAs from '@/components/landing/LandingCTAs';

export default function LandingHeader() {
  return (
    <nav className="...">
      <LandingCTAs
        findClassName="hover:underline"
        postClassName="btn btn-primary"
      />
      <a href={appUrl('/login')} className="...">
        Login
      </a>
    </nav>
  );
}

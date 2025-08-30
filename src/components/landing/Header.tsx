import { withAppOrigin } from '@/lib/url';
import LandingCTAs from '@/components/landing/LandingCTAs';

export default function LandingHeader() {
  return (
    <nav className="...">
      <LandingCTAs
        findClassName="hover:underline"
        postClassName="btn btn-primary"
      />
      <a href={withAppOrigin('/login')} className="...">
        Login
      </a>
    </nav>
  );
}

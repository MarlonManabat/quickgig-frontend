import { appHref } from '@/lib/appLinks';

export default function LandingHero() {
  return (
    <section className="...">
      <a
        href={appHref('/')}
        className="btn-primary"
        data-e2e="cta-start"
      >
        Simulan na
      </a>
      <a
        href={appHref('/find')}
        className="btn-secondary"
        data-e2e="cta-browse"
      >
        Browse jobs
      </a>
    </section>
  );
}

import { appHref } from '@/lib/appLinks';

export default function LandingHero() {
  return (
    <section className="...">
      <a href={appHref('/')} className="btn btn-primary">Simulan na</a>
      <a href={appHref('/find')} className="btn btn-secondary">Browse jobs</a>
    </section>
  );
}

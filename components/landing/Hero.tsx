import { appHref } from '@/lib/appOrigin';

export default function LandingHero() {
  return (
    <section className="...">
      <a href={appHref('/')} className="btn btn-primary">Simulan na</a>
      <a href={appHref('/find')} className="btn btn-secondary">Browse jobs</a>
      {/* If you show a “Mag-post ng Gig” button here, link it too */}
      {/* <a href={appHref('/post')} className="btn">Mag-post ng Gig</a> */}
    </section>
  );
}

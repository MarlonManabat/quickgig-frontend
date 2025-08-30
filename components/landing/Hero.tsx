import { withAppOrigin } from '@/lib/url';

export default function LandingHero() {
  return (
    <section className="...">
      <a href={withAppOrigin('/')} className="btn btn-primary">
        Simulan na
      </a>
      <a href={withAppOrigin('/find')} className="btn btn-secondary">
        Browse jobs
      </a>
      {/* If you show a “Mag-post ng Gig” button here, link it too */}
      {/* <a href={withAppOrigin('/post')} className="btn">Mag-post ng Gig</a> */}
    </section>
  );
}

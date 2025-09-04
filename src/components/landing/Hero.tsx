import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

export default function LandingHero() {
  return (
    <section className="...">
      <div className="flex gap-3">
        <LinkApp
          href={ROUTES.browseJobs}
          data-testid="hero-browse-jobs"
          className="px-4 py-2 rounded-md bg-gray-100"
        >
          Browse jobs
        </LinkApp>
        <LinkApp
          href={ROUTES.login}
          data-testid="hero-sign-in"
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Simulan Na!
        </LinkApp>
      </div>
    </section>
  );
}

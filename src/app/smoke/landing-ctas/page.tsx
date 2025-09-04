import LinkApp from "@/components/LinkApp";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Smoke: Landing CTAs",
};

export default function SmokeLandingCTAs() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Smoke: Landing CTAs</h1>
      <div className="flex flex-col gap-3">
        <LinkApp data-testid="hero-browse-jobs" href={ROUTES.browseJobs}>
          Browse Jobs
        </LinkApp>
        <LinkApp data-testid="hero-post-job" href={ROUTES.gigsCreate}>
          Post a job
        </LinkApp>
      </div>
    </main>
  );
}


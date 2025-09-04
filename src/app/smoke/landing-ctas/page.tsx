import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/app/lib/routes";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Smoke: Landing CTAs",
};

export default function SmokeLandingCTAs() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Smoke: Landing CTAs</h1>
      <div className="flex flex-col gap-3">
        <Link data-testid="cta-find-work" href={ROUTES.GIGS_BROWSE}>Find Work</Link>
        <Link data-testid="cta-browse-jobs" href={ROUTES.GIGS_BROWSE}>Browse Jobs</Link>
        <Link data-testid="cta-post-job" href={ROUTES.GIGS_CREATE}>Post a job</Link>
        <Link data-testid="cta-my-applications" href={ROUTES.APPLICATIONS}>My Applications</Link>
      </div>
    </main>
  );
}


// Static, zero-dependency placeholder to avoid server errors until employer flow ships.
// Intentionally no server calls, env reads, or suspense boundaries.
// This keeps the /post-job -> /gigs/create redirect smoke-safe.

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const GeoSelectCore = dynamic(
  () => import("@/components/location/GeoSelectCore"),
  { ssr: false },
);

function useLocalEvent() {
  // Minimal client-only "analytics" that won't affect CI or require network.
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    try {
      const key = "qq_employer_intent_count";
      const prev = Number(localStorage.getItem(key) ?? "0");
      const next = prev + 1;
      localStorage.setItem(key, String(next));
      setCount(next);
    } catch {
      /* ignore storage issues */
    }
  }, []);

  return count;
}

export default function CreateGigPage() {
  const intentCount = useLocalEvent();

  const handleNotifyClick = useCallback(() => {
    try {
      // Stash a flag we can read later to offer email capture once implemented.
      localStorage.setItem("qq_employer_notify_me", "1");
      // Lightweight UX feedback—no toast lib required.
      alert("Thanks! We’ll notify you here when posting goes live.");
    } catch {
      // no-op
    }
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Create a gig</h1>
      <p className="mt-4 text-gray-600" data-testid="post-job-skeleton">
        Employer posting is <span className="font-medium">coming soon</span>.
        We&apos;re finishing payments, review, and publishing. In the meantime,
        you can browse candidate activity and our sample jobs.
      </p>

      <GeoSelectCore />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/browse-jobs"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
          data-testid="cta-back-to-browse"
        >
          Back to Browse Jobs
        </Link>
        <button
          onClick={handleNotifyClick}
          className="inline-block rounded border border-gray-300 px-4 py-2"
          data-testid="cta-notify"
          type="button"
        >
          Notify me when ready
        </button>
      </div>

      <div className="mt-10 rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium">Why am I seeing this page?</p>
        <p className="mt-2">
          You reached this page from <code>/post-job</code>, which redirects to{" "}
          <code>/gigs/create</code>. We keep the route live for navigation and
          testing, but the publisher is disabled until launch.
        </p>
        <p className="mt-2">
          (Psst—internal note: employer intent count ={" "}
          <span data-testid="employer-intent-count">{intentCount}</span>)
        </p>
      </div>
    </main>
  );
}

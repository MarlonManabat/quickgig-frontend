import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSeekerApplications } from "@/hooks/useSeekerApplications";
import { useSuggestedJobs } from "@/hooks/useSuggestedJobs";
import AvatarUploader from "@/components/profile/AvatarUploader";

export default function HomeSeeker() {
  const [uid, setUid] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUid(data.user?.id ?? "");
    });
  }, []);
  const { profile, loading: loadingProfile } = useUserProfile(uid);
  const { apps, loading: loadingApps } = useSeekerApplications(uid);
  const { jobs, loading: loadingJobs } = useSuggestedJobs(profile?.city);

  const isEmpty = useMemo(() => (apps?.length ?? 0) === 0, [apps]);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <AvatarUploader />
        <div>
          <h1 className="text-2xl font-semibold">
            {`Welcome${profile?.first_name ? `, ${profile.first_name}` : ""}!`}
          </h1>
          {!isEmpty && (
            <p className="text-sm text-gray-600">
              You have {apps?.length} active application
              {(apps?.length ?? 0) > 1 ? "s" : ""}.
            </p>
          )}
          <p data-testid="ticket-balance" className="text-sm text-gray-600">
            Ticket balance: {profile?.tickets ?? 0}
          </p>
        </div>
      </header>

      {/* Body */}
      {loadingApps || loadingProfile ? (
        <div className="animate-pulse rounded-2xl border p-5 bg-white">
          Loading your dashboard…
        </div>
      ) : isEmpty ? (
        <section className="rounded-2xl border p-5 bg-white">
          <h2 className="text-lg font-medium mb-2">Let’s get you hired</h2>
          <p className="text-sm text-gray-600 mb-4">
            Wala ka pang applications. Start by browsing jobs in your city or
            online.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/find?focus=search"
              className="qg-btn qg-btn--primary px-4 py-2 rounded-xl"
            >
              Browse jobs
            </Link>
            <Link
              href="/profile"
              className="qg-btn qg-btn--outline px-4 py-2 rounded-xl"
            >
              Complete profile
            </Link>
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-lg font-medium mb-3">Your applications</h2>
          <div className="space-y-2">
            {apps?.map((a) => (
              <div
                key={a.id}
                className="border rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {a.job_title ?? a.gig_title ?? "Job"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Status: {a.status ?? "pending"}
                  </div>
                </div>
                <Link
                  href={`/jobs/${a.job_id ?? a.gig_id}`}
                  className="text-sm text-blue-600 underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested jobs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Suggested jobs for you</h2>
          <Link
            href="/find?focus=search"
            className="text-sm text-blue-600 underline"
          >
            See all
          </Link>
        </div>
        {loadingJobs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(jobs ?? []).map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className="border rounded-xl p-3 hover:shadow-sm"
              >
                <div className="font-medium line-clamp-1">{j.title}</div>
                <div className="text-xs text-gray-600">
                  {j.city ?? "Online"}
                </div>
                {j.budget != null && (
                  <div className="text-sm mt-1">
                    ₱{Number(j.budget).toLocaleString()}
                  </div>
                )}
              </Link>
            ))}
            {(!jobs || jobs.length === 0) && (
              <div className="text-sm text-gray-600">No suggestions yet.</div>
            )}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-medium mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/find?focus=search"
            className="border rounded-xl p-4 hover:shadow-sm"
          >
            Browse jobs
          </Link>
          <Link
            href="/messages"
            className="border rounded-xl p-4 hover:shadow-sm"
          >
            Messages
          </Link>
          <Link
            href="/profile"
            className="border rounded-xl p-4 hover:shadow-sm"
          >
            Edit profile
          </Link>
        </div>
      </section>
    </div>
  );
}

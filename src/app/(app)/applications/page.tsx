import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { requireUser } from "@/lib/auth/requireUser";
import { getServerSupabase as getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplicationsPage() {
  // Auth-gated route: redirect unauthenticated users to /login (contract).
  const { user } = await requireUser(ROUTES.applications); // include next param

  // Still tolerate missing Supabase envs in preview by guarding the fetch.
  let applications: any[] = [];
  try {
    const supabase = getSupabaseServer?.();
    if (supabase) {
      const { data: rows } = await supabase
        .from("applications")
        .select("id,status,created_at,job:jobs(id,title)")
        .eq("worker_id", user.id)
        .order("created_at", { ascending: false });
      applications = rows ?? [];
    }
  } catch {}

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      {applications.length > 0 ? (
        <ul data-testid="applications-list" className="space-y-3">
          {applications.map((a: any) => (
            <li key={a.id} data-testid="application-row" className="rounded-xl border p-4">
              <div className="font-medium">
                <Link href={`/jobs/${a.job?.id}`}>{a.job?.title}</Link>
              </div>
              <div className="text-sm">{a.status}</div>
              <div className="text-sm opacity-70">{new Date(a.created_at).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          data-testid="applications-empty"
          data-qa="applications-empty"
          className="opacity-70 space-y-3"
        >
          <p>No applications yet. Start from <Link
            href={ROUTES.browseJobs}
            data-cta="browse-jobs-from-empty"
            data-testid="browse-jobs-from-empty"
            className="underline"
          >
            Browse Jobs
          </Link>.</p>
        </div>
      )}
    </div>
  );
}

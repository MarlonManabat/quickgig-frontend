import "server-only";

import { headers, cookies } from "next/headers";

type JobLike = {
  id?: string | number | null;
  title?: string | null;
  company?: string | null;
  location?: string | null;
};

// Build an absolute URL that respects the current request host so that
// server-side fetches and rendered anchors stay on the same origin.
function hostAware(path: string) {
  const hdrs = headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "";
  if (!host) return path;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${proto}://${host}${normalised}`;
}

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
  let items: JobLike[] = [];
  try {
    const res = await fetch(hostAware("/api/applications/list"), {
      cache: "no-store",
      headers: { cookie: cookies().toString() },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.items)) {
        items = data.items as JobLike[];
      }
    }
  } catch {
    items = [];
  }

  const normalized = items
    .map((job) => {
      if (job?.id == null) return null;
      const id = String(job.id);
      return {
        id,
        title: job.title ?? undefined,
        company: job.company ?? undefined,
        location: job.location ?? undefined,
      };
    })
    .filter((job): job is { id: string; title?: string; company?: string; location?: string } => Boolean(job));

  if (normalized.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <div className="mt-6 rounded border border-dashed p-6 text-center text-slate-600" data-testid="applications-empty">
          You haven’t applied to any jobs yet.
        </div>
        {process.env.NODE_ENV !== "production" && (
          <form method="post" action="/api/applications/clear" className="mt-4">
            <button
              type="submit"
              className="rounded bg-gray-200 px-3 py-2 text-sm"
              data-testid="applications-clear"
            >
              Clear list
            </button>
          </form>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      <ul className="mt-6 space-y-3" data-testid="applications-list">
        {normalized.map((job) => {
          const title = job.title?.trim() || `Job #${job.id}`;
          const subtitle = [job.company, job.location].filter(Boolean).join(" • ");
          return (
            <li key={job.id} className="rounded border p-4" data-testid="application-row">
              <div className="font-medium">{title}</div>
              {subtitle ? <div className="text-sm text-gray-600">{subtitle}</div> : null}
              <a className="text-blue-600 underline" href={hostAware(`/browse-jobs/${encodeURIComponent(job.id)}`)}>
                View details
              </a>
            </li>
          );
        })}
      </ul>
      {process.env.NODE_ENV !== "production" && (
        <form method="post" action="/api/applications/clear" className="mt-4">
          <button
            type="submit"
            className="rounded bg-gray-200 px-3 py-2 text-sm"
            data-testid="applications-clear"
          >
            Clear list
          </button>
        </form>
      )}
    </main>
  );
}

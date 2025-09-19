import Link from "next/link";

import ApplyButton from "@/components/ApplyButton";
import { hasApplied } from "@/lib/applications";
import { isAuthedServer } from "@/lib/auth";
import { hostAware } from "@/lib/hostAware";
import { fetchJob } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const authed = isAuthedServer();
  const id = params.id;
  const job = await fetchJob(id);

  const jobMissing = !job;
  const applied = jobMissing ? false : hasApplied(job.id);

  const detailPath = `/browse-jobs/${encodeURIComponent(String(id))}`;
  const loginFallback = hostAware(`/login?next=${encodeURIComponent(detailPath)}`);

  let applyHref = loginFallback;
  if (job) {
    if (job.applyUrl) {
      applyHref = hostAware(job.applyUrl);
    } else if (authed) {
      applyHref = hostAware("/applications");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{jobMissing ? "Job details" : job.title}</h1>
      {!jobMissing && (
        <div className="text-sm text-gray-600">
          {job.company ?? "—"} • {job.location ?? "Anywhere"}
        </div>
      )}
      <p className="mt-6 whitespace-pre-wrap">
        {jobMissing
          ? "We couldn’t load this job right now, but you can still start the apply flow and finish after signing in."
          : job.description ?? ""}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <ApplyButton
          href={applyHref}
          jobId={jobMissing ? undefined : job.id}
          title={job?.title}
          disabled={jobMissing}
        />
        {!jobMissing && applied && (
          <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
            You’ve applied to this job
          </span>
        )}
      </div>
      <div className="mt-8">
        <Link className="text-blue-600 underline" href="/browse-jobs">
          Back to list
        </Link>
      </div>
    </main>
  );
}

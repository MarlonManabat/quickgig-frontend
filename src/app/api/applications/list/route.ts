import { NextResponse } from "next/server";
import { readApplications } from "@/lib/applications";
import { fetchJob } from "@/lib/jobs";
import { MOCK_JOB_BY_ID } from "@/mocks/jobs";

type JobResult = Awaited<ReturnType<typeof fetchJob>>;

export async function GET() {
  const { ids } = readApplications();
  const items = (
    await Promise.all(
      ids.map(async (id) => {
        try {
          const job = await fetchJob(id);
          if (job) return job;
        } catch {
          // ignore failures and fall back to mock lookup
        }
        return MOCK_JOB_BY_ID(id) ?? null;
      }),
    )
  ).filter((job): job is NonNullable<JobResult> => Boolean(job));

  return NextResponse.json({ ok: true, items });
}

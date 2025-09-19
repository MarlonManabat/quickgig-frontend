import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { recordApplication } from "@/lib/applications";

export async function POST(req: NextRequest) {
  let jobId: string | number | null = null;
  try {
    const body = await req.json();
    if (body && (body.jobId ?? body.id) != null) {
      jobId = body.jobId ?? body.id;
    }
  } catch {
    // ignore invalid JSON and fall through to error response
  }

  if (jobId == null) {
    return NextResponse.json({ ok: false, error: "missing jobId" }, { status: 400 });
  }

  try {
    const store = recordApplication(jobId);
    return NextResponse.json({ ok: true, ids: store.ids });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}

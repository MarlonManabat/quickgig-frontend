// @ts-nocheck
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createServerClientSafe } from "@/lib/supabase/server";

export default async function JobsPage() {
  const supabase = createServerClientSafe();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[jobs] load error:", error);
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Unable to load jobs</h1>
        <p className="mt-2 opacity-70">Please try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>
      <ul className="space-y-3">
        {jobs?.map((j) => (
          <li key={j.id} className="rounded-xl border p-4">
            <div className="font-medium">{j.title}</div>
            <div className="opacity-70 text-sm">{j.company ?? "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

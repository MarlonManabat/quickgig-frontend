// @ts-nocheck
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/routes";

export default async function ApplicationsPage() {
  const supabase = supabaseServer();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  const user = userRes?.user;

  if (userErr || !user) {
    redirect(`${ROUTES.login}?next=${ROUTES.applications}`);
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[applications] load error:", error);
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Unable to load applications</h1>
        <p className="mt-2 opacity-70">Please try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <ul className="space-y-3">
        {(applications ?? []).map((a) => (
          <li key={a.id} className="rounded-xl border p-4">
            <div className="font-medium">{a.job_title ?? a.job_id}</div>
            <div className="opacity-70 text-sm">Status: {a.status ?? "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

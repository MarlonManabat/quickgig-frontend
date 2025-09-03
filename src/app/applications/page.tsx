// @ts-nocheck
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ApplicationsPage() {
  const supabase = supabaseServer();
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  const user = userRes?.user;

  if (userErr || !user) {
    redirect("/login");
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[applications] load error:", error);
    return (
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Unable to load applications</h1>
        <p className="mt-2 opacity-70">Please try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-6">
      <h1 className="mb-4 text-2xl font-semibold">My Applications</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(applications ?? []).map((a) => (
          <li key={a.id} className="rounded-lg border p-3">
            <div className="font-medium">{a.job_title ?? a.job_id}</div>
            <div className="text-sm opacity-70">Status: {a.status ?? '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

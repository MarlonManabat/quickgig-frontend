import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Applicants() {
  const { ready, userId } = useRequireUser();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [rows, setRows] = useState<any[]>([]);
  const [gig, setGig] = useState<any>(null);

  useEffect(() => {
    if (!ready || !id) return;
    (async () => {
      const g = await supabase.from("gigs").select("*").eq("id", id).single();
      setGig(g.data ?? null);
      const { data } = await supabase
        .from("applications")
        .select("id, worker, cover_letter, status, created_at, profiles!inner(full_name, avatar_url)")
        .eq("gig_id", id)
        .order("created_at", { ascending: false });
      const apps = data ?? [];
      const withLatest = await Promise.all(apps.map(async (a:any)=>{
        const { data: msg } = await supabase.from("messages").select("created_at").eq("application_id", a.id).order("created_at", { ascending: false }).limit(1).single();
        return { ...a, latest_message: msg?.created_at };
      }));
      setRows(withLatest);
    })();
  }, [ready, id]);

  async function setStatus(appId: number, status: "accepted"|"rejected") {
    await supabase.from("applications").update({ status }).eq("id", appId);
    setRows((r)=>r.map(x=>x.id===appId?{...x,status}:x));
  }

  if (!ready || !gig) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-3">Applicants — {gig.title}</h1>
      <ul className="space-y-3">
        {rows.map((a) => {
          const last = typeof window !== "undefined" ? localStorage.getItem(`app:lastSeen:${a.id}`) : null;
          const unread = a.latest_message && (!last || new Date(a.latest_message).getTime() > Number(last));
          return (
            <li key={a.id} className="rounded border border-slate-800 p-4 bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.profiles?.full_name ?? "Applicant"}</div>
                  <div className="text-sm opacity-80">status: {a.status}</div>
                  {a.cover_letter && <p className="mt-2 opacity-90 whitespace-pre-wrap">{a.cover_letter}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  {unread && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <Link href={`/applications/${a.id}`} className="rounded bg-slate-700 px-3 py-1">Open Thread</Link>
                  {a.status !== "accepted" && (
                    <button onClick={()=>setStatus(a.id,"accepted")}
                            className="rounded bg-green-500 text-black px-3 py-1">Accept</button>
                  )}
                  {a.status !== "rejected" && (
                    <button onClick={()=>setStatus(a.id,"rejected")}
                            className="rounded bg-slate-700 px-3 py-1">Reject</button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {rows.length === 0 && <p>No applicants yet.</p>}
      </ul>
    </Shell>
  );
}


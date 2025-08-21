import { useRequireUser } from "@/lib/useRequireUser";
import Shell from "@/components/Shell";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ApplyGig() {
  const { ready, userId } = useRequireUser();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [gig, setGig] = useState<any>(null);
  const [cover, setCover] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !id) return;
    supabase.from("gigs").select("*").eq("id", id).single().then(({data}) => setGig(data));
  }, [ready, id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.from("applications").insert({
      gig_id: Number(id),
      worker: userId,
      cover_letter: cover || null,
    });
    if (error) setMsg(error.message);
    else {
      setMsg("Applied! View your applications in Dashboard.");
      setCover("");
    }
  }

  if (!ready || !gig) return <Shell><p>Loading…</p></Shell>;
  if (gig.hidden) return <Shell><p>This gig is unavailable.</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-2">Apply to: {gig.title}</h1>
      <form onSubmit={submit} className="max-w-xl space-y-3">
        <textarea
          rows={6}
          placeholder="Short cover letter (optional)"
          value={cover}
          onChange={(e)=>setCover(e.target.value)}
          className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2" />
        <button className="rounded bg-yellow-400 text-black font-medium px-4 py-2">Send Application</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
      <p className="mt-4 text-sm opacity-80"><Link className="underline" href={`/gigs/${gig.id}`}>Back to gig</Link></p>
    </Shell>
  );
}


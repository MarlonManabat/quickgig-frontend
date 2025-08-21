import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import { supabase } from "@/lib/supabaseClient";
import { uploadPublicFile } from "@/lib/storage";

export default function EditGig() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const { ready } = useRequireUser();

  const [gig, setGig] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !id) return;
    (async () => {
      const { data, error } = await supabase.from("gigs").select("*").eq("id", id).single();
      if (!error) setGig(data);
    })();
  }, [ready, id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase
      .from("gigs")
      .update({
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        city: gig.city,
        image_url: gig.image_url || null,
      })
      .eq("id", gig.id);
    setMsg(error ? error.message : "Saved!");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadPublicFile(f, "gigs");
      setGig((g: any) => ({ ...g, image_url: url }));
    } catch (err: any) {
      setMsg(err.message ?? String(err));
    }
  }

  if (!ready || !gig) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Edit Gig</h1>
      <form onSubmit={save} className="max-w-xl space-y-3">
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               value={gig.title ?? ""} onChange={(e)=>setGig({...gig, title:e.target.value})}/>
        <textarea className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2" rows={5}
               value={gig.description ?? ""} onChange={(e)=>setGig({...gig, description:e.target.value})}/>
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="Budget" value={gig.budget ?? ""} onChange={(e)=>setGig({...gig, budget: e.target.value})}/>
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="City" value={gig.city ?? ""} onChange={(e)=>setGig({...gig, city:e.target.value})}/>
        <div className="space-y-2">
          {gig.image_url && <img src={gig.image_url} className="rounded max-h-48 object-cover" />}
          <input type="file" accept="image/*" onChange={onFile}/>
        </div>
        <button className="rounded bg-yellow-400 text-black font-medium px-4 py-2">Save</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </Shell>
  );
}

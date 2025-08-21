import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Shell from "@/components/Shell";
import { useRouter } from "next/router";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setMsg("Please login first.");

    const { data, error } = await supabase
      .from("gigs")
      .insert({ owner: user.id, title, description, budget: budget === "" ? null : Number(budget), city, image_url: imageUrl })
      .select("id")
      .single();

    if (error) setMsg(error.message);
    else {
      setMsg("Posted!");
      router.push(`/gigs/${data.id}`);
    }
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={submit} className="max-w-xl space-y-3">
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2" required
               placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2" rows={5}
               placeholder="Description" value={description} onChange={(e)=>setDesc(e.target.value)} />
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="Budget (optional)" value={budget} onChange={(e)=>setBudget(e.target.value as any)} />
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="City (optional)" value={city} onChange={(e)=>setCity(e.target.value)} />
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="Image URL (optional)" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
        <button className="rounded bg-yellow-400 text-black font-medium px-4 py-2">Publish</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </Shell>
  );
}

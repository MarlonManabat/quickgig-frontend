import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import Shell from "@/components/Shell";
import { useRouter } from "next/router";
import { useRequireUser } from "@/lib/useRequireUser";
import { uploadPublicFile } from "@/lib/storage";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const { ready, userId } = useRequireUser();
  const [eligible, setEligible] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/users/me/eligibility').then(r => r.json()).then(d => setEligible(d.canPost)).catch(()=>setEligible(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const { data, error } = await supabase
      .from("gigs")
      .insert({ owner: userId, title, description, budget: budget === "" ? null : Number(budget), city, image_url: imageUrl })
      .select("id")
      .single();

    if (error) setMsg(error.message);
    else {
      setMsg("Posted!");
      router.push(`/gigs/${data.id}`);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadPublicFile(f, "gigs");
      setImageUrl(url);
    } catch (err: any) {
      setMsg(err.message ?? String(err));
    }
  }

  if (!ready || eligible === null) return <Shell><p>Loading…</p></Shell>;
  if (!eligible) return <Shell><p>Please buy a ticket first. <a className="underline" href="/checkout">Go to checkout</a>.</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={submit} className="max-w-xl space-y-3">
        <input className="input" required
               placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="input" rows={5}
               placeholder="Description" value={description} onChange={(e)=>setDesc(e.target.value)} />
        <input className="input"
               placeholder="Budget (optional)" value={budget} onChange={(e)=>setBudget(e.target.value as any)} />
        <input className="input"
               placeholder="City (optional)" value={city} onChange={(e)=>setCity(e.target.value)} />
        <div className="space-y-2">
          {imageUrl && <img src={imageUrl} className="rounded max-h-48 object-cover" />}
          <input type="file" accept="image/*" onChange={onFile} />
        </div>
        <button className="btn-primary">Publish</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </Shell>
  );
}

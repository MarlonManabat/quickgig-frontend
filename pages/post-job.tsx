import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import Shell from "@/components/Shell";
import { useRouter } from "next/router";
import { useRequireUser } from "@/lib/useRequireUser";
import { uploadPublicFile } from "@/lib/storage";
import { hasApprovedOrder } from "@/utils/billing";
import Link from "next/link";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const { ready, userId, timedOut } = useRequireUser();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ready || !userId) return;
    (async () => {
      const ok = await hasApprovedOrder(userId);
      setAllowed(ok);
      setChecking(false);
      if (!ok)
        router.replace(
          '/billing?message=' + encodeURIComponent('Complete payment to post jobs.')
        );
    })();
  }, [ready, userId, router]);

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

  if (!ready || checking)
    return (
      <Shell>
        {timedOut ? (
          <p>
            Hindi ma-load ang auth.{' '}
            <Link className="underline" href="/auth">
              Go to Login
            </Link>
          </p>
        ) : (
          <p>Loading…</p>
        )}
      </Shell>
    );
  if (!allowed) return <Shell><p data-testid="paywall-redirect">Redirecting...</p></Shell>;

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

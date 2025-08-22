import { useRequireUser } from "@/lib/useRequireUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function ApplyGig() {
  const { ready, userId } = useRequireUser();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [gig, setGig] = useState<any>(null);
  const [cover, setCover] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready || !id) return;
    supabase.from("gigs").select("*").eq("id", id).single().then(({ data }) => setGig(data));
  }, [ready, id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
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
    setSaving(false);
  }

  if (!ready || !gig) return <p>Loading…</p>;
  if (gig.hidden) return <p>This gig is unavailable.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Apply to: {gig.title}</h1>
      <form onSubmit={submit} className="max-w-xl space-y-3">
        <textarea
          rows={6}
          placeholder="Short cover letter (optional)"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="input"
        />
        <button
          className="btn-primary"
          disabled={saving}
        >
          {saving ? <Spinner /> : 'Send Application'}
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
      <p className="mt-4 text-sm text-brand-subtle"><Link className="underline" href={`/gigs/${gig.id}`}>Back to gig</Link></p>
    </div>
  );
}

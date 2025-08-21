import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Shell from "@/components/Shell";
import { listReviewsForUser } from "@/lib/reviews";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [ratingAvg, setRatingAvg] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, rating_avg, rating_count")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setRatingAvg(data.rating_avg ?? null);
        setRatingCount(data.rating_count ?? null);
      }

      const { data: revs } = await listReviewsForUser(user.id);
      setReviews(revs ?? []);
      setLoading(false);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setStatus("Please login.");

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, avatar_url: avatarUrl });
    setStatus(error ? error.message : "Saved!");
  }

  if (loading) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={save} className="max-w-md space-y-3">
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="Full name" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
        <input className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2"
               placeholder="Avatar URL" value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} />
        <button className="rounded bg-yellow-400 text-black font-medium px-4 py-2">Save</button>
      </form>
      {status && <p className="mt-3">{status}</p>}
      {ratingCount !== null && (
        <p className="mt-4">Rating: {ratingAvg ?? 0} ⭐ ({ratingCount})</p>
      )}
      {reviews.length > 0 && (
        <ul className="mt-2 space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded border border-slate-700 p-2">
              <div>Rating: {'★'.repeat(r.rating)}</div>
              {r.comment && <p className="text-sm">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRequireUser } from "@/lib/useRequireUser";
import { uploadAvatar } from "@/lib/avatar";
import { getBalance } from "@/lib/tickets";

export default function Home() {
  const { ready, userId, timedOut } = useRequireUser();
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hasApps, setHasApps] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!ready || !userId) return;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("role_pref, avatar_url")
        .eq("id", userId)
        .single();
      setProfile(prof);
      if (prof?.role_pref === "employer") {
        const { data: js } = await supabase
          .from("jobs")
          .select("id,title")
          .eq("owner", userId)
          .order("created_at", { ascending: false });
        setJobs(js ?? []);
        const bal = await getBalance(userId);
        setBalance(bal);
      } else if (prof?.role_pref === "worker") {
        const { data: ap } = await supabase
          .from("applications")
          .select("id")
          .eq("applicant_id", userId)
          .limit(1);
        setHasApps((ap ?? []).length > 0);
      }
    })();
  }, [ready, userId]);

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !userId) return;
    setUploading(true);
    try {
      await uploadAvatar(f);
      const { data: prof } = await supabase
        .from("profiles")
        .select("role_pref, avatar_url")
        .eq("id", userId)
        .single();
      setProfile(prof);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  if (!ready)
    return <p className="p-6">{timedOut ? "Auth timeout" : "Loading..."}</p>;
  if (!profile) return <p className="p-6">Loading...</p>;

  const avatar =
    profile.avatar_url || "https://via.placeholder.com/80?text=%3F";

  if (profile.role_pref === "worker") {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <input type="file" onChange={onAvatar} disabled={uploading} />
        </div>
        {!hasApps && (
          <div className="border rounded p-4">
            <p className="mb-2">Wala ka pang applications.</p>
            <div className="flex gap-2">
              <Link
                href="/profile"
                className="qg-btn qg-btn--primary px-4 py-2"
              >
                Complete profile
              </Link>
              <Link href="/find" className="qg-btn qg-btn--outline px-4 py-2">
                Find jobs near you
              </Link>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <input type="file" onChange={onAvatar} disabled={uploading} />
      </div>
      <div className="border rounded p-4 space-y-2">
        <p>Ticket balance: {balance}</p>
        <Link href="/post" className="qg-btn qg-btn--primary px-4 py-2">
          Post a job
        </Link>
      </div>
      {jobs.length > 0 && (
        <ul className="space-y-2">
          {jobs.map((j) => (
            <li key={j.id} className="border rounded p-3">
              {j.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

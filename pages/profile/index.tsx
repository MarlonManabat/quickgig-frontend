import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { hasMockSession } from "@/lib/session";
import { toStr } from "@/lib/normalize";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const nextTarget = (router.query.next as string) || "/home";

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user && !hasMockSession()) {
        router.replace(`/login?next=${encodeURIComponent("/profile")}`);
        return;
      }
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("first_name, city, avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (data) {
          setFirstName(toStr(data.first_name) ?? "");
          setCity(toStr(data.city) ?? "");
          setAvatarUrl(toStr(data.avatar_url));
        }
      }
      setLoading(false);
    })();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (hasMockSession() || user) {
      if (user) {
        await supabase
          .from("profiles")
          .update({
            first_name: firstName,
            city,
            avatar_url: avatarUrl,
          })
          .eq("id", user.id);
      }
      router.replace(nextTarget);
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="mx-auto max-w-lg p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Complete your profile</h1>
      <form onSubmit={onSave} className="space-y-3">
        <label className="block">
          <span className="text-sm">First name (required)</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">City (required)</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Avatar (optional)</span>
          <input
            type="url"
            value={avatarUrl ?? ""}
            onChange={(e) => setAvatarUrl(e.target.value || null)}
            placeholder="https://…"
            className="w-full border rounded px-3 py-2"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" data-testid="profile-save" className="qg-btn qg-btn--primary px-4 py-2">
            Save & continue
          </button>
          <button
            type="button"
            onClick={() => router.replace(nextTarget)}
            className="qg-btn qg-btn--white px-4 py-2"
          >
            Skip for now
          </button>
        </div>
      </form>
    </main>
  );
}

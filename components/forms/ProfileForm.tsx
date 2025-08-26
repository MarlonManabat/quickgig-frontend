import { useState } from "react";
import { useRouter } from "next/router";
import { getBrowserClient } from "@/lib/supabase/browser";
import { validateAvatarFile, uploadAvatar } from "@/lib/storage/avatars";

export default function ProfileForm() {
  const supabase = getBrowserClient();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = (f?: File) => {
    if (!f) return;
    if (!validateAvatarFile(f)) {
      alert("PNG/JPG only, max 2MB");
      return;
    }
    setFile(f);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let avatar_url: string | null = null;
    try {
      if (file) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          avatar_url = await uploadAvatar(supabase, user.id, file);
        }
      }
      const res = await fetch("/api/profile/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, avatar_url }),
      });
      if (!res.ok) alert("Failed to save profile");
      else router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Avatar (PNG/JPG, ≤2 MB)</label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      <button
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Save
      </button>
    </form>
  );
}

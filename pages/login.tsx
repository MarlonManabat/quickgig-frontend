import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Shell from "@/components/Shell";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/profile` } });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Login / Sign up</h1>
      {sent ? (
        <p className="text-brand-success">Magic link sent! Check your email.</p>
      ) : (
        <form onSubmit={signIn} className="max-w-md space-y-3">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button className="btn-primary">Send Magic Link</button>
          {error && <p className="text-brand-danger">{error}</p>}
        </form>
      )}
      <button
        onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
        className="mt-6 text-sm underline"
      >
        Sign out
      </button>
    </Shell>
  );
}

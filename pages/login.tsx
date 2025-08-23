import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { copy } from "@/copy";
import FormShell from "@/components/FormShell";
import EmailField from "@/components/fields/EmailField";

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
    <FormShell title={`${copy.auth.loginTitle} / ${copy.auth.signup}`}> 
      {sent ? (
        <p className="text-brand-success">Magic link sent! Check your email.</p>
      ) : (
        <form onSubmit={signIn} className="space-y-3">
          <EmailField
            required
            label={copy.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            testId="auth-email"
          />
          <button className="btn-primary" type="submit">{copy.auth.login}</button>
          {error && <p className="text-brand-danger">{error}</p>}
        </form>
      )}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
        className="mt-6 text-sm underline"
      >
        Sign out
      </button>
    </FormShell>
  );
}

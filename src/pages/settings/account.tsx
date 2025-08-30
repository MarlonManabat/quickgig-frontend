import { useState } from "react";
import { requestAccountDeletion } from "@/lib/support";
import { notifyDeletionRequested } from "@/lib/emailSupport";
import { supabase } from "@/lib/supabaseClient";
import { asString } from "@/lib/normalize";

export default function AccountSettings() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure? This will disable your account now and schedule your data for deletion.",
      )
    )
      return;
    setBusy(true);
    try {
      await requestAccountDeletion();

      // optional: email the user (if profile email is present client-side)
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .limit(1)
        .maybeSingle();
      const email = asString(data?.email);
      if (email) await notifyDeletionRequested(email);

      // sign out locally
      await supabase.auth.signOut();
      setDone(true);
    } catch (e) {
      console.error(e);
      alert("Could not process deletion request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <section className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Delete account</h2>
        <p className="text-sm text-gray-600 mb-3">
          This disables your account immediately and schedules your data for
          deletion after {process.env.ACCOUNT_RETENTION_DAYS ?? 30} days.
        </p>
        <button
          disabled={busy || done}
          onClick={handleDelete}
          className="qg-btn qg-btn--white px-4 py-2"
          data-testid="account-delete"
        >
          {done
            ? "Deletion scheduled"
            : busy
              ? "Processing..."
              : "Delete my account"}
        </button>
      </section>
    </main>
  );
}

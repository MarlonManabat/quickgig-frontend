import { useState } from "react";
import { submitSupportTicket } from "@/lib/support";
import { notifySupportSubmission } from "@/lib/emailSupport";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    setBusy(true);
    try {
      await submitSupportTicket(
        subject.trim(),
        body.trim(),
        email.trim() || undefined,
      );
      if (
        process.env.NEXT_PUBLIC_SUPPORT_RECEIVER_EMAIL ||
        process.env.SUPPORT_RECEIVER_EMAIL
      ) {
        await notifySupportSubmission(
          process.env.NEXT_PUBLIC_SUPPORT_RECEIVER_EMAIL ??
            process.env.SUPPORT_RECEIVER_EMAIL!,
          subject.trim(),
        );
      }
      setOk(true);
      setSubject("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Could not submit support ticket.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      {ok && (
        <div className="mb-4 rounded bg-green-50 p-3 text-green-700">
          Thanks! We received your message.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded p-2 h-32"
          placeholder="How can we help?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button
          disabled={busy}
          className="qg-btn qg-btn--primary px-4 py-2"
          data-testid="support-submit"
        >
          {busy ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}

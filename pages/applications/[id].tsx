import Shell from "@/components/Shell";
import MessageItem from "@/components/MessageItem";
import MessageComposer from "@/components/MessageComposer";
import { useRequireUser } from "@/lib/useRequireUser";
import { supabase } from "@/lib/supabaseClient";
import { subscribeToMessages } from "@/lib/realtime";
import { markThreadRead } from "@/lib/reads";
import { createReview } from "@/lib/reviews";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function ApplicationThread() {
  const { ready, userId } = useRequireUser();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [app, setApp] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [offer, setOffer] = useState<any>(null);
  const [tab, setTab] = useState<"messages" | "offer" | "status">("messages");
  const listRef = useRef<HTMLDivElement>(null);
  const [reviewed, setReviewed] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isOwner = app && userId && app.owner === userId;
  const isWorker = app && userId && app.worker === userId;

  async function loadApp() {
    if (!id) return;
    const { data } = await supabase
      .from("applications")
      .select("*, gigs(id,title)")
      .eq("id", id)
      .single();
    if (!data || (userId && data.owner !== userId && data.worker !== userId)) {
      setApp(null);
      return;
    }
    setApp(data);
  }

  async function loadMessages() {
    if (!id) return;
    const { data } = await supabase
      .from("messages")
      .select("id, body, sender, created_at, profiles:sender(full_name)")
      .eq("application_id", id)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  }

  async function loadOffer() {
    if (!id) return;
    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    setOffer(data ?? null);
  }

  async function loadReview() {
    if (!id || !userId) return;
    const { data } = await supabase
      .from("reviews")
      .select("id")
      .eq("app_id", id)
      .eq("reviewer", userId)
      .maybeSingle();
    setReviewed(!!data);
  }

  useEffect(() => {
    if (!ready || !id || !userId) return;

    const init = async () => {
      await loadApp();
      await loadMessages();
      await loadOffer();
      await loadReview();
      await markThreadRead(id, userId);
    };
    init();

    const off = subscribeToMessages(id, (row) => {
      setMessages((prev) => [...prev, row]);
      if (row.sender && row.sender !== userId) {
        markThreadRead(id, userId).catch(() => {});
      }
      queueMicrotask(() => listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }));
    });

    return () => off();
  }, [ready, id, userId]);

  async function sendMessage(body: string) {
    await supabase
      .from("messages")
      .insert([{ application_id: id, sender: userId, body }])

    const recipient = isOwner ? app.worker : app.owner
    if (recipient) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", recipient)
        .single()
      if (prof?.email) {
        fetch("/api/notify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: prof.email,
            subject: "New message on QuickGig",
            html: `<p>You have a new message.</p><p><a href="${window.location.origin}/applications/${id}">View conversation</a></p>`,
          }),
        }).catch(() => {})
      }
    }
  }

  async function createOffer(amount: string, notes: string) {
    await supabase
      .from("offers")
      .insert([
        {
          application_id: id,
          created_by: userId,
          amount: amount ? Number(amount) : null,
          notes: notes || null,
        },
      ])
    const recipient = isOwner ? app.worker : app.owner
    if (recipient) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", recipient)
        .single()
      if (prof?.email) {
        fetch("/api/notify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: prof.email,
            subject: "New offer on QuickGig",
            html: `<p>You have a new offer.</p><p><a href="${window.location.origin}/applications/${id}">View offer</a></p>`,
          }),
        }).catch(() => {})
      }
    }
    loadOffer()
  }

  async function decide(status: "accepted" | "declined") {
    if (!offer) return;
    await supabase
      .from("offers")
      .update({ status, decided_at: new Date().toISOString() })
      .eq("id", offer.id)
      .eq("status", "pending");
    await loadOffer();
    await loadApp();
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const reviewee = isOwner ? app.worker : app.owner;
    if (!reviewee || !id) return;
    await createReview(Number(id), reviewee, rating, comment || undefined);
    setReviewed(true);
    setShowReview(false);
    setComment("");
    setRating(5);
  }

  if (!ready) return <Shell><p>Loading…</p></Shell>;
  if (!app) return <Shell><p>Not found.</p></Shell>;

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-4">Application — {app.gigs?.title}</h1>
      <div className="flex gap-4 mb-4 text-sm">
        <button onClick={() => setTab("messages")} className={tab === "messages" ? "font-semibold" : ""}>Messages</button>
        {(isOwner || offer) && <button onClick={() => setTab("offer")} className={tab === "offer" ? "font-semibold" : ""}>Offer</button>}
        <button onClick={() => setTab("status")} className={tab === "status" ? "font-semibold" : ""}>Status</button>
      </div>

      {tab === "messages" && (
        <div className="flex flex-col h-[60vh]">
          <div ref={listRef} className="flex-1 overflow-y-auto mb-2">
            {messages.map((m) => (
              <MessageItem key={m.id} msg={m} self={userId!} />
            ))}
          </div>
          <MessageComposer onSend={sendMessage} />
        </div>
      )}

      {tab === "offer" && (
        <div>
          {offer ? (
            <div className="mb-4">
              <div className="mb-2">Status: {offer.status}</div>
              {offer.amount && <div>Amount: {offer.amount}</div>}
              {offer.notes && <p className="whitespace-pre-wrap">{offer.notes}</p>}
              {offer.status === "pending" && isWorker && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => decide("accepted")} className="rounded bg-green-500 text-black px-3 py-1">Accept</button>
                  <button onClick={() => decide("declined")} className="rounded bg-slate-700 px-3 py-1">Decline</button>
                </div>
              )}
            </div>
          ) : (
            <p>No offer yet.</p>
          )}
          {isOwner && (
            <OfferForm onCreate={createOffer} />
          )}
        </div>
      )}

      {tab === "status" && (
        <div>
          <p>Application status: {app.status}</p>
          { (app.status === 'hired' || app.status === 'completed') && !reviewed && (
            <button onClick={() => setShowReview(true)} className="mt-2 rounded bg-yellow-400 text-black px-3 py-1">Leave a review</button>
          )}
        </div>
      )}
      {showReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form onSubmit={submitReview} className="w-80 space-y-2 rounded bg-white p-4 text-black">
            <div>
              <label className="mr-2">Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded border px-2 py-1">
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded border px-2 py-1"
              placeholder="Comment (optional)"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowReview(false)} className="px-3 py-1 rounded bg-slate-300">Cancel</button>
              <button type="submit" className="px-3 py-1 rounded bg-yellow-400 text-black">Submit</button>
            </div>
          </form>
        </div>
      )}
    </Shell>
  );
}

function OfferForm({ onCreate }: { onCreate: (amount: string, notes: string) => Promise<void> }) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [payoutReady, setPayoutReady] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) return setPayoutReady(false);
      const { data: p } = await supabase.from("profiles").select("stripe_payout_ready").eq("id", uid).single();
      setPayoutReady(!!p?.stripe_payout_ready);
    });
  }, []);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onCreate(amount, notes);
        setAmount("");
        setNotes("");
      }}
      className="space-y-2"
    >
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Amount"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Notes"
      />
      <button type="submit" disabled={payoutReady === false} className="rounded bg-yellow-400 text-black px-3 py-1 disabled:opacity-50">
        Create Offer
      </button>
      {payoutReady === false && (
        <p className="text-sm">
          <a href="/settings/payouts" className="underline">Connect payouts</a> to send offers.
        </p>
      )}
    </form>
  );
}

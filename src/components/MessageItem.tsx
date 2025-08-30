interface Message {
  id: number;
  body: string;
  sender: string;
  created_at: string;
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
}

export default function MessageItem({
  msg,
  self,
}: {
  msg: Message;
  self: string;
}) {
  async function report() {
    const reason = prompt("Why are you reporting this message?") || "";
    try {
      await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "message", target_id: msg.id, reason }),
      });
      alert("Reported");
    } catch (_) {}
  }

  return (
    <div className="mb-3">
      <div className="text-xs opacity-70">
        {msg.profiles?.full_name ?? msg.sender} •{" "}
        {new Date(msg.created_at).toLocaleString()}
      </div>
      <div className="whitespace-pre-wrap">{msg.body}</div>
      <button onClick={report} className="text-xs underline">
        Report
      </button>
    </div>
  );
}

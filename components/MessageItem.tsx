interface Message {
  id: number;
  body: string;
  sender: string;
  created_at: string;
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
}

export default function MessageItem({ msg, self }: { msg: Message; self: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs opacity-70">
        {msg.profiles?.full_name ?? msg.sender} • {new Date(msg.created_at).toLocaleString()}
      </div>
      <div className="whitespace-pre-wrap">{msg.body}</div>
    </div>
  );
}

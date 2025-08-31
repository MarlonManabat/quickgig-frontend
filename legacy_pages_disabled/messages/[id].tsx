import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import IdGate from "@/components/IdGate";
import MessageComposer from "@/components/MessageComposer";
import { supabase } from "@/utils/supabaseClient";
import { useThreadMessages } from "@/hooks/useThreadMessages";

export default function MessageThreadPage() {
  const router = useRouter();
  const { id } = router.query;
  const threadId = Array.isArray(id) ? id[0] : id;
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, []);

  const { items, setItems } = useThreadMessages(threadId, userId);

  return (
    <IdGate id={threadId} redirect="/messages">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {items.map((m) => (
            <div key={m.id} data-testid="chat-message">
              {m.body}
            </div>
          ))}
        </div>
        {threadId && userId && (
          <MessageComposer
            threadId={threadId}
            userId={userId}
            onSent={(m) => setItems((prev) => [...prev, m])}
          />
        )}
      </div>
    </IdGate>
  );
}

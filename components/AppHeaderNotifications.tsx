import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { timeAgo } from "@/utils/time";

type Row = { id: string; title: string; link: string | null; read: boolean; created_at: string };

export default function AppHeaderNotifications() {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    let ch: any = null;
    (async () => {
      const { data } = await supa.auth.getUser();
      const uid = data.user?.id || null;
      if (!uid) return;
      try {
        const { data: rows } = await supa
          .from("notifications")
          .select("id,title,link,read,created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(5);
        const list = (rows as any) || [];
        setItems(list);
        setUnread(list.filter((r: any) => !r.read).length);
      } catch {
        setItems([]);
        setUnread(0);
      }
      ch = supa
        .channel("notif-ch")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            setUnread((x) => x + 1);
            setItems((rows) => [payload.new as any, ...rows].slice(0, 5));
          },
        )
        .subscribe();
    })();
    return () => {
      if (ch) supa.removeChannel(ch);
    };
  }, []);

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="i-bell" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 text-xs rounded-full bg-red-500 text-white px-1">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-md z-50">
          <ul className="max-h-80 overflow-auto">
            {items.map((n) => (
              <li key={n.id} className="p-2 border-b last:border-0">
                {n.link ? (
                  <Link href={n.link} className="block text-sm">
                    {n.title}
                  </Link>
                ) : (
                  <span className="block text-sm">{n.title}</span>
                )}
                <div className="text-xs text-brand-subtle">{timeAgo(n.created_at)}</div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="p-2 text-sm">No notifications</li>
            )}
          </ul>
          <Link
            href="/notifications"
            className="block text-center text-sm p-2 underline"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}

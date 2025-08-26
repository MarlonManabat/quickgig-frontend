import useSWR from "swr";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function AppHeaderTickets() {
  const supabase = createClientComponentClient();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUid(user?.id ?? null);
    })();
  }, []);

  const { data } = useSWR(uid ? ["balance", uid] : null, async () => {
    const { data } = await supabase
      .from("tickets_balances")
      .select("balance")
      .eq("user_id", uid!)
      .maybeSingle();
    return data?.balance ?? 0;
  });

  if (!uid) return null;
  return (
    <Link
      href="/wallet"
      className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-sm bg-white/10 hover:bg-white/20"
    >
      🎟 {data ?? 0}
    </Link>
  );
}

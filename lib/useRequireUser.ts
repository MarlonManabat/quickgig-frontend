import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/router";

export function useRequireUser() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active && !ready) setTimedOut(true);
    }, 15000);
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (!session?.user) {
        router.replace(`/auth?next=${encodeURIComponent(router.asPath)}`);
        return;
      }
      clearTimeout(timer);
      setUserId(session.user.id);
      setReady(true);
    })();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router]);

  return { ready, userId, timedOut };
}

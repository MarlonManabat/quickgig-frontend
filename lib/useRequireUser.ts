import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/router";

export function useRequireUser() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace(`/auth?next=${encodeURIComponent(router.asPath)}`);
        return;
      }
      setUserId(session.user.id);
      setReady(true);
    })();
  }, [router]);

  return { ready, userId };
}

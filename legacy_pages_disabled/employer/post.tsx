import * as React from "react";
import PostGuardInline from "@/components/auth/PostGuardInline";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import CreatePostForm from "@/components/posts/CreatePostForm";

function useSupabaseSession() {
  const [session, setSession] = React.useState<any>(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const sb = getBrowserSupabase();
        if (!sb) { if (mounted) setSession(null); return; }
        const { data } = await sb.auth.getSession();
        if (mounted) setSession(data?.session ?? null);
      } catch {
        if (mounted) setSession(null);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return session;
}

export default function EmployerPostPage() {
  const session = useSupabaseSession();
  return (
    <PostGuardInline session={session}>
      <CreatePostForm />
    </PostGuardInline>
  );
}

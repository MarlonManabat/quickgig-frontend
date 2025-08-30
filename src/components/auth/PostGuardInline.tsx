import React from "react";
import Link from "next/link";

type SessionLike = { user?: unknown } | null;

export default function PostGuardInline({
  session,
  children,
}: {
  session: SessionLike;
  children: React.ReactNode;
}) {
  if (!session || !("user" in (session as any)) || !(session as any).user) {
    return (
      <div role="alert" aria-live="polite" className="max-w-xl mx-auto p-4">
        <p>please log in</p>
        <div className="mt-3">
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("next") ?? "/";
  let dest: URL;
  try {
    dest = new URL(target, url.origin);
  } catch {
    dest = new URL("/", url.origin);
  }
  if (dest.origin !== url.origin) {
    dest = new URL("/", url.origin);
  }

  const jar = cookies();
  [AUTH_COOKIE, "sb-access-token", "sb-refresh-token", "qg_next"].forEach(
    (n) => {
      try {
        // @ts-ignore – cookie typings differ across Next versions
        jar.delete(n);
      } catch {}
    },
  );
  return NextResponse.redirect(dest, { status: 302 });
}

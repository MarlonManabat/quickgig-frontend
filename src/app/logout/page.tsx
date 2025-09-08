import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  // Best-effort sign out: clear session cookies your auth uses, then redirect home.
  const jar = cookies();
  ["sb-access-token", "sb-refresh-token", "qg_next"].forEach((n) => {
    try {
      jar.delete(n);
    } catch {}
  });
  redirect("/");
}

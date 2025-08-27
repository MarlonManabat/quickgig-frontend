import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FindRedirect() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("focus")) params.set("focus", "search");
    router.replace(`/search?${params.toString()}`);
  }, [router]);
  return null;
}

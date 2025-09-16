import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES } from "@/lib/constants";

export function isAuthedServer(): boolean {
  const jar = cookies();
  return AUTH_COOKIE_NAMES.some((name) => {
    const value = jar.get(name)?.value;
    return typeof value === "string" && value.length > 0;
  });
}

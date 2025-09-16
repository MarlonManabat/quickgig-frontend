import { cookies } from "next/headers";
import { hasAuthCookies } from "@/lib/auth/cookies";

export function isAuthedServer(): boolean {
  const jar = cookies();
  return hasAuthCookies(jar);
}

import { cookies, headers } from "next/headers";
import { cookieDomainFor } from "@/lib/auth/cookies";
import { APPLICATIONS_COOKIE, APPLICATIONS_MAX } from "@/lib/constants";

export type ApplicationsStore = {
  ids: string[];
};

type MaybeIds = { ids?: unknown } | unknown;

type LegacyEntry = { id?: unknown; ts?: unknown } | string | number | null | undefined;

function toId(value: LegacyEntry): string | null {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") {
    const str = String(value).trim();
    return str ? str : null;
  }
  if (typeof value === "object" && "id" in value) {
    const raw = (value as { id?: unknown }).id;
    if (raw == null) return null;
    const str = String(raw).trim();
    return str ? str : null;
  }
  return null;
}

function uniqueIds(values: Array<LegacyEntry>): string[] {
  const deduped = new Set<string>();
  for (const value of values) {
    const id = toId(value);
    if (id) deduped.add(id);
  }
  return Array.from(deduped);
}

function parseStore(raw: string | undefined): ApplicationsStore {
  if (!raw) return { ids: [] };
  try {
    const parsed = JSON.parse(raw) as MaybeIds;
    if (Array.isArray(parsed)) {
      return { ids: uniqueIds(parsed).slice(0, APPLICATIONS_MAX) };
    }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { ids?: unknown }).ids)) {
      return { ids: uniqueIds((parsed as { ids: LegacyEntry[] }).ids).slice(0, APPLICATIONS_MAX) };
    }
  } catch {
    // ignore malformed data and fall back to empty
  }
  return { ids: [] };
}

function readStore(): ApplicationsStore {
  const jar = cookies();
  const raw = jar.get(APPLICATIONS_COOKIE)?.value;
  const store = parseStore(raw);
  return { ids: store.ids.slice(-APPLICATIONS_MAX) };
}

export function readApplications(): ApplicationsStore {
  return readStore();
}

export function readAppliedIdsFromCookie(): string[] {
  return readStore().ids;
}

export function hasApplied(id: string | number): boolean {
  const target = String(id);
  return readStore().ids.includes(target);
}

export function cookieOptionsForHost() {
  const host = headers().get("host") || "";
  const domain = cookieDomainFor(host.split(":")[0] ?? "");
  return {
    httpOnly: false as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    ...(domain ? { domain } : {}),
  };
}

export function writeApplications(nextIds: Array<string | number>) {
  const ids = Array.from(new Set(nextIds.map((value) => String(value)))).slice(-APPLICATIONS_MAX);
  const jar = cookies();
  jar.set(APPLICATIONS_COOKIE, JSON.stringify({ ids }), cookieOptionsForHost());
  return { ids } satisfies ApplicationsStore;
}

export function recordApplication(jobId: string | number) {
  const store = readStore();
  const target = String(jobId);
  if (store.ids.includes(target)) {
    return store;
  }
  return writeApplications([...store.ids, target]);
}

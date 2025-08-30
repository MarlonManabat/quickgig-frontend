export function getAppOrigin(): string {
  const fromPublic = process.env.NEXT_PUBLIC_APP_ORIGIN || "";
  const fromBuild  = process.env.APP_ORIGIN || "";
  const raw = (fromPublic || fromBuild || "").trim();
  // Ensure we have a scheme; if someone sets app.quickgig.ph, prefix https://
  const withScheme = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  return (withScheme || "").replace(/\/+$/, "");
}

export function withAppOrigin(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getAppOrigin();
  // If origin is empty (local dev), return p so local works.
  return origin ? `${origin}${p}`.replace(/([^:]\/)\/+/g, "$1") : p;
}

const requiredPublic = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;
const requiredServer = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

function missing(keys: readonly string[]) {
  return keys.filter((k) => !process.env[k]);
}

const missingPub = missing(requiredPublic);
const missingSrv = missing(requiredServer);

// Log once on the server; non-fatal for now (keeps previews usable)
if (typeof window === "undefined") {
  if (missingPub.length || missingSrv.length) {
    // Visible in Vercel logs
    console.error("[env] Missing required env vars:", {
      missingPublic: missingPub,
      missingServer: missingSrv,
    });
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database, Insert } from "@/types/db";
import { env, requireServer } from "@/lib/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const key = requireServer('SUPABASE_SERVICE_ROLE');
  if (!key) return res.status(500).end();
  const supa = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key);
  const { message, stack, path } = (req.body || {}) as {
    message?: string;
    stack?: string;
    path?: string;
  };
  try {
    await supa
      .from("client_errors")
      .insert([
        {
          message: message || "",
          stack_snippet: stack || null,
          path: path || null,
          ua: req.headers["user-agent"] || null,
          release: process.env.VERCEL_GIT_COMMIT_SHA || null,
        } satisfies Insert<"client_errors">,
      ]);
  } catch (e) {
    console.error("[errlog]", e);
  }
  res.status(200).json({ ok: true });
}

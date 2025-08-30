import type { NextApiRequest, NextApiResponse } from "next";
import { serialize, type CookieSerializeOptions } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.NODE_ENV !== "test") {
    res.status(404).end();
    return;
  }
  if (process.env.TEST_LOGIN_ENABLED !== "true") {
    res.status(404).end();
    return;
  }
  if (req.headers["x-test-secret"] !== process.env.TEST_LOGIN_SECRET) {
    res.status(401).end();
    return;
  }

  const role = (req.query.role as string) || "worker";
  const value = Buffer.from(JSON.stringify({ mock: true, role })).toString(
    "base64url",
  );

  const cookieOpts: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 30,
  };

  res.setHeader(
    "Set-Cookie",
    serialize("__qg_test_session", value, cookieOpts),
  );
  res.status(204).end();
}

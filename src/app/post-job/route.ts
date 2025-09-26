import { NextResponse } from "next/server";

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/gigs/create", req.url), 308);
}

export function HEAD(req: Request) {
  return NextResponse.redirect(new URL("/gigs/create", req.url), 308);
}

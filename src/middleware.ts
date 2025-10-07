import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Disabled middleware - allow all access
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // No protected routes - allow all access
  matcher: [],
};

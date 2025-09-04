"use client";
import Link, { LinkProps } from "next/link";
import { ROUTES } from "@/app/lib/routes";
import React from "react";

type Props = LinkProps & { "data-testid"?: string; children: React.ReactNode };
export default function LinkApp(p: Props) {
  // At runtime we could assert the href is one of ROUTES, but keep it light:
  return <Link {...p} />;
}

import { NextResponse } from "next/server";
import { ensureSignupBonus, getTicketBalance } from "@/lib/tickets";

export async function GET() {
  try {
    // Award free tickets once per user (idempotent), then return balance
    await ensureSignupBonus();
    const balance = await getTicketBalance();
    return NextResponse.json({ balance });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 400 });
  }
}

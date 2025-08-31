import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";

const StripeLib =
  process.env.CI === "true" || process.env.DISABLE_STRIPE === "1"
    ? require("../../../../stubs/stripe.js")
    : require("stripe");
const Stripe = StripeLib.default ?? StripeLib.Stripe ?? StripeLib;

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Missing signature");
    return;
  }

  const buf = await getRawBody(req);

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // TODO: handle event types (e.g., account.updated) and update DB flags such as payout_ready
  // For now, acknowledge receipt to keep skeleton stable
  res.json({ received: true, type: event.type });
}

export async function payWithStripe(amount: number): Promise<boolean> {
  try {
    const r = await fetch('/api/payments/mock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount, method: 'stripe' }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok;
  } catch {
    return false;
  }
}


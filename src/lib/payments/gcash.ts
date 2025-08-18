export async function payWithGcash(amount: number): Promise<boolean> {
  try {
    const r = await fetch('/api/payments/mock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount, method: 'gcash' }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok;
  } catch {
    return false;
  }
}


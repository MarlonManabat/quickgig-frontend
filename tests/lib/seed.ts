export async function seedApplication(baseUrl: string, token: string, params: { gigId: string; workerId: string; status?: string }) {
  const r = await fetch(`${baseUrl}/api/test/seed/applications`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-test-token': token },
    body: JSON.stringify(params),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json?.error || `seed failed: ${r.status}`);
  return json.id as string;
}

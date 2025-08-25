export async function seedAndGet(baseURL: string, secret: string) {
  const res = await fetch(`${baseURL}/api/test/seed`, {
    method: 'POST',
    headers: { 'x-test-secret': secret },
  });
  if (!res.ok) throw new Error(`Seed failed: ${res.status}`);
  return res.json() as Promise<{
    ok: true;
    gigId: string | number;
    applicationId: string | number;
    employerId: string | number;
    workerId: string | number;
    adminId: string | number;
  }>;
}

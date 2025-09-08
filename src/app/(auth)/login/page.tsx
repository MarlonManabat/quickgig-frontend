import { redirect } from 'next/navigation';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = typeof searchParams?.next === 'string' ? searchParams.next : '';
  const qs = next ? `?next=${encodeURIComponent(next)}` : '';
  redirect(`/api/auth/pkce/start${qs}`);
}

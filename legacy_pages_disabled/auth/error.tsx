import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthError() {
  const { query } = useRouter();
  const m = (query.m as string) || 'Authentication error';
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Sign-in error</h1>
      <p className="text-red-600">{m}</p>
      <Link className="underline mt-4 inline-block" href="/">
        Go back
      </Link>
    </main>
  );
}

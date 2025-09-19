import Link from "next/link";
import { hostAware } from "@/lib/hostAware";

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function resolveNext(searchParams?: Record<string, string | string[] | undefined>) {
  const nextParam = searchParams?.next;
  const nextValue = Array.isArray(nextParam) ? nextParam[0] : nextParam;
  if (typeof nextValue === 'string' && nextValue.trim().length > 0) {
    return nextValue;
  }
  return '/my-applications';
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const safeNext = resolveNext(searchParams);
  const loginHref = hostAware(
    `/api/auth/demo?next=${encodeURIComponent(safeNext)}`,
  );
  const logoutHref = hostAware(
    `/api/auth/logout?next=${encodeURIComponent('/')}`,
  );

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-3">Login</h1>
      <p className="text-gray-600 mb-8">Use the demo button to simulate an authenticated session.</p>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a
          data-testid="login-start"
          href={loginHref}
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white"
        >
          Continue as demo user
        </a>
        <a
          href={logoutHref}
          className="inline-flex items-center rounded border px-4 py-2 text-sm text-gray-700"
        >
          Clear session
        </a>
      </div>
      <div className="mt-6">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}

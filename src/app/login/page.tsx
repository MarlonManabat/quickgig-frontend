import Link from "next/link";

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
  const loginAction = `/api/mock/login?next=${encodeURIComponent(safeNext)}`;
  const logoutAction = `/api/mock/logout?next=${encodeURIComponent('/')}`;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-3">Login</h1>
      <p className="text-gray-600 mb-8">Use the demo button to simulate an authenticated session.</p>
      <form method="POST" action={loginAction} className="mb-4">
        <button
          data-testid="login-start"
          className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white"
        >
          Continue as demo user
        </button>
      </form>
      <form method="POST" action={logoutAction} className="mb-8">
        <button className="inline-flex items-center rounded border px-4 py-2 text-sm text-gray-700">
          Clear session
        </button>
      </form>
      <div className="mt-6">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}

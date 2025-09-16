import Link from "next/link";

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextParam = searchParams?.next;
  const nextValue = Array.isArray(nextParam) ? nextParam[0] : nextParam;
  const safeNext =
    typeof nextValue === "string" && nextValue.trim().length > 0
      ? nextValue
      : "/my-applications";
  const startHref = `/api/mock-login?next=${encodeURIComponent(safeNext)}`;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-3">Login</h1>
      <p className="text-gray-600 mb-8">This is a placeholder login page.</p>
      <a
        data-testid="login-start"
        href={startHref}
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
      >
        Continue
      </a>
      <div className="mt-6">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { hostAware } from "@/lib/hostAware";
import AuthForm from "@/components/auth/AuthForm";

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
  const logoutHref = hostAware(
    `/api/auth/logout?next=${encodeURIComponent('/')}`,
  );

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-3 text-center">Welcome Back</h1>
      <AuthForm nextUrl={safeNext} />
      <div className="mt-8 text-center">
        <a
          href={logoutHref}
          className="inline-flex items-center rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Clear session (Demo Logout)
        </a>
      </div>
      <div className="mt-6 text-center">
        <Link href="/" className="underline text-blue-600 hover:text-blue-800">
          Back to home
        </Link>
      </div>
    </main>
  );
}

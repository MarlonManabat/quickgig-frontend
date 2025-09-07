export default function AuthError({ searchParams }: { searchParams: { reason?: string } }) {
  const reason = searchParams?.reason || 'unexpected_error';
  const human = {
    invalid_oauth: 'We couldn’t verify your sign-in. Please try again.',
    unexpected_error: 'Something went wrong. Please try again.',
  }[reason] || 'Something went wrong. Please try again.';

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Confirming…</h1>
      <p className="text-red-600">{human}</p>
      <p className="mt-4 text-sm text-gray-600">
        Tip: close extra tabs, disable aggressive content blockers for a moment, and try again.
      </p>
    </main>
  );
}

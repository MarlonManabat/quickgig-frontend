export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <p data-testid="login-page">
        Please sign in to continue. In preview/CI this is a placeholder page.
      </p>
    </main>
  );
}

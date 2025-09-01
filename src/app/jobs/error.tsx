"use client";
export default function RouteError({ error }: { error: Error }) {
  console.error("[route error]", error);
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 opacity-70">Please try again later.</p>
    </div>
  );
}

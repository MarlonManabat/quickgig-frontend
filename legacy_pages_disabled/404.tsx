import LandingCTAs from "@/components/landing/LandingCTAs";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">
        Sorry, hindi namin mahanap ang page na ito. Try one of these:
      </p>
      <div className="flex gap-3 justify-center">
        <LandingCTAs
          startClassName="qg-btn qg-btn--primary px-4 py-2"
          postClassName="qg-btn qg-btn--outline px-4 py-2"
        />
      </div>
      <p className="text-sm text-slate-500">
        Or go to{" "}
        <a className="qg-link" href="/">
          home
        </a>
        .
      </p>
    </main>
  );
}

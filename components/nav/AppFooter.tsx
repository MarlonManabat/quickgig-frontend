import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t mt-10" aria-label="Footer">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} QuickGig</span>
        <nav className="flex gap-4">
          <Link href="/terms" className="underline" data-testid="footer-terms">
            Terms
          </Link>
          <Link href="/privacy" className="underline" data-testid="footer-privacy">
            Privacy
          </Link>
          <a
            href="https://quickgig.ph"
            className="underline"
            data-testid="footer-website"
          >
            Visit website
          </a>
        </nav>
      </div>
    </footer>
  );
}

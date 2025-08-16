import Link from 'next/link';
import SessionNav from './SessionNav';

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex items-center justify-between p-4 max-w-5xl">
        <Link href="/" className="font-bold text-lg">
          QuickGig.ph
        </Link>
        <nav aria-label="User session" className="flex items-center space-x-4">
          <SessionNav />
        </nav>
      </div>
    </header>
  );
}

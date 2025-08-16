import Link from 'next/link';

export default function LegacyFooter() {
  return (
    <footer className="legacy-footer">
      <p>© {new Date().getFullYear()} QuickGig.ph</p>
      <div className="mt-2 flex justify-center gap-4 text-sm">
        <Link href="/find-work">Find Work</Link>
        <Link href="/post-job">Post Job</Link>
        <Link href="/login">Login</Link>
      </div>
    </footer>
  );
}

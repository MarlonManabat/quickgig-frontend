import Link from 'next/link';

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ||
  'https://app.quickgig.ph';

export default function LandingHeader() {
  return (
    <nav className="...">
      <Link
        href={`${APP_ORIGIN}/find`}
        prefetch={false}
        className="..."
      >
        Find work
      </Link>
      <Link
        href={`${APP_ORIGIN}/post`}
        prefetch={false}
        className="..."
      >
        Post job
      </Link>
      <Link
        href={`${APP_ORIGIN}/login`}
        prefetch={false}
        className="..."
      >
        Login
      </Link>
    </nav>
  );
}

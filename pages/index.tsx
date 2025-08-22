import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Link href="/gigs" className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 hover:opacity-90">Find Work</Link>
      <Link href="/gigs/new" className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 hover:opacity-90">Post a Job</Link>
    </div>
  );
}

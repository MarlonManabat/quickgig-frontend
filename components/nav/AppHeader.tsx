import Link from 'next/link'
export default function AppHeader(){
  return (
    <header className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="QuickGig" className="h-6 w-6" />
          <span className="font-semibold">QuickGig</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/gigs" className="focus:outline-none focus-visible:ring-2 ring-white">Find work</Link>
          <Link href="/gigs/new" className="focus:outline-none focus-visible:ring-2 ring-white">Post job</Link>
          <Link href="/pay" className="px-3 py-1 rounded bg-white text-black">Pay</Link>
        </nav>
        <details className="md:hidden">
          <summary className="cursor-pointer">Menu</summary>
          <div className="mt-2 flex flex-col">
            <Link href="/gigs" className="py-2">Find work</Link>
            <Link href="/gigs/new" className="py-2">Post job</Link>
            <Link href="/pay" className="py-2">Pay</Link>
          </div>
        </details>
      </div>
    </header>
  )
}

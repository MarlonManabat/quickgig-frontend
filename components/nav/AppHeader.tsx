import Link from 'next/link'
import Image from 'next/image'
export default function AppHeader(){
  return (
    <header className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="QuickGig logo" width={24} height={24} priority />
          <span className="font-semibold">QuickGig</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          <Link href="/gigs">Find work</Link>
          <Link href="/gigs/new">Post job</Link>
          <Link href="/pay" className="px-3 py-1 rounded bg-white text-black">Pay</Link>
        </nav>
        <details className="md:hidden">
          <summary aria-label="Open menu" className="cursor-pointer">Menu</summary>
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

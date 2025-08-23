import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function AppHeader(){
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user
      if (!user) return
      const { data: prof } = await supabase.from('profiles').select('can_post_job, can_post').single()
      const canPost = prof?.can_post_job ?? prof?.can_post
      if (!canPost) return
      const { data: bal, error } = await supabase.from('ticket_balances').select('balance').single()
      setBalance(error ? 0 : bal?.balance ?? 0)
    })
  },[])

  const highlight = balance === 0 && balance !== null

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
          {balance !== null && (
            <Link href="/pay" className={highlight ? 'btn-primary' : 'px-3 py-1 rounded bg-white text-black'}>
              Add tickets
              <span className="ml-2 px-2 py-0.5 rounded-full bg-black text-white text-xs">{balance}</span>
            </Link>
          )}
        </nav>
        <details className="md:hidden">
          <summary aria-label="Open menu" className="cursor-pointer">Menu</summary>
          <div className="mt-2 flex flex-col">
            <Link href="/gigs" className="py-2">Find work</Link>
            <Link href="/gigs/new" className="py-2">Post job</Link>
            {balance !== null && (
              <Link href="/pay" className="py-2">
                Add tickets ({balance})
              </Link>
            )}
          </div>
        </details>
      </div>
    </header>
  )
}

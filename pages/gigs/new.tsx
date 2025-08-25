import { useRouter } from 'next/router'
import GigForm from '@/components/gigs/GigForm'
import { createGig } from '@/lib/gigs/api'

export default function NewGig() {
  const router = useRouter()
  return (
    <main className="p-4">
      <GigForm onSubmit={async (g) => {
        const gig = await createGig(g)
        if (gig) router.push(`/gigs/${gig.id}`)
      }} />
    </main>
  )
}

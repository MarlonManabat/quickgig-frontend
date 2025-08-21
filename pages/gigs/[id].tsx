import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Gig { id: number, title: string, description: string, city: string, budget: number }

export default function GigView() {
  const router = useRouter()
  const { id } = router.query
  const [gig, setGig] = useState<Gig | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/gigs/${id}`).then(r => r.json()).then(d => setGig(d.gig))
  }, [id])

  if (!gig) return null

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-2">{gig.title}</h1>
      <p className="mb-2">{gig.description}</p>
      <p className="mb-2">City: {gig.city}</p>
      <p className="mb-4">Budget: {gig.budget}</p>
    </div>
  )
}

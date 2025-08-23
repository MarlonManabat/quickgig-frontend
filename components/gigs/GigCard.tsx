import { useState } from 'react'
import type { Gig } from '@/lib/db/types'
import { toggleSave } from '@/lib/gigs/api'

interface Props {
  gig: Gig
  initialSaved?: boolean
}

export default function GigCard({ gig, initialSaved = false }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const onToggle = async () => {
    const next = !saved
    setSaved(next)
    try {
      await toggleSave(gig.id, next)
    } catch {
      setSaved(!next)
    }
  }
  return (
    <div className="border p-4 space-y-2">
      <h3 className="text-lg font-semibold">{gig.title}</h3>
      <p>{gig.description}</p>
      <button onClick={onToggle} className="text-sm text-blue-600">
        {saved ? 'Unsave' : 'Save'}
      </button>
    </div>
  )
}

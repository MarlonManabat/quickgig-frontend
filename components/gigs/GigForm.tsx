import { useState } from 'react'
import type { Gig } from '@/lib/db/types'

interface Props {
  initial?: Partial<Gig>
  onSubmit: (gig: Partial<Gig>) => Promise<void>
}

export default function GigForm({ initial = {}, onSubmit }: Props) {
  const [gig, setGig] = useState<Partial<Gig>>(initial)
  const handle = (e: any) => {
    const { name, value, type, checked } = e.target
    setGig(g => ({ ...g, [name]: type === 'checkbox' ? checked : value }))
  }
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(gig) }} className="space-y-2">
      <input data-testid="post-title" name="title" value={gig.title || ''} onChange={handle} placeholder="Title" className="border p-2 w-full" required />
      <textarea data-testid="post-description" name="description" value={gig.description || ''} onChange={handle} placeholder="Description" className="border p-2 w-full" required />
      <input name="price" type="number" value={gig.price ?? ''} onChange={handle} placeholder="Price" className="border p-2 w-full" required />
      <label className="block"><input type="checkbox" name="is_remote" checked={gig.is_remote ?? true} onChange={handle} /> Remote</label>
      <input name="location" value={gig.location || ''} onChange={handle} placeholder="Location" className="border p-2 w-full" />
      <button data-testid="publish-gig" type="submit" className="px-4 py-2 bg-black text-white rounded">Publish</button>
    </form>
  )
}

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Gig { id: number, title: string, city: string }

export default function FindWork() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  async function load(query = '', cityFilter = '') {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (cityFilter) params.set('city', cityFilter)
    const res = await fetch('/api/gigs?' + params.toString())
    const data = await res.json()
    setGigs(data.gigs || [])
  }

  useEffect(() => { load() }, [])

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    load(q, city)
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl">Find Work</h1>
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <input className="border p-2" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <button className="bg-blue-500 text-white px-4" type="submit">Go</button>
      </form>
      <ul className="space-y-2">
        {gigs.map(g => (
          <li key={g.id} className="border p-2">
            <Link href={`/gigs/${g.id}`}><span className="font-bold">{g.title}</span> - {g.city}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

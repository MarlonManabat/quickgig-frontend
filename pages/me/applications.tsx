import { useEffect, useState } from 'react'
import { listMyApplications } from '@/lib/gigs/api'

export default function MyApplications() {
  const [apps, setApps] = useState<any[]>([])
  useEffect(() => {
    listMyApplications().then(({ data }) => setApps(data || []))
  }, [])
  return (
    <main className="p-4 space-y-4">
      {apps.map(a => (
        <div key={a.id} className="border p-2">
          <p className="font-semibold">{a.gigs?.title}</p>
          <p className="text-sm text-gray-600">{a.status}</p>
        </div>
      ))}
    </main>
  )
}

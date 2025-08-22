import { useEffect, useState } from "react"
import Shell from "@/components/Shell"
import { listAlerts, createAlert, deleteAlert } from "@/lib/alerts"

export default function AlertsPage() {
  const [items, setItems] = useState<any[]>([])
  const [keyword, setKeyword] = useState("")
  const [city, setCity] = useState("")

  const load = async () => {
    const { data } = await listAlerts()
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAlert(keyword, city || undefined)
    setKeyword("")
    setCity("")
    load()
  }

  const onDelete = async (id: number) => {
    await deleteAlert(id)
    load()
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Gig Alerts</h1>
      <form onSubmit={onSubmit} className="mb-4 flex flex-wrap gap-2">
        <input
          required
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Keyword"
          className="flex-1 rounded bg-slate-900 border border-slate-700 px-3 py-2"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (optional)"
          className="rounded bg-slate-900 border border-slate-700 px-3 py-2"
        />
        <button type="submit" className="rounded bg-yellow-400 text-black px-3 py-2">
          Add
        </button>
      </form>
      <ul>
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between border-b border-slate-800 py-2">
            <span>
              {a.keyword}
              {a.city ? ` - ${a.city}` : ""}
            </span>
            <button onClick={() => onDelete(a.id)} className="underline text-sm">
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-4 text-center opacity-70">No alerts.</li>
        )}
      </ul>
    </Shell>
  )
}

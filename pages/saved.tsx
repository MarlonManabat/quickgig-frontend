import { useEffect, useState } from "react"
import Shell from "@/components/Shell"
import Link from "next/link"
import { mySaved, toggleSave } from "@/lib/saved"

export default function SavedPage() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => {
    mySaved(100, 0).then(({ data }) => setItems(data ?? []))
  }, [])
  const remove = async (gigId: number) => {
    await toggleSave(gigId)
    setItems((prev) => prev.filter((i) => i.gig_id !== gigId))
  }
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Saved Gigs</h1>
      <Link href="/alerts" className="underline text-sm">Manage Alerts</Link>
      <table className="mt-4 w-full text-left text-sm" data-testid="saved-list">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-2">Title</th>
            <th className="py-2">City</th>
            <th className="py-2">Budget</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.gig_id} className="border-b border-slate-800">
              <td className="py-2"><Link href={`/gigs/${r.gig_id}`} className="underline">{r.gigs?.title}</Link></td>
              <td className="py-2">{r.gigs?.city ?? "—"}</td>
              <td className="py-2">{r.gigs?.budget ?? "—"}</td>
              <td className="py-2 text-right"><button onClick={() => remove(r.gig_id)} className="underline">Unsave</button></td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center opacity-70">No saved gigs.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Shell>
  )
}

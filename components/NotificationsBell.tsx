import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listNotifications, markAllSeen, subscribeNotifications } from '@/lib/notifications'
import { supabase } from '@/lib/supabaseClient'

export default function NotificationsBell() {
  const [userId, setUserId] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await listNotifications(10)
      setItems(data ?? [])
      setCount((data ?? []).filter((n: any) => !n.seen_at).length)
    })()
    const off = subscribeNotifications(userId, (row) => {
      setItems((prev) => [row, ...prev].slice(0, 10))
      setCount((c) => c + 1)
    })
    return () => off()
  }, [userId])

  const onOpen = async () => {
    setOpen((v) => !v)
    if (!open && count > 0) {
      await markAllSeen()
      setCount(0)
    }
  }

  if (!userId) return null

  return (
    <div className="relative">
      <button onClick={onOpen} className="relative">
        🔔
        {count > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-white p-2 text-black shadow">
          {(items.length ? items : [{ kind: 'message', payload: {}, created_at: new Date().toISOString() }]).map((n, i) => {
            const icon =
              n.kind === 'message'
                ? '💬'
                : n.kind === 'offer'
                ? '📄'
                : n.kind === 'saved_gig_activity'
                ? '⭐'
                : n.kind === 'alert_match'
                ? '🔔'
                : n.kind === 'review_received'
                ? '⭐'
                : '✅'
            const text =
              n.kind === 'saved_gig_activity'
                ? 'New application on a gig you saved.'
                : n.kind === 'alert_match'
                ? 'New gig matches your alert.'
                : n.kind === 'review_received'
                ? `You received a new review (★${n.payload?.rating}).`
                : n.kind
            const href =
              n.kind === 'saved_gig_activity' && n.payload?.gig_id
                ? `/gigs/${n.payload.gig_id}`
                : n.kind === 'alert_match' && n.payload?.gig_id
                ? `/gigs/${n.payload.gig_id}`
                : n.kind === 'review_received' && n.payload?.app_id
                ? `/applications/${n.payload.app_id}`
                : undefined
            const body = (
              <>
                <span>{icon}</span>
                <div className="text-sm">
                  <div className="font-medium">{text}</div>
                  {n.payload?.snippet && <div className="text-gray-600">{n.payload.snippet}</div>}
                </div>
              </>
            )
            return href ? (
              <Link key={n.id ?? i} href={href} className="flex items-start gap-2 p-2">
                {body}
              </Link>
            ) : (
              <div key={n.id ?? i} className="flex items-start gap-2 p-2">
                {body}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

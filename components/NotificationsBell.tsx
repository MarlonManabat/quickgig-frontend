import { useEffect, useState } from 'react'
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
          {(items.length ? items : [{ kind: 'message', payload: {}, created_at: new Date().toISOString() }]).map((n, i) => (
            <div key={n.id ?? i} className="flex items-start gap-2 p-2">
              <span>{n.kind === 'message' ? '💬' : n.kind === 'offer' ? '📄' : '✅'}</span>
              <div className="text-sm">
                <div className="font-medium capitalize">{n.kind}</div>
                {n.payload?.snippet && <div className="text-gray-600">{n.payload.snippet}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

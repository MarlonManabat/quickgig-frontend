import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { timeAgo } from '@/utils/time'

type Row = {
  id: string
  title: string
  body: string
  link: string | null
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Row[]>([])
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id || null))
    supabase
      .from('notifications')
      .select('id, title, body, link, read, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setItems((data as any) || []))
  }, [])

  async function markRead(id: string) {
    const headers = uid && process.env.NEXT_PUBLIC_QA_TEST_MODE === 'true' ? { 'x-test-user': uid } : undefined
    await fetch(`/api/notifications/${id}/read`, { method: 'POST', headers })
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, read: true } : r)))
  }

  async function markAll() {
    const headers = uid && process.env.NEXT_PUBLIC_QA_TEST_MODE === 'true' ? { 'x-test-user': uid } : undefined
    await fetch('/api/notifications/mark-all', { method: 'POST', headers })
    setItems((rows) => rows.map((r) => ({ ...r, read: true })))
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        {items.some((n) => !n.read) && (
          <button onClick={markAll} className="text-sm underline">
            Mark all as read
          </button>
        )}
      </div>
      <ul className="space-y-4" data-test="notifications-list">
        {items.map((n) => (
          <li key={n.id} className={`border p-3 rounded ${n.read ? 'opacity-50' : ''}`}>
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-brand-subtle">{timeAgo(n.created_at)}</div>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="text-xs underline">
                  Mark as read
                </button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm">{n.body}</p>
            {n.link && (
              <Link href={n.link} className="text-sm text-brand-primary underline mt-2 inline-block">
                Open
              </Link>
            )}
          </li>
        ))}
        {items.length === 0 && <p>No notifications.</p>}
      </ul>
    </main>
  )
}

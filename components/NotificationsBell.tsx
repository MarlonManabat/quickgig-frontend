import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/utils/supabaseClient'
import { timeAgo } from '@/utils/time'

export default function NotificationsBell() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchNotifs() {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setItems(data ?? [])
    setCount((data ?? []).filter((n: any) => !n.read_at).length)
  }

  useEffect(() => {
    if (!user) return
    fetchNotifs()
    const id = setInterval(fetchNotifs, 30000)
    const channel = supabase
      .channel('notif-' + user.id)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => fetchNotifs()
      )
      .subscribe()
    return () => {
      clearInterval(id)
      supabase.removeChannel(channel)
    }
  }, [user])

  async function markRead() {
    if (!user) return
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .is('read_at', null)
        .eq('user_id', user.id)
    } catch (e) {
      // column may not exist; ignore
    }
  }

  const toggle = async () => {
    const next = !open
    setOpen(next)
    if (next) {
      await markRead()
      setCount(0)
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <button onClick={toggle} className="relative">
        🔔
        {count > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-brand-danger" />}
      </button>
      {open && (
        <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto border border-brand-border bg-brand-bg p-4 shadow-lg">
          {items.map(n => {
            const href =
              n.type === 'message' && n.payload?.application_id
                ? `/applications/${n.payload.application_id}`
                : undefined
            const content = (
              <div key={n.id} className="mb-2 border-b border-brand-border pb-2 text-sm">
                {n.payload?.preview && <div>{n.payload.preview}</div>}
                <div className="text-xs text-brand-subtle">{timeAgo(n.created_at)}</div>
              </div>
            )
            return href ? (
              <Link key={n.id} href={href} onClick={() => setOpen(false)}>
                {content}
              </Link>
            ) : (
              content
            )
          })}
          {items.length === 0 && <p className="text-sm text-brand-subtle">No notifications.</p>}
        </div>
      )}
    </div>
  )
}

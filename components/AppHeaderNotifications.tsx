import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function AppHeaderNotifications() {
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    let uid: string | null = null

    supa.auth.getUser().then(({ data }) => {
      uid = data.user?.id || null
      if (!uid) return

      supa
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('read', false)
        .then(({ count }) => setUnread(count || 0))

      const ch = supa
        .channel('notif-ch')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${uid}` },
          () => setUnread(x => x + 1)
        )
        .subscribe()
      return () => {
        supa.removeChannel(ch)
      }
    })
  }, [])

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative"
      data-testid="app-nav-notifications"
    >
      <span className="i-bell" />
      {unread > 0 && (
        <span
          className="absolute -top-1 -right-1 text-xs rounded-full bg-red-500 text-white px-1"
          data-testid="notifications-count"
        >
          {unread}
        </span>
      )}
    </Link>
  )
}

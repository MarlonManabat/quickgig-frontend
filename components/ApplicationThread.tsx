import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { timeAgo } from '@/utils/time'

interface Props {
  threadId: number
}

export default function ApplicationThread({ threadId }: Props) {
  const [msgs, setMsgs] = useState<any[]>([])
  const [uid, setUid] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, body, sender, created_at, profiles:sender(full_name)')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
      if (mounted) setMsgs(data ?? [])
    }
    load()

    const channel = supabase
      .channel('thread-' + threadId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        payload => setMsgs(prev => [...prev, payload.new as any])
      )
      .subscribe()

    function onOptimistic(e: any) {
      setMsgs(prev => [...prev, e.detail])
    }
    function onRemove(e: any) {
      setMsgs(prev => prev.filter(m => m.id !== e.detail))
    }
    window.addEventListener('message:optimistic', onOptimistic)
    window.addEventListener('message:remove', onRemove)

    return () => {
      mounted = false
      supabase.removeChannel(channel)
      window.removeEventListener('message:optimistic', onOptimistic)
      window.removeEventListener('message:remove', onRemove)
    }
  }, [threadId])

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9 })
  }, [msgs])

  return (
    <div
      ref={listRef}
      className="card p-3 h-[60vh] overflow-y-auto flex flex-col gap-2"
    >
      {msgs.length === 0 && (
        <p className="text-sm text-center text-brand-subtle">No messages yet.</p>
      )}
      {msgs.map(m => {
        const isMe = uid && m.sender === uid
        return (
          <div key={m.id} className="flex flex-col">
            <div className={`text-xs mb-1 ${isMe ? 'text-right' : ''}`}>
              {(isMe ? 'You' : m.profiles?.full_name ?? m.sender) +
                ' • ' +
                timeAgo(m.created_at || new Date().toISOString())}
            </div>
            <div
              className={
                isMe
                  ? 'bg-black text-white rounded-2xl px-3 py-2 ml-auto max-w-[80%]'
                  : 'bg-gray-100 text-gray-900 rounded-2xl px-3 py-2 mr-auto max-w-[80%]'
              }
            >
              {m.body}
            </div>
          </div>
        )
      })}
    </div>
  )
}

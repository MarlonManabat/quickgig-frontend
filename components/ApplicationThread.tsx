import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

interface Props {
  threadId: string
}

export default function ApplicationThread({ threadId }: Props) {
  const [msgs, setMsgs] = useState<any[]>([])
  const listRef = useRef<HTMLDivElement>(null)

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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` }, (p) => {
        setMsgs(prev => [...prev, p.new])
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [threadId])

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9 })
  }, [msgs])

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto">
      {msgs.map(m => (
        <div key={m.id} className="mb-3">
          <div className="text-xs opacity-70">
            {(m.profiles?.full_name ?? m.sender) + ' • ' + new Date(m.created_at).toLocaleString()}
          </div>
          <div className="whitespace-pre-wrap">{m.body}</div>
        </div>
      ))}
    </div>
  )
}

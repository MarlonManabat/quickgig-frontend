import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

interface Props {
  threadId: string
  onSent?: () => void
}

export default function MessageComposer({ threadId, onSent }: Props) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [app, setApp] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    const load = async () => {
      const { data: th } = await supabase
        .from('threads')
        .select('application_id')
        .eq('id', threadId)
        .single()
      if (th) {
        const { data: appData } = await supabase
          .from('applications')
          .select('id, applicant, gigs(owner)')
          .eq('id', th.application_id)
          .single()
        setApp(appData)
      }
    }
    load()
  }, [threadId])

  async function send() {
    if (!body.trim() || !userId) return
    setSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({ thread_id: threadId, sender: userId, body })
      if (error) throw error
      const counterparty = userId === app?.applicant ? app?.gigs?.owner : app?.applicant
      if (counterparty) {
        await supabase.from('notifications').insert({
          user_id: counterparty,
          type: 'message',
          payload: { application_id: app.id, thread_id: threadId, preview: body.slice(0, 80) }
        })
      }
      setBody('')
      onSent?.()
    } catch (e: any) {
      alert(e.message ?? 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={e => { e.preventDefault(); send() }}
      className="flex gap-2 mt-2"
    >
      <textarea
        className="flex-1 rounded bg-slate-800 p-2"
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Type a message..."
        disabled={sending}
      />
      <button type="submit" disabled={sending} className="rounded bg-yellow-400 text-black px-3">
        Send
      </button>
    </form>
  )
}

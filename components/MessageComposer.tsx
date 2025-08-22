import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { isAccessDenied } from '@/utils/errors'

interface Props {
  threadId: number
  onSent?: () => void
}

export default function MessageComposer({ threadId, onSent }: Props) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [app, setApp] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
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
    if (!body.trim() || sending || !user) return
    setSending(true)
    setError(null)
    const tempId = 'temp-' + Date.now()
    window.dispatchEvent(
      new CustomEvent('message:optimistic', {
        detail: { id: tempId, body, sender: user.id, created_at: new Date().toISOString(), pending: true }
      })
    )
    try {
      const { error: msgErr } = await supabase
        .from('messages')
        .insert({ thread_id: threadId, sender: user.id, body })
      if (msgErr) throw msgErr

      const to = user.id === app?.applicant ? app?.gigs?.owner : app?.applicant
      if (to) {
        const { error: notifErr } = await supabase.from('notifications').insert({
          user_id: to,
          type: 'message',
          payload: { application_id: app?.id, thread_id: threadId, preview: body.slice(0, 80) }
        })
        if (notifErr && !isAccessDenied(notifErr)) {
          console.error('notify error', notifErr)
        }
      }

      window.dispatchEvent(new CustomEvent('message:remove', { detail: tempId }))
      setBody('')
      onSent?.()
    } catch (e: any) {
      window.dispatchEvent(new CustomEvent('message:remove', { detail: tempId }))
      if (isAccessDenied(e)) setError("You can’t send messages in this application.")
      else setError(e.message ?? 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-2">
      {error && <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-800">{error}</div>}
      <form
        onSubmit={e => {
          e.preventDefault()
          send()
        }}
        className="sticky bottom-0 flex gap-2"
      >
        <textarea
          className="flex-1 border rounded-md px-3 py-2"
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}

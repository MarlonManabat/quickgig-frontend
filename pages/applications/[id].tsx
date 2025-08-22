import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ApplicationThread from '@/components/ApplicationThread'
import MessageComposer from '@/components/MessageComposer'
import { supabase } from '@/utils/supabaseClient'
import { getOrCreateThread } from '@/utils/application'
import { isAccessDenied } from '@/utils/errors'

export default function ApplicationPage() {
  const router = useRouter()
  const { id } = router.query
  const [app, setApp] = useState<any>(null)
  const [threadId, setThreadId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!id || typeof id !== 'string') return
    ;(async () => {
      try {
        const { data, error: appErr } = await supabase
          .from('applications')
          .select(
            'id, gig_id, applicant, gigs(title, owner, profiles:owner(full_name)), profiles:applicant(full_name)'
          )
          .eq('id', id)
          .maybeSingle()
        if (appErr) {
          if (isAccessDenied(appErr)) {
            setError("You don't have access to this application.")
          } else {
            setError(appErr.message)
          }
          return
        }
        if (!data) {
          setError('Application not found')
          return
        }
        setApp(data)
        const th = await getOrCreateThread(data.id)
        setThreadId(th.id)
      } catch (e: any) {
        setError(e.message ?? 'Error loading application')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>
  if (error) return <p style={{ padding: 16 }}>⚠️ {error}</p>
  if (!app) return <p style={{ padding: 16 }}>Not found.</p>

  const counterpart =
    user?.id === app.applicant
      ? app.gigs?.profiles?.full_name ?? app.gigs?.owner
      : app.profiles?.full_name ?? app.applicant

  return (
    <main className="mx-auto flex h-[80vh] max-w-3xl flex-col gap-2 p-4">
      <h1 className="text-xl font-bold">{app.gigs?.title}</h1>
      <p className="text-sm">Conversation with {counterpart}</p>
      {threadId && <ApplicationThread threadId={threadId} />}
      {threadId && <MessageComposer threadId={threadId} />}
    </main>
  )
}

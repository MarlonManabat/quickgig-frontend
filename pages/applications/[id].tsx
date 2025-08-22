import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ApplicationThread from '@/components/ApplicationThread'
import MessageComposer from '@/components/MessageComposer'
import { supabase } from '@/utils/supabaseClient'
import { getOrCreateThread } from '@/utils/application'
import { isAccessDenied } from '@/utils/errors'
import Card from '@/components/ui/Card'
import Banner from '@/components/ui/Banner'
import Spinner from '@/components/ui/Spinner'

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

  if (loading) return <Spinner />
  if (error) return <Banner kind="error">{error}</Banner>
  if (!app) return <Banner kind="info">Not found.</Banner>

  const counterpart =
    user?.id === app.applicant
      ? app.gigs?.profiles?.full_name ?? app.gigs?.owner
      : app.profiles?.full_name ?? app.applicant

  return (
    <div className="mx-auto flex h-[80vh] max-w-3xl flex-col gap-4 p-4">
      <p className="text-sm text-brand-subtle">Applications / View application</p>
      <Card className="p-4 space-y-1">
        <h1>{app.gigs?.title}</h1>
        <p className="text-sm text-brand-subtle">Conversation with {counterpart}</p>
      </Card>
      {threadId && <ApplicationThread threadId={threadId} />}
      {threadId && <MessageComposer threadId={threadId} />}
    </div>
  )
}

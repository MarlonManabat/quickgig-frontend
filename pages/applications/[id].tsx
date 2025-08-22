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
  const [threadId, setThreadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || typeof id !== 'string') return
    ;(async () => {
      try {
        const { data, error: appErr } = await supabase
          .from('applications')
          .select('id, gig_id, applicant, gigs(title, owner), profiles:applicant(full_name)')
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

  if (loading) return <p style={{padding:16}}>Loading…</p>
  if (error) return <p style={{padding:16}}>⚠️ {error}</p>
  if (!app) return <p style={{padding:16}}>Not found.</p>

  return (
    <main style={{maxWidth:720,margin:'24px auto',padding:'16px',display:'flex',flexDirection:'column',height:'80vh'}}>
      <h1 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'8px'}}>Application — {app.gigs?.title}</h1>
      <p style={{fontSize:'14px',marginBottom:'8px'}}>Applicant: {app.profiles?.full_name ?? app.applicant}</p>
      {threadId && <ApplicationThread threadId={threadId} />}
      {threadId && <MessageComposer threadId={threadId} />}
    </main>
  )
}

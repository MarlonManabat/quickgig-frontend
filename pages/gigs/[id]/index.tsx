import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { getOrCreateApplication, getOrCreateThread } from '@/utils/application'

type Gig = {
  id: string; owner: string; title: string; description?: string;
  budget?: number; location?: string; status: 'draft'|'published'|'closed';
};

export default function GigViewPage() {
  const router = useRouter()
  const { id } = router.query
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [appId, setAppId] = useState<string | null>(null)

  useEffect(() => {
    // Normalize the router param
    const gid = Array.isArray(id) ? id[0] : id
    if (!gid) return // wait for router to hydrate

    let mounted = true

    ;(async () => {
      try {
        // get session user id (may be null)
        const { data: u } = await supabase.auth.getUser()
        const me = u.user?.id ?? null
        setUserId(me)

        // fetch the gig
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .eq('id', gid)
          .maybeSingle()

        if (error) throw error
        if (!data) { setErr('Not found'); return }

        // Enforce published visibility for non-owners
        if (data.status !== 'published' && data.owner !== me) {
          setErr('This gig is not public.')
          return
        }

        if (!mounted) return
        setGig(data as Gig)
        setIsOwner(!!me && data.owner === me)
        if (me && data.owner !== me) {
          const { data: app } = await supabase
            .from('applications')
            .select('id')
            .eq('gig_id', gid)
            .eq('applicant', me)
            .maybeSingle()
          setAppId(app?.id ?? null)
        }
      } catch (e: any) {
        if (mounted) setErr(e.message ?? 'Error loading gig')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [id])

  async function apply() {
    if (!userId || !gig) return
    try {
      const app = await getOrCreateApplication(gig.id, userId)
      await getOrCreateThread(app.id)
      router.push(`/applications/${app.id}`)
    } catch (e:any) {
      alert(e.message ?? 'Failed to apply')
    }
  }

  if (loading) return <p style={{padding:16}}>Loading…</p>
  if (err) return <p style={{padding:16}}>⚠️ {err}</p>
  if (!gig) return <p style={{padding:16}}>Not found</p>

  return (
    <main style={{maxWidth:720,margin:'24px auto',padding:'16px'}}>
      <h1>{gig.title}</h1>
      {gig.description && <p>{gig.description}</p>}
      <p>Budget: {gig.budget ?? '—'} | Location: {gig.location ?? '—'} | Status: {gig.status}</p>
      {isOwner && <p><a href={`/gigs/${gig.id}/edit`}>Edit gig</a></p>}
      {!isOwner && userId && (
        appId ? (
          <p><a href={`/applications/${appId}`}>View application</a></p>
        ) : (
          <button onClick={apply} className="rounded bg-yellow-400 text-black px-3 py-1">Apply</button>
        )
      )}
    </main>
  )
}

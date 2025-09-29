import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { userIdFromCookie } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await userIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await adminSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get applications where the user is either the worker or the owner (employer)
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        worker_id,
        owner_id,
        gigs!inner (
          id,
          title,
          profiles!gigs_owner_id_fkey (
            id,
            full_name
          )
        ),
        profiles!applications_worker_id_fkey (
          id,
          full_name
        )
      `)
      .or(`worker_id.eq.${userId},owner_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    // Transform the data for the frontend
    const transformedApplications = applications?.map(app => ({
      id: app.id,
      gig_title: app.gigs?.title || 'Unknown Job',
      employer_name: app.gigs?.profiles?.full_name || 'Unknown Employer',
      worker_name: app.profiles?.full_name || 'Unknown Worker',
      status: app.status,
      created_at: app.created_at,
      is_employer: app.owner_id === userId,
      is_worker: app.worker_id === userId
    })) || [];

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error('Error in applications/with-messages route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

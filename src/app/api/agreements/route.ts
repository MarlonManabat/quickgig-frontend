import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { userIdFromCookie } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { gigId, workerId, notes } = await req.json();
    
    if (!gigId) {
      return NextResponse.json({ error: 'Gig ID required' }, { status: 400 });
    }

    const userId = await userIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await adminSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get the gig to find the employer
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('id, employer_id')
      .eq('id', gigId)
      .single();

    if (gigError || !gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Determine employer and worker based on who's creating the agreement
    let employerId: string;
    let finalWorkerId: string;

    if (gig.employer_id === userId) {
      // Employer is creating agreement with a specific worker
      if (!workerId) {
        return NextResponse.json({ error: 'Worker ID required when employer creates agreement' }, { status: 400 });
      }
      employerId = userId;
      finalWorkerId = workerId;
    } else {
      // Worker is applying for the job
      employerId = gig.employer_id;
      finalWorkerId = userId;
    }

    // Check if both parties have tickets
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, tickets')
      .in('id', [employerId, finalWorkerId]);

    if (profilesError || !profiles || profiles.length !== 2) {
      return NextResponse.json({ error: 'Could not verify user profiles' }, { status: 500 });
    }

    const employerProfile = profiles.find(p => p.id === employerId);
    const workerProfile = profiles.find(p => p.id === finalWorkerId);

    if (!employerProfile || employerProfile.tickets < 1) {
      return NextResponse.json({ error: 'Employer does not have enough tickets' }, { status: 400 });
    }

    if (!workerProfile || workerProfile.tickets < 1) {
      return NextResponse.json({ error: 'Worker does not have enough tickets' }, { status: 400 });
    }

    // Create the agreement
    const { data: agreement, error: agreementError } = await supabase
      .from('agreements')
      .insert({
        gig_id: gigId,
        employer_id: employerId,
        worker_id: finalWorkerId,
        notes: notes || null,
        status: 'proposed'
      })
      .select()
      .single();

    if (agreementError) {
      console.error('Error creating agreement:', agreementError);
      return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
    }

    return NextResponse.json({ agreement });
  } catch (error) {
    console.error('Error in agreements route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = await userIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await adminSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get agreements where user is either employer or worker
    const { data: agreements, error } = await supabase
      .from('agreements')
      .select(`
        id,
        status,
        notes,
        created_at,
        agreed_at,
        gigs!inner (
          id,
          title,
          description,
          budget
        ),
        employer:profiles!agreements_employer_id_fkey (
          id,
          full_name
        ),
        worker:profiles!agreements_worker_id_fkey (
          id,
          full_name
        )
      `)
      .or(`employer_id.eq.${userId},worker_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agreements:', error);
      return NextResponse.json({ error: 'Failed to fetch agreements' }, { status: 500 });
    }

    return NextResponse.json({ agreements });
  } catch (error) {
    console.error('Error in agreements GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

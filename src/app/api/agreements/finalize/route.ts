import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';
import { userIdFromCookie } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { agreementId } = await req.json();
    
    if (!agreementId) {
      return NextResponse.json({ error: 'Agreement ID required' }, { status: 400 });
    }

    const userId = await userIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await adminSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Check if the user is part of this agreement
    const { data: agreement, error: agreementError } = await supabase
      .from('agreements')
      .select('id, employer_id, worker_id, status')
      .eq('id', agreementId)
      .single();

    if (agreementError || !agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    if (agreement.employer_id !== userId && agreement.worker_id !== userId) {
      return NextResponse.json({ error: 'Not authorized for this agreement' }, { status: 403 });
    }

    if (agreement.status !== 'proposed') {
      return NextResponse.json({ error: 'Agreement already finalized' }, { status: 400 });
    }

    // Use the finalize_agreement function to spend tickets atomically
    const { error: finalizeError } = await supabase.rpc('finalize_agreement', {
      p_agreement_id: agreementId
    });

    if (finalizeError) {
      console.error('Error finalizing agreement:', finalizeError);
      return NextResponse.json({ 
        error: 'Failed to finalize agreement', 
        detail: finalizeError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in finalize agreement route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

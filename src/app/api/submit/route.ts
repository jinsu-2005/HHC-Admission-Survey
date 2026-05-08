import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const record = {
      session_id: data.sessionId,
      full_name: data.fullName,
      mobile: data.mobile,
      district: data.district,
      study_plan: data.studyPlan,
      course_interest: data.courseInterest,
      distance: data.distance,
      transportation_issue: data.transportationIssue,
      interest_level: data.interestLevel,
      not_interested_reasons: data.notInterestedReasons,
      other_reason: data.otherReason,
      preferred_contact: data.preferredContact,
      best_time: data.bestTime,
      updated_at: new Date().toISOString(),
    };

    // Attempt to save to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { error } = await supabase
          .from('survey_responses')
          .upsert(record, { onConflict: 'session_id' });
          
        if (error) {
          console.error('Supabase error:', error);
          // If Supabase fails but we don't want to break the user flow, just log it.
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

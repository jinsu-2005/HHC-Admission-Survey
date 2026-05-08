import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const record = {
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
      consent: data.consent,
      preferred_contact: data.preferredContact,
      best_time: data.bestTime,
      created_at: new Date().toISOString(),
    };

    // Attempt to save to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { error } = await supabase.from('survey_responses').insert([record]);
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

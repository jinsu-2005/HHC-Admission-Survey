import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Mock data generator for fallback
const getMockData = () => {
  const districts = ["Kanyakumari", "Tirunelveli", "Thoothukudi", "Tenkasi", "Madurai"];
  const courses = ["B.Sc Mathematics", "B.A English", "B.Com Commerce", "BCA", "B.Sc Computer Science"];
  const interestLevels = ["Very Interested", "Interested", "Need More Information", "Just Exploring", "Not Interested"];
  const distances = ["Below 5 KM", "5–15 KM", "15–30 KM", "30–60 KM", "Above 60 KM"];
  
  return Array.from({ length: 45 }).map((_, i) => ({
    id: i + 1,
    full_name: `Student ${i + 1}`,
    mobile: `9876543${(i).toString().padStart(3, '0')}`,
    district: districts[Math.floor(Math.random() * districts.length)],
    course_interest: [courses[Math.floor(Math.random() * courses.length)]],
    interest_level: interestLevels[Math.floor(Math.random() * interestLevels.length)],
    distance: distances[Math.floor(Math.random() * distances.length)],
    preferred_contact: i % 3 === 0 ? "WhatsApp" : "Phone Call",
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  
  if (!auth || auth.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-ref.supabase.co') {
    try {
      const { data, error } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ data: data || [] });
    } catch (err) {
      console.error("Supabase fetch failed, falling back to mock data", err);
      return NextResponse.json({ data: getMockData(), isMock: true });
    }
  }

  // Fallback if no real keys
  return NextResponse.json({ data: getMockData(), isMock: true });
}

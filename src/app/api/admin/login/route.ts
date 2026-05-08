import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === ADMIN_PASSWORD) {
      // In a real app, use JWT or proper sessions. Using simple cookie here.
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    console.log('SH - decoded token');
    
    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decodedToken.uid)
      .single()
    console.log('SH - user fetching done: ',user,error);
    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log('SH - user fond: ',user,error);
    return NextResponse.json(user)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
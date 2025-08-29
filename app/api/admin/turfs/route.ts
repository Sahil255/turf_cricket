import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { supabaseAdmin } from '@/lib/supabase'

async function verifyAdmin(token: string) {
  const decodedToken = await adminAuth.verifyIdToken(token)
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', decodedToken.uid)
    .single()
  
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return decodedToken
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    await verifyAdmin(token)
    console.log('SH - verified');
    const { data: turfs, error } = await supabaseAdmin
      .from('turfs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch turfs' }, { status: 500 })
    }

    return NextResponse.json(turfs)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    await verifyAdmin(token)

    const turfData = await request.json()

    const { data: turf, error } = await supabaseAdmin
      .from('turfs')
      .insert(turfData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create turf' }, { status: 500 })
    }

    return NextResponse.json(turf)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
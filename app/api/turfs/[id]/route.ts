import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: turf, error } = await supabase
      .from('turfs')
      .select('*')
      .eq('id', params.id)
      .eq('active', true)
      .single()

    if (error || !turf) {
      return NextResponse.json({ error: 'Turf not found' }, { status: 404 })
    }

    return NextResponse.json(turf)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
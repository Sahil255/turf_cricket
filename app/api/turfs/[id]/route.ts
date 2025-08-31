import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

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


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, location, description, images, opening_time, closing_time } = body;
    
    const { data: booking, error } = await supabaseAdmin
      .from('turfs')
      .update({
        name,
        location,
        description,
        images,
        opening_time,
        closing_time
      })
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

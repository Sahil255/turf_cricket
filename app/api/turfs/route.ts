import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log("fetching tufs");
    const { data: turfs, error } = await supabase
      .from('turfs')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch turfs' }, { status: 500 })
    }

    return NextResponse.json(turfs)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, description, images, opening_time, closing_time } = body;

    const { data: turf, error } = await supabase
      .from('turfs')
      .insert([{
        name,
        location,
        description,
        images,
        opening_time,
        closing_time,
        active: true,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ turf });
  } catch (error) {
    console.error('Error creating turf:', error);
    return NextResponse.json({ error: 'Failed to create turf' }, { status: 500 });
  }
}
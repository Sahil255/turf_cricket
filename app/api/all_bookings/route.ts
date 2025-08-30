import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const turfId = searchParams.get('turfId');
    const date = searchParams.get('date');
    let query = supabase
      .from('bookings')
      .select(`
          *,
          turf:turfs(*),
          user:users(name, phone)
        `);
    if (turfId) {
      query = query.eq('turf_id', turfId);
    }
    if (date) {
      query = query.eq('booking_date', date);
    }

    query = query.order('created_at', { ascending: false });

    const { data: bookings, error } = await query;
    // console.log("SH in bookings api bookings11111111 ", bookings);
    if (error) {
      // throw error;
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json( bookings );
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

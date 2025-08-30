import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log("SH in bookings api");
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("SH in unauthorized");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader?.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)

    const searchParams = request.nextUrl.searchParams;
    const turfId = searchParams.get('turfId');
    const date = searchParams.get('date');
    
    if(turfId || date)
    {
      let query = supabaseAdmin
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

        if (error) {
          throw error;
        }

        return NextResponse.json({ bookings });

    }

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
     .select(`
        *,
        turf:turfs(*),
        user:users(name, phone)
      `)
      .eq('user_id', decodedToken?.uid)
      .order('created_at', { ascending: false })

      console.log("SH in bookings api bookings ",bookings);

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }  

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    const { turf_id, booking_date, start_time, end_time, total_amount,duration_minutes } = await request.json()

    // Check for overlapping bookings
    const { data: existingBookings, error: checkError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('turf_id', turf_id)
      .eq('booking_date', booking_date)
      .eq('booking_status', 'confirmed')
      .or(`and(start_time.lte.${start_time},end_time.gt.${start_time}),and(start_time.lt.${end_time},end_time.gte.${end_time}),and(start_time.gte.${start_time},end_time.lte.${end_time})`)

    if (existingBookings && existingBookings.length > 0) {
      console.log('SH Overlapping booking found:', existingBookings);
      return NextResponse.json({ error: 'Failed to check availability' }, { status: 409 })
    }

    if (checkError) {
      console.error('Check error:', checkError)
      return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 409 })
    }

    // Create booking
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: decodedToken.uid,
        turf_id,
        booking_date,
        start_time,
        end_time,
        duration_minutes,
        total_amount,
        payment_status: 'pending',
        booking_status: 'confirmed',
      }).select(`
        *,
        turf:turfs(*),
        user:users(name, phone)
      `)
      .single();

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
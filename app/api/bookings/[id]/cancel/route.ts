import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { supabase, supabaseAdmin } from '@/lib/supabase'



export async function GET(request: NextRequest) {
  try {
     const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const turfId = searchParams.get('turfId');
    const date = searchParams.get('date');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(*),
        user:users(name, phone)
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    }

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
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)

    // Get booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', decodedToken.uid)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.booking_status === 'cancelled') {
      return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 })
    }

    // Check if cancellation is within 24 hours
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`)
    const now = new Date()
    const hoursDifference = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursDifference < 24) {
      return NextResponse.json({ 
        error: 'Cancellation not allowed within 24 hours of booking time' 
      }, { status: 400 })
    }

    // Cancel booking
    const { data: updatedBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        booking_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
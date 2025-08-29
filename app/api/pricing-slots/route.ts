import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    const turfId = searchParams.get('turfId');
    console.log("SH getting pricing list",turfId);

    if (!turfId) {
      return NextResponse.json({ error: 'Turf ID is required' }, { status: 400 });
    }

    if (!turfId || typeof turfId !== 'string') {
    console.error('Invalid turfId:', turfId);
    // return res.status(400).json({ error: 'Invalid turfId' });
  }
    const { data: slots, error } = await supabase
      .from('pricing_slots')
      .select('*')
      .eq('turf_id', turfId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Supabase error for turfId:', turfId, 'Error:', error);
      // return res.status(500).json({ error: error.message });
    }
    // console.log('API /pricing-slots response:', {
    //   turfId,
    //   slots: slots,
    //   count: slots?.length,
    // });

    if (error) {
      throw error;
    }
    //  console.log("SH pricing slot resp:",slots);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Error fetching pricing slots:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing slots' }, { status: 500 });
  }
 
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { turf_id, start_time, end_time, price_per_hour } = body;

    const { data: slot, error } = await supabase
      .from('pricing_slots')
      .insert([{
        turf_id,
        start_time,
        end_time,
        price_per_hour,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ slot });
  } catch (error) {
    console.error('Error creating pricing slot:', error);
    return NextResponse.json({ error: 'Failed to create pricing slot' }, { status: 500 });
  }
}
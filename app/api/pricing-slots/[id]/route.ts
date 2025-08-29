import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { start_time, end_time, price_per_hour } = body;

    const { data: slot, error } = await supabase
      .from('pricing_slots')
      .update({
        start_time,
        end_time,
        price_per_hour,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ slot });
  } catch (error) {
    console.error('Error updating pricing slot:', error);
    return NextResponse.json({ error: 'Failed to update pricing slot' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('pricing_slots')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Pricing slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing slot:', error);
    return NextResponse.json({ error: 'Failed to delete pricing slot' }, { status: 500 });
  }
}
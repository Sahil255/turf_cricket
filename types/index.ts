export interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  opening_time: string;
  closing_time: string;
  active: boolean;

  // id: string
  // name: string
  // location: string
  // description?: string
  // images: string[]
  // amenities: string[]
  // contact_phone?: string
  // contact_email?: string
  // latitude?: number
  // longitude?: number
  // is_active: boolean
  // created_at: string
  // updated_at: string
}

export interface PricingSlot {
  id: string
  turf_id: string
  start_time: string
  end_time: string
  price: number
  day_type: 'weekday' | 'weekend' | 'all'
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  user?: User
  turf?: Turf
}

export interface BookingRequest {
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
}
/*
  # Cricket Turf Booking System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Firebase UID
      - `name` (text, not null)
      - `phone` (text, unique, not null)
      - `email` (text, optional)
      - `role` (enum: user/admin, default: user)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `turfs`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `location` (text, not null)
      - `description` (text, optional)
      - `images` (text array)
      - `amenities` (text array)
      - `contact_phone` (text, optional)
      - `contact_email` (text, optional)
      - `latitude` (decimal, optional)
      - `longitude` (decimal, optional)
      - `is_active` (boolean, default: true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `pricing_slots`
      - `id` (uuid, primary key)
      - `turf_id` (uuid, foreign key)
      - `start_time` (time)
      - `end_time` (time)
      - `price` (decimal)
      - `day_type` (enum: weekday/weekend/all)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `turf_id` (uuid, foreign key)
      - `booking_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `total_amount` (decimal)
      - `payment_status` (enum: pending/paid/failed/refunded)
      - `booking_status` (enum: confirmed/cancelled/completed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only access for turf management
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE day_type AS ENUM ('weekday', 'weekend', 'all');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'completed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  email text,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Turfs table
CREATE TABLE IF NOT EXISTS turfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description text,
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  contact_phone text,
  contact_email text,
  latitude decimal,
  longitude decimal,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pricing slots table
CREATE TABLE IF NOT EXISTS pricing_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id uuid REFERENCES turfs(id) ON DELETE CASCADE,
  start_time time NOT NULL,
  end_time time NOT NULL,
  price decimal NOT NULL,
  day_type day_type DEFAULT 'all',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  turf_id uuid REFERENCES turfs(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  total_amount decimal NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  booking_status booking_status DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Turfs policies (public read, admin write)
CREATE POLICY "Anyone can read active turfs"
  ON turfs
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage turfs"
  ON turfs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Pricing slots policies
CREATE POLICY "Anyone can read pricing slots"
  ON pricing_slots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage pricing slots"
  ON pricing_slots
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Bookings policies
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_turfs_active ON turfs(is_active);
CREATE INDEX IF NOT EXISTS idx_turfs_location ON turfs(location);
CREATE INDEX IF NOT EXISTS idx_pricing_slots_turf_id ON pricing_slots(turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_turf_id ON bookings(turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

-- Insert sample data
INSERT INTO turfs (name, location, description, images, amenities, contact_phone, contact_email) VALUES
(
  'Champions Cricket Ground',
  'Andheri Sports Complex, Mumbai',
  'Professional grade cricket turf with world-class facilities. Perfect for tournaments and practice sessions.',
  ARRAY[
    'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg',
    'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'
  ],
  ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments', 'Security'],
  '+91 98765 43210',
  'champions@cricketturf.com'
),
(
  'Victory Sports Arena',
  'Bandra West, Mumbai',
  'Modern cricket facility with excellent drainage and professional pitch maintenance.',
  ARRAY[
    'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg'
  ],
  ARRAY['Floodlights', 'WiFi', 'Parking', 'Changing Rooms', 'Refreshments'],
  '+91 98765 43211',
  'victory@cricketturf.com'
);

-- Insert sample pricing slots
INSERT INTO pricing_slots (turf_id, start_time, end_time, price, day_type) 
SELECT 
  t.id,
  '06:00'::time,
  '16:00'::time,
  800,
  'weekday'
FROM turfs t;

INSERT INTO pricing_slots (turf_id, start_time, end_time, price, day_type) 
SELECT 
  t.id,
  '16:00'::time,
  '19:00'::time,
  1000,
  'weekday'
FROM turfs t;

INSERT INTO pricing_slots (turf_id, start_time, end_time, price, day_type) 
SELECT 
  t.id,
  '19:00'::time,
  '23:00'::time,
  900,
  'weekday'
FROM turfs t;

INSERT INTO pricing_slots (turf_id, start_time, end_time, price, day_type) 
SELECT 
  t.id,
  '06:00'::time,
  '16:00'::time,
  1000,
  'weekend'
FROM turfs t;

INSERT INTO pricing_slots (turf_id, start_time, end_time, price, day_type) 
SELECT 
  t.id,
  '16:00'::time,
  '23:00'::time,
  1200,
  'weekend'
FROM turfs t;
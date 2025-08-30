'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  User,
  Search, ChevronDown, ChevronUp,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
// import QRCode from 'qrcode.react'
import QRCode from 'react-qr-code';

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  booking_status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  turf: {
    name: string;
    location: string;
  };
  user: {
    name: string;
    phone: string;
  };
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user, firebaseUser } = useAuth()
  const [expandedQRCodes, setExpandedQRCodes] = useState({})
   const [paymentLoading, setPaymentLoading] = useState({})
  const [error, setError] = useState(null)
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchBookings = async () => {
    try {
      console.log("SH fetching booking details");
      let headers: HeadersInit = {};
      if (user) {
        const token = await firebaseUser?.getIdToken();
        headers = { Authorization: `Bearer ${token}` };
      } else {
        console.warn('No user authenticated, skipping Authorization header');
      }
      const response = await fetch('/api/all_bookings', { headers })
      if (response.ok) {
        const bookings = await response.json()
        setBookings(bookings || []);
        console.debug(bookings);
      }
      // const { bookings } = await response.json();
      // console.log(bookings);
      // setBookings(bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };


  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '') // Remove non-numeric characters except +
    if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) return cleanPhone
    if (cleanPhone.length === 10) return `+91${cleanPhone}`
    return null // Invalid phone number
  }


  // Handle Pay Now button click
  const handlePayNow = async (booking) => {
    setPaymentLoading((prev) => ({ ...prev, [booking.id]: true }))
    setError(null)
    try {
      // Validate phone number
      const contact = validatePhoneNumber(booking.user.phone)
      if (!contact) {
        throw new Error('Invalid phone number format')
      }

      // Create Razorpay order
      const response = await fetch('/api/payment/create_razor_pay_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.total_amount,
          customerEmail: "example@email.com",
          customerPhone: contact,
          customerName: booking.user.name,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create Razorpay order')
      }
      const { order_id, amount, currency } = await response.json()

      // Log prefill for debugging
      const prefill = {
        name: booking.user.name,
        email: "example@email.com",
        contact: contact,
      }
      console.log('Razorpay prefill:', prefill)

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        order_id: order_id,
        name: 'Turf Booking',
        description: `Payment for Booking ID: ${truncateId(booking.id)}`,
        handler: function (response) {
          // Update booking status
          setBookings((prev) =>
            prev.map((b) =>
              b.id === booking.id
                ? { ...b, payment_status: 'completed', booking_status: 'confirmed' }
                : b
            )
          )
          alert('Payment successful!')
        },
        prefill,
        theme: {
          color: 'hsl(var(--primary))',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`)
      })
      razorpay.open()
    } catch (error) {
      console.error('Razorpay payment error:', error)
      setError(error.message || 'Error initiating payment')
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [booking.id]: false }))
    }
  }

  // Toggle expanded state for a booking
  // Toggle QR code visibility
  const toggleQRCode = (id) => {
    setExpandedQRCodes((prev) => ({ ...prev, [id]: !prev[id] }))
  }


  // Truncate UUID for display
  const truncateId = (id) => `${id.slice(0, 8)}...`


  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'default'
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }


  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  // Derive single status (payment pending -> Pending, else use booking_status)
  const getDisplayStatus = (booking) => {
    return booking.payment_status === 'pending' ? 'Pending' : booking.booking_status
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">

      <main className="container mx-auto px-4 py-8 sm:py-10">
        {/* Header Section */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-display text-primary dark:text-primary-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-sans max-w-md mx-auto">
            View and manage your turf bookings seamlessly.
          </p>
        </section>

        {/* Filters */}
        <section className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Search by Booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card text-foreground border-border rounded-md text-sm sm:text-base font-sans"
              aria-label="Search bookings by ID"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card text-foreground border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base font-sans"
            aria-label="Filter bookings by status"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </section>

        {/* Bookings List */}
        <section className="space-y-4 sm:space-y-6">
          {loading ? (
            <div className="space-y-4 sm:space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card border-border shadow-md animate-pulse">
                  <CardContent className="p-4 sm:p-5">
                    <div className="h-32 sm:h-36 bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {/* Booking Details */}
                    <div className="col-span-1 sm:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-display text-foreground truncate">
                          ID: {truncateId(booking.id)}
                        </h3>
                        <Badge
                          variant={getStatusBadgeVariant(getDisplayStatus(booking))}
                          className="text-xs sm:text-sm font-sans capitalize"
                        >
                          {getDisplayStatus(booking)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
                        <div>
                          <p className="text-muted-foreground font-sans flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            Date
                          </p>
                          <p className="font-semibold text-foreground">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-sans flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Time
                          </p>
                          <p className="font-semibold text-foreground">
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-sans flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Duration
                          </p>
                          <p className="font-semibold text-foreground">
                            {booking.duration_minutes} min
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-sans flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1.5" />
                            Amount
                          </p>
                          <p className="font-semibold text-foreground">
                            ₹{booking.total_amount}
                          </p>
                        </div>
                      </div>
                      {booking.payment_status === 'pending' && (
                        <Button
                          className="mt-3 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm sm:text-base rounded-md"
                         
                          onClick={() => handlePayNow(booking)}
                          disabled={paymentLoading[booking.id]}
                          aria-label="Pay now for this booking"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                    {/* QR Code Section */}
                    <div className="col-span-1 flex flex-col items-center sm:items-end justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQRCode(booking.id)}
                        className="mb-2 text-muted-foreground hover:text-primary font-sans text-xs sm:text-sm"
                        aria-label={expandedQRCodes[booking.id] ? 'Hide QR code' : 'Show QR code'}
                      >
                        {expandedQRCodes[booking.id] ? (
                          <>
                            Hide QR <ChevronUp className="w-4 h-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Show QR <ChevronDown className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>
                      {expandedQRCodes[booking.id] && (
                        <div className="animate-accordion-down">
                          <QRCode
                            value={booking.id}
                            alphabetic={booking.id}
                            title='RCB Cricket Turf'
                            
                            type='qr'
                            size={80}
                            bgColor="hsl(var(--card))"
                            fgColor="hsl(var(--primary))"
                            className="rounded-md border border-border"
                            aria-label={`QR code for booking ${booking.id}`}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredBookings.length === 0 && (
                <Card className="bg-card border-border shadow-md text-center p-8 sm:p-10">
                  <CardContent>
                    <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-display text-foreground mb-2">
                      No Bookings Found
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-sans">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No bookings match your filters.'
                        : 'No bookings have been made yet.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
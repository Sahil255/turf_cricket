'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
// import { Turf, BookingRequest, Booking } from '@/types'
import { TimeSlotSelector } from '@/components/booking/TimeSlotSelector'
import { BookingRequest, Turf } from '@/types'
import { BookingConfirmationDialog } from '@/components/booking/BookingConfirmationDiag'


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

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, firebaseUser, authLoading } = useAuth()
  const [turf, setTurf] = useState<Turf | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { toast } = useToast()
  const [paymentLoading, setPaymentLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<{
    id: string
    turf_name: string
    booking_date: string
    start_time: string
    end_time: string
    duration_minutes: number
    total_amount: number
    booking_status: string
  } | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchTurf()
    }
  }, [params.id])

  const fetchTurf = async () => {
    try {
      const response = await fetch(`/api/turfs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTurf(data)
      } else {
        router.push('/turfs')
      }
    } catch (error) {
      console.error('Error fetching turf:', error)
      router.push('/turfs')
    } finally {
      setLoading(false)
      setBookingLoading(false);
    }
  }

    // Validate phone number
  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '') // Remove non-numeric characters except +
    if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) return cleanPhone
    if (cleanPhone.length === 10) return `+91${cleanPhone}`
    return null // Invalid phone number
  }

  const handlePaymentResults = async (
    bookingId: string,
    selectedDate:string,
    startTime: string,
    endTime: string,
    totalAmount: number,
    duration: number,
    turfName: string,
    status:boolean,
    token:string
  ) => {
    const updatePayment = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_status:"failed",
        booking_status:"cancelled"
      }),
    })
    if(updatePayment.ok)
    {
      //TODO:Use the payment dialog box to show payment was success but couldn't save it to database call customer care
      
    }
     setBookingDetails({
      id: bookingId,
      turf_name: turfName || 'Turf',
      booking_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: duration,
      total_amount: totalAmount,
      booking_status: status?'Confirmed':'Failed',
    })
    setShowConfirmationDialog(true)
  }

  const handleSlotSelect = async (
    startTime: string,
    endTime: string,
    totalAmount: number,
    duration: number
  ) => {
    if (authLoading || !user) {
      setShowLoginModal(true)
      return
    }

    if (!selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select a date to book.',
        variant: 'destructive',
      })
      return
    }

    setBookingLoading(true)
    let booking: { [x: string]: any; id: any };
    const token = await firebaseUser?.getIdToken()
    try {
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turf_id: turf?.id,
          booking_date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          total_amount: totalAmount,
          duration_minutes: duration,
          phone: `+91${user.phone}`, // Prepend +91 for Firebase
        }),
      })

      // const booking:Booking  = await bookingResponse.json()
      booking = await bookingResponse.json();

      console.log("turf SH inserted ",booking);

      // console.log("SH booking_id ",booking_id.id);

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create_razor_pay_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: totalAmount,
          customerEmail: "example@email.com",
          customerPhone: user.phone,
          customerName: user.name,
        }),
      })

      
      console.log("SH order response",orderResponse);

      if (!orderResponse.ok) {
        setBookingLoading(false);
        throw new Error('Failed to create order')
      }

      const { order_id } = await orderResponse.json()
      
      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Turf Booking',
        description: `Booking for ${turf?.name}`,
        order_id,
        handler: async function (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) {
          try {
            const verifyResponse = await fetch('/api/payment/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
                const paymentData = await verifyResponse.json()
              
                //store payment id aswell
                const updatePayment = await fetch(`/api/bookings/${booking.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  payment_status:"completed",
                  booking_status:"confirmed",
                  rzr_order_id:response.razorpay_order_id,
                  rzr_payment_id:response.razorpay_payment_id,
                  rzr_signature:response.razorpay_signature,
                }),
              })
              if(updatePayment.ok)
              {
                setBookingDetails({
                  id: booking.id,
                  turf_name: turf?.name || 'Turf',
                  booking_date: selectedDate,
                  start_time: startTime,
                  end_time: endTime,
                  duration_minutes: duration,
                  total_amount: totalAmount,
                  booking_status: 'Confirmed',
                })
                setShowConfirmationDialog(true)
              }
              else{
                console.log("SH Payment success but failed to update the DB");
                 //TODO:Use the payment dialog box to show payment was success but couldn't save it to database call customer care
              }
              // router.push('/bookings')
            } else {
              const error = await verifyResponse.json()
               

              throw new Error(error.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('SH: Payment verification error:', error)
            handlePaymentResults( 
                booking.id,selectedDate,startTime,endTime,totalAmount,duration,turf?.name??'RCB Turf',false,token ?? '');
                
          } finally {
            setBookingLoading(false)
          }
        },
         modal: {
            ondismiss: function() {
              // This callback is triggered when the modal is closed by the user
              console.log(" SH !!! Payment dismissed by user");
              handlePaymentResults( 
                booking.id,selectedDate,startTime,endTime,totalAmount,duration,turf?.name??'RCB Turf',false,token ?? '');
                
              // setPaymentStatus('failed');
              // setErrorMessage('Payment was cancelled.');
            },
          },
        prefill: {
          name: user.name || '',
          contact: `+91${user.phone}`,
        },
        theme: {
          color: '#16a34a', // bg-green-600
        },
      }
      try{
        const rzp = new (window as any).Razorpay(options)

         rzp.on('payment.failed', function (response: any) {
          // This is the specific event for all failure cases, including user exit
          console.log("Payment failed:", response);
          handlePaymentResults( 
                booking.id,selectedDate,startTime,endTime,totalAmount,duration,turf?.name??'RCB Turf',false,token ?? '');
                
        });
        
        rzp.open()
      } catch (error)
      {
        console.error("SH OPtion booking error ",error);
      }
    } catch (error) {
      console.error('SH: Booking error:', error)
      toast({
        title: 'Error',
        description: 'Failed to process booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setBookingLoading(false)
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      
      <div className=" container mx-auto px-4 py-8 flex items-center justify-center min-h-screen  bg-black">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black/40"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-red-500/20 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!turf) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-secondary-100">Turf not found</h1>
        <Button
          onClick={() => router.push('/turfs')}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
        >
          Back to Turfs
        </Button>
      </div>
    )
  }


 return (
    <>
      
    <div className=" n overflow-scroll container mx-auto px-10 py-16 bg-black">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black/40"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-red-500/20 rounded-full animate-pulse delay-1000"></div>
      </div>
      <section className="relative  overflow-hidden">
        <h4 className="text-2x3 sm:text-1xl center font-sans text-gray-50 dark:text-secondary-100 mb-6">
          Book Your Turf
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BookingCalendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
          </div>
          <div className="space-y-6">
            {selectedDate && (
              <TimeSlotSelector
                turfId={turf.id}
                selectedDate={selectedDate}
                openingTime={turf.opening_time}
                closingTime={turf.closing_time}
                onSlotSelect={handleSlotSelect}
              />
            )}
          </div>
        </div>
        </section>
      </div>
     
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {bookingDetails && (
        <BookingConfirmationDialog
          isOpen={showConfirmationDialog}
          onClose={() => {
            setShowConfirmationDialog(false)
            router.push('/bookings')
          }}
          booking={bookingDetails}
        />
      )}
    </>
  )
}

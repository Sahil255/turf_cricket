'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, 
  Star, 
  Users, 
  Wifi, 
  Car, 
  Coffee,
  Shield,
  Clock,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react'
import { Turf, BookingRequest } from '@/types'
import { TimeSlotSelector } from '@/components/booking/TimeSlotSelector'
import { supabase } from '@/lib/supabase'
import { BookingModel } from '@/components/booking/bookingModel'

export default function TurfDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, firebaseUser } = useAuth()
  const [turf, setTurf] = useState<Turf | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { toast } = useToast();

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
    }
  }

  const handleBookingRequest = async (bookingRequest: BookingRequest) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setBookingLoading(true)
    try {
      const token = await firebaseUser?.getIdToken()
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingRequest),
      })

      if (response.ok) {
        toast({
          title: 'Booking Confirmed!',
          description: 'Your turf has been booked successfully.',
        })
        router.push('/bookings')
      } else {
        const error = await response.json()
        toast({
          title: 'Booking Failed',
          description: error.error || 'Failed to create booking',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setBookingLoading(false)
    }
  }

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Refreshments': Coffee,
    'Security': Shield,
    'Floodlights': Clock,
  }

  
  const handleSlotSelect = async (
    startTime: string,
    endTime: string,
    totalAmount: number,
    duration: number
  ) => {
    if (!selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select a date to book.',
        variant: 'destructive',
      });
      return;
    }
    if(!user)
    {
      setShowLoginModal(true);
    }
    console.log("SH slot selected!!!!");
    setBookingLoading(true);
    try {
 
      console.log("in tme selct",turf?.id," duration ",duration);
      const token = await firebaseUser?.getIdToken();
      const response = await fetch(`/api/bookings?`,
      {
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
          duration_minutes:duration,
        }),
      });
    //   const response = await fetch(`/api/pricing-slots/${turfId}/`);
      console.log("SH pricing list",response);
      const { data } = await response.json();
      console.log("SH pricing slots",data);

      if (!response.ok) {
        throw new Error(data || 'Failed to create booking');
      }
      if(response.ok)
      {
        toast({
        title: 'Booking Confirmed!',
        description: `Your slot has been booked for ${startTime} - ${endTime}`,
      });
      }
      
      // router.push('/');
    } catch (error) {
      console.error('SH Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(false);
    }
  };


  if(bookingLoading)
  {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!turf) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Turf not found</h1>
        <Button onClick={() => router.push('/turfs')}>
          Back to Turfs
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={turf.images[0] || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'}
            alt={turf.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              4.8
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Turf Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{turf.location}</span>
              </div>
              
              {turf.description && (
                <p className="text-gray-700 leading-relaxed">{turf.description}</p>
              )}
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              {/* <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {turf.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || CheckCircle
                    return (
                      <div key={index} className="flex items-center">
                        <IconComponent className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent> */}
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">22 Players</p>
                  <p className="text-gray-600">Full cricket team capacity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">6:00 AM - 11:00 PM</p>
                  <p className="text-gray-600">7 days a week</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            {/* {(turf.contact_phone || turf.contact_email) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {turf.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-600 mr-3" />
                      <span>{turf.contact_phone}</span>
                    </div>
                  )}
                  {turf.contact_email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-600 mr-3" />
                      <span>{turf.contact_email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Free Cancellation</p>
                    <p className="text-sm text-gray-600">Cancel up to 24 hours before your booking</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Instant Confirmation</p>
                    <p className="text-sm text-gray-600">Your booking is confirmed immediately</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Equipment Available</p>
                    <p className="text-sm text-gray-600">Basic cricket equipment can be rented</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Button onClick={() => setShowLoginModal(true)}>
                Book Now
              </Button>
          </div>
          

          {/* Booking Calendar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <BookingCalendar
               onDateSelect={setSelectedDate} selectedDate={selectedDate} 
              />
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
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <BookingModel
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)
        }
        turf = {turf}
      />
    </>
  )
}
'use client'

import { useState } from 'react'
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import { BookingCalendar } from './BookingCalendar'
import { TimeSlotSelector } from './TimeSlotSelector'
import { Turf } from '@/types'
import { useAuth } from '@/contexts/AuthContext'


// interface LoginModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

interface BookingModelProps {
  isOpen: boolean
  onClose: () => void
  turf: Turf
}

export function BookingModel({ isOpen, onClose }: BookingModelProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
   const { user, firebaseUser } = useAuth()
    const [turf, setTurf] = useState<Turf | null>(null)
    const [loading, setLoading] = useState(true)
    // const [date, setDate] = useState<Date>(new Date());

    // const handleDateChange = (value: any) => {
    //     if (value instanceof Date) {
    //     setDate(value);
    //     const formattedDate = value.toISOString().split('T')[0];
    //     onDateSelect(formattedDate);
    //     }
    // };

    // const tileDisabled = ({ date }: { date: Date }) => {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     return date < today;
    // };
    
    
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

   const handleClose = () => {
    onClose()
    // resetForm()
  }


  return (
    <>
      <div id="recaptcha-container"></div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 'phone' && 'Login with Phone'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'profile' && 'Complete Your Profile'}
            </DialogTitle>
          </DialogHeader>
        <BookingCalendar
            onDateSelect={setSelectedDate} selectedDate={selectedDate} 
            />
            {selectedDate && (
            <TimeSlotSelector
            turfId={turf?.id}
            selectedDate={selectedDate}
            openingTime={turf?.opening_time}
            closingTime={turf?.closing_time}
            onSlotSelect={handleSlotSelect}
            />
        )}
        </DialogContent>
      </Dialog>
    </>
  )
}
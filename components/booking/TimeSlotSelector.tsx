'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartColumnStackedIcon, Clock, IndianRupee, Timer } from 'lucide-react';
import { format, addMinutes, parseISO, isAfter, isBefore } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface PricingSlot {
  id: string;
  start_time: string;
  end_time: string;
  price_per_hour: number;
}

interface Booking {
  start_time: string;
  end_time: string;
}

interface TimeSlotSelectorProps {
  turfId: string;
  selectedDate: string;
  openingTime: string;
  closingTime: string;
  onSlotSelect: (startTime: string, endTime: string, totalAmount: number, duration: number) => void;
}

export function TimeSlotSelector({ 
  turfId, 
  selectedDate, 
  openingTime, 
  closingTime, 
  onSlotSelect 
}: TimeSlotSelectorProps) {
  const [pricingSlots, setPricingSlots] = useState<PricingSlot[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [loading, setLoading] = useState(true);
  const { user,firebaseUser } = useAuth();
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchPricingSlots();
    fetchExistingBookings();
  }, [turfId, selectedDate]);

  useEffect(() => {
    // Reset selection when duration changes
    setSelectedStartTime(null);
  }, [selectedDuration]);

  const fetchPricingSlots = async () => {
    try {
        console.log("in tme selct",turfId);
      const response = await fetch(`/api/pricing-slots?turfId=${turfId}`);
      const { slots } = await response.json();
      setPricingSlots(slots || []);
    } catch (error) {
      console.error('Error fetching pricing slots:', error);
    }
  };

  const fetchExistingBookings = async () => {
    try {
        console.log("SH fetching booking details");
        let headers: HeadersInit = {};
      if (user) {
        const token = await firebaseUser?.getIdToken();
        headers = { Authorization: `Bearer ${token}` };
      } else {
        console.warn('No user authenticated, skipping Authorization header');
      }
      
      const response = await fetch(`/api/all_bookings?turfId=${turfId}&date=${selectedDate}`, {
        headers,
      });
      const  bookings  = await response.json();
      console.log("SH bookigns ",bookings);
      setExistingBookings(bookings?.filter((b: any) => b.booking_status === 'confirmed') || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = new Date(`2024-01-01T${openingTime}`);
    const end = new Date(`2024-01-01T${closingTime}`);
    
    let current = new Date(start);
    while (current < end) {
      const timeString = format(current, 'HH:mm');
      slots.push(timeString);
      current = addMinutes(current, 30); // 30-minute intervals
    }
    
    return slots;
  };

  const isSlotAvailable = (startTime: string, duration: number) => {
    const currDate = new Date();
    const year = currDate.getFullYear();
    // Add 1 to getMonth() because it's zero-indexed (January = 0)
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const day = String(currDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const slotStart = new Date(`${selectedDate}T${startTime}`);
    const slotEnd = addMinutes(slotStart, duration);
    const closingTimeObj = new Date(`${selectedDate}T${closingTime}`);
    // console.log("SH Date ",Date()," ",selectedDate);

    // console.log("SH slotStart",slotStart);
    // console.log("SH slotEnd",slotEnd);

    // console.log("SH is active? ",currDate, " SH ",slotStart)
    // Check if slot extends beyond closing time
    if (slotEnd > closingTimeObj) {
      return false;
    }

    const hasElapsed = slotStart < currDate;
    if(hasElapsed)
    {
      console.log("SH b");
      return false;
    }

    // Check for overlapping bookings
    // console.log("SH existingBookings ",existingBookings);
    return !existingBookings.some(booking => {
      const bookingStart = new Date(`${selectedDate}T${booking.start_time}`);
      const bookingEnd = new Date(`${selectedDate}T${booking.end_time}`);

      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  };


  const calculatePrice = (startTime: string, duration: number) => {
    const slotStart = new Date(`2024-01-01T${startTime}`);
    // console.log("slotStart",slotStart);
    const slotEnd = addMinutes(slotStart, duration);
    // console.log("slotEnd",slotEnd);
    let totalPrice = 0;
    let currentTime = new Date(slotStart);
    // console.log("currentTime",currentTime);
    while (currentTime < slotEnd) {
    //   console.log("currentTime < slotEnd",currentTime< slotEnd);
      const timeString = format(currentTime, 'HH:mm');
    //   console.log("timeString",timeString);
      const pricingSlot = pricingSlots.find(slot => {
        const slotStartTime = new Date(`2024-01-01T${slot.start_time}`);
        const slotEndTime = new Date(`2024-01-01T${slot.end_time}`);
        const checkTime = new Date(`2024-01-01T${timeString}`);
        // console.log("end checkTime",checkTime);
        // console.log("end slotStartTime",slotStartTime);
        return checkTime >= slotStartTime && checkTime < slotEndTime;

      });

      const pricePerHour = pricingSlot?.price_per_hour || 500;
      totalPrice += (pricePerHour / 60) * 30; // 30-minute increment
      currentTime = addMinutes(currentTime, 30);
    }

    return Math.round(totalPrice);
  };

  const handleSlotConfirm = async () => {
    setBookingLoading(true);
    //  await new Promise(resolve => setTimeout(resolve, 30)); //reduce the sleep time
    console.log("SH handing slot confirm ",selectedStartTime)
    if (selectedStartTime) {
      const endTime = format(addMinutes(new Date(`2024-01-01T${selectedStartTime}`), selectedDuration), 'HH:mm');
      const totalAmount = calculatePrice(selectedStartTime, selectedDuration);
      console.log("SH handing slot confirm totalAmount ",totalAmount," selectedDuration " ,selectedDuration)
      onSlotSelect(selectedStartTime, endTime, totalAmount, selectedDuration);
      console.log("in handleSlotCnfirm last");
    }
  };

  const timeSlots = generateTimeSlots();
  const durations = [60, 90, 120, 150, 180, 210, 240, 270]; // Duration options in minutes

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Duration Selection */}
      <Card className="border-none shadow-soft dark:bg-secondary-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Select Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {durations.map((duration) => (
              <Button
                key={duration}
                variant={selectedDuration === duration ? 'default' : 'outline'}
                onClick={() => setSelectedDuration(duration)}
                className={`h-12 text-sm sm:text-base ${
                  selectedDuration === duration
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-400'
                    : 'border-gray-300 dark:border-secondary-700 hover:bg-green-50 dark:hover:bg-secondary-700'
                }`}
                aria-label={`Select ${duration} minutes duration`}
              >
                <div className="text-center">
                  <div className="font-semibold">{duration}min</div>
                  <div className="text-xs opacity-80">
                    {duration === 60
                      ? '1 hour'
                      : duration === 90
                      ? '1.5 hours'
                      : duration === 120
                      ? '2 hours'
                      : duration === 150
                      ? '2.5 hours'
                      : duration === 180
                      ? '3 hours'
                      : duration === 210
                      ? '3.5 hours'
                      : duration === 240
                      ? '4 hours'
                      : '4.5 hours'}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card className="border-none shadow-soft dark:bg-secondary-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Clock className="w-5 h-5" />
            Select Starting Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.filter((time) => isSlotAvailable(time, selectedDuration)).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-secondary-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No available slots for {selectedDuration} minutes duration on this date</p>
                <p className="text-sm">Try selecting a shorter duration or different date</p>
              </div>
            )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {timeSlots.map((time) => {
              const isAvailable = isSlotAvailable(time, selectedDuration)
              const isSelected = selectedStartTime === time
              const price = calculatePrice(time, selectedDuration)

              return (
                <Button
                  key={time}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => setSelectedStartTime(time)}
                  className={`h-16 flex flex-col text-sm sm:text-base ${
                    isSelected
                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
                      : 'border-gray-300 dark:border-secondary-700 hover:bg-green-50 dark:hover:bg-secondary-700'
                  } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={`Select time slot starting at ${time}`}
                >
                  <div className="font-semibold">{time}</div>
                  <div className="text-xs opacity-80">
                    {isAvailable ? (
                      <span className="flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {price}
                      </span>
                    ) : (
                      'booked'
                    )}
                  </div>
                </Button>
              )
            })}
          </div>

          
        </CardContent>
      </Card>

      {/* Booking Confirmation */}
      {selectedStartTime && (
        <Card className="border-green-400 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-800 text-lg">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedStartTime} -{' '}
                    {format(addMinutes(new Date(`2024-01-01T${selectedStartTime}`), selectedDuration), 'HH:mm')}
                  </p>
                  <p className="flex items-center">
                    <Timer className="w-4 h-4 mr-2" />
                    Duration: {selectedDuration} minutes ({selectedDuration / 60} hours)
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end text-2xl font-bold text-green-800 dark:text-green-800">
                  <IndianRupee className="w-6 h-6" />
                  {calculatePrice(selectedStartTime, selectedDuration)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-600">Total Amount</p>
                <Button
                  onClick={handleSlotConfirm}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 mt-3"
                  size="lg"
                  disabled={bookingLoading}
                  aria-label="Confirm booking"
                >
                  {bookingLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Booking...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
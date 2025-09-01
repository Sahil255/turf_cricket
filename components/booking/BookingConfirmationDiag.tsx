'use client'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, Check, Clock, CreditCard, Hash, Share, Users, X } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useToast } from '@/hooks/use-toast'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'

interface BookingConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    booking: {
        id: string
        turf_name: string
        booking_date: string
        start_time: string
        end_time: string
        duration_minutes: number
        total_amount: number
        booking_status: string
    }
}

// Simple QR Code component (placeholder - replace with actual QR library)
const QRCodeComponent = ({ value, size = 80 }: { value: string; size?: number }) => {
  return (
    <div 
    //   className="bg-white border-2 rounded-md border-gray-300 center justify-center   text-xs font-mono text-gray-600 "
      style={{ width: size, height: size, fontSize: '0px', lineHeight: '8px' }}
    >
        <div className="animate-accordion-down p-3">
                            <QRCode
                              value={value}
                              alphabetic={value}
                              title='RCB Cricket Turf'
                              type='qr'
                              size={size}
                              bgColor="hsl(var(--card))"
                              fgColor="hsl(var(--primary))"
                            //   className="rounded-md border border-border"
                            //   aria-label={`QR code for booking ${value}`}
                            />
                          </div>
      {value}
    </div>
  );
};


export function BookingConfirmationDialog({ isOpen, onClose, booking }: BookingConfirmationDialogProps) {
    const { toast } = useToast()
     const [showDailog, setShowDialog] = useState(false);
     
     useEffect(() => {

        if (isOpen) {
        setShowDialog(true);
        } else {
        setShowDialog(false);
        }
    }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    const shareText = `🏏 Booking Confirmed!\n\n🏟️ ${booking.turf_name}\n📅 ${formatDate(booking.booking_date)}\n⏰ ${booking.start_time} - ${booking.end_time}\n💰 ₹${booking.total_amount}\n🎫 ID: ${booking.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cricket Turf Booking Confirmed',
          text: shareText,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Booking details copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Booking details copied to clipboard!');
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

 if (!isOpen) return null;
 
     return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 overflow-scroll  p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all overflow-scroll duration-500 ${
          showDailog ? 'scale-90 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Success Animation Header */}
        <div className={`relative bg-gradient-to-r rounded-t-2xl p-6 text-center
          ${booking.booking_status !='Failed' ? 'from-green-600 to-green-700' :'from-amber-600 to-amber-700' }` }>
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 transform transition-all duration-700 ${
            showDailog ? 'scale-95 rotate-0' : 'scale-0 rotate-180'
          }`}>
            {booking.booking_status != 'Failed' &&(<Check className="w-8 h-8 text-green-600" />)}
            {booking.booking_status =='Failed' && (<X className='w-8 h-8 text-amber-600'/>)}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {booking.booking_status !='Failed' ? 'Booking Confirmed!' : 'Booking Failed, Retry'}</h2>
          <p className="text-green-100">
            {booking.booking_status !='Failed' ? 'Your cricket slot is reserved':'Failed to reserve the slot, please try again'}</p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* Perforated Edge Effect */}
          <div className="relative mb-3">
            <div className="absolute -top-2 left-0 right-0 flex justify-center space-x-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-100 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Main Ticket Content */}
          <div className="space-y-3">
            {/* Turf Name - Prominent */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{booking.turf_name}</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                booking.booking_status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.booking_status.toUpperCase()}
              </div>
            </div>
            {/* Date */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="font-semibold text-gray-900">{booking.start_time} - {booking.end_time}</p>
                </div>
              </div>
            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4 ">
            <div className="grid grid-cols-1 gap-4">
              

              {/* Duration */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Duration</p>
                  <p className="font-semibold text-gray-900">{Math.floor(booking.duration_minutes / 60)}h {booking.duration_minutes % 60}m</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Amount</p>
                  <p className="font-semibold text-gray-900">₹{booking.total_amount}</p>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col justify-center self-end ml-6 mb-6 ">
                  <QRCodeComponent value={booking.id} size={80} />
                  </div> */}
          
            </div>
              {/* QR Code and Booking ID Section */}
            {(booking.booking_status != 'Failed' &&
            <div className="bg-gray-50 flex-auto rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500 font-small">Booking ID</p>
                  </div>
                  <p className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded border">
                    {booking.id}
                  </p>
                </div>
                <div className="mr-3 mb-4">
                  <QRCodeComponent value={booking.id} size={50} />
                </div>
              </div>
            </div>
            )}
            {/* Important Note
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-green-800">
                <strong>Important:</strong> Please show this confirmation or QR code at the turf. Arrive 10 minutes before your slot time.
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="flex  justify-center space-x-3 mt-6">
              {(booking.booking_status != 'Failed' && 
              <button
                onClick={handleShare}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
              >
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
          {/* Ticket Bottom Edge Effect */}
        <div className="relative mt-4">
          <div className="absolute -bottom-3 left-0 right-0 flex justify-center space-x-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-100 rounded-full"></div>
            ))}
          </div>
        </div>
        </div>

        
      </div>
    </div>
  );
};
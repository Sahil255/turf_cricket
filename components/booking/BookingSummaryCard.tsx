import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Calendar, Zap, PanelBottomCloseIcon, X } from 'lucide-react';
import { Close } from '@radix-ui/react-toast';

// Define TypeScript interface for props
interface BookingSummaryCardProps {
    isOpen: boolean;
  selectedDate: String;
  startTime: String; // Expect Date objects
  endTime: String;
  selectedDuration:String;
  totalAmount: number;
  onConfirm: () => void; // Callback for confirm action
  onClose: ()=>void;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
    isOpen,
    selectedDate,
  startTime,
  endTime,
  selectedDuration,
  totalAmount,
  onConfirm,
  onClose,
}) => {
  // Format times (
  const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
    return () => {
      setIsConfirming(false); // Set loading to false when exiting
      console.log('BookingSummaryCard unmounted, loading reset to false');
    };
  }, []);

   // Detect keyboard open/close on mobile
  useEffect(() => {
    if (!isOpen) return
  }, [isOpen])

    const handleConfirm = () => {
        setIsConfirming(true);
        onConfirm();
    };
    

const handleClose = () => {
    onClose()
}

if (!isOpen) return null

return (
    <div className="fixed inset-0 z-45 flex  items-center justify-center">
      {/* Backdrop */}
      <div 
        className=" absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={handleClose}
      />
    <div className="fixed bottom-0 left-0 right-0 p-4 z-55">
    <div className="max-w-md mx-auto">
        
        {/* Main Card */}
        <div className="relative bg-black border-2 border-red-600 rounded-2xl overflow-scroll shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-600/30">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-yellow-500/20"></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(227, 30, 36, 0.1) 10px,
                rgba(227, 30, 36, 0.1) 20px
            )`
            }}></div>
        </div>

        {/* Gold Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-pulse"></div>

        {/* Header */}
        <div className="relative p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <h2 className="text-white font-black text-xl tracking-wide">
                BOOKING <span className="text-red-600">SUMMARY</span>
                </h2>
                <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
            </div>
            <div onClick={onClose} className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                
                    <X className='text-yellow w-6 h-6 text-lg'/>
                
            </div>
            </div>

            {/* Turf Ground Info */}
            {/* <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-gray-300 text-sm font-medium">RCB Turf, Bijapur</span>
            <div className="px-2 py-1 bg-red-600/20 border border-red-600/40 rounded-full">
                <span className="text-red-400 text-xs font-bold">CRICKET</span>
            </div>
            </div> */}
        </div>

        {/* Booking Details */}
        <div className="relative px-6 pb-4">
            {/* Time & Duration */}
            <div className="bg-gray-900/80 border border-red-600/30 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-medium">Match Time</span>
                </div>
                <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="text-gray-400 text-sm">{selectedDate}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="text-center">
                <div className="text-white text-2xl font-black">{startTime}</div>
                <div className="text-red-400 text-xs font-bold">START</div>
                </div>
                
                <div className="flex-1 mx-4 relative">
                <div className="h-0.5 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 rounded-full"></div>
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1C2526] border-2 border-[#D7A136] rounded-full px-4 py-2 flex items-center justify-center shiny-gold-badge">
      <span className="text-[#D7A136] text-sm font-bold whitespace-nowrap font-bebas">
        {selectedDuration}
      </span>
    </div>
                </div>
                
                <div className="text-center">
                <div className="text-white text-2xl font-black">{endTime}</div>
                <div className="text-red-400 text-xs font-bold">END</div>
                </div>
            </div>
            </div>

            {/* Amount Section */}
            <div className="bg-gradient-to-r from-red-600/20 to-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 mb-6">
            <div className="text-center">
                <div className="text-gray-300 text-sm font-medium mb-1">Total Amount</div>
                <div className="flex items-center justify-center space-x-1">
                <span className="text-yellow-400 text-3xl font-black">₹</span>
                <span className="text-white text-4xl font-black tracking-tight">{totalAmount}</span>
                </div>
                <div className="text-red-400 text-xs font-bold mt-1">PREMIUM TURF</div>
            </div>
            </div>

            {/* Confirm Button */}
            <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`
                w-full py-4 rounded-xl font-black text-lg tracking-wide
                transition-all duration-300 transform
                ${isConfirming 
                ? 'bg-green-600 text-white scale-95' 
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-red-600/50'
                }
                border-2 border-red-500 hover:border-yellow-400
                active:scale-95
            `}
            >
            {isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>CONFIRMNG...</span>
                </div>
            ) : (
                <div onClick={handleConfirm} className="flex items-center justify-center space-x-2">
                {/* <Zap className="w-6 h-6 text-yellow-400" /> */}
                <span>CONFIRM BOOKING</span>
                {/* <Zap className="w-6 h-6 text-yellow-400" /> */}
                </div>
            )}
            </button>

            {/* RCB Energy Footer */}
            <div className="text-center mt-4">
            <div className="text-red-600 text-xs font-bold tracking-widest">
                EE SALA CUP NAMDE! 🏏
            </div>
            </div>
        </div>

        {/* Side Glow Effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-transparent to-yellow-400/20 rounded-2xl blur-sm -z-10"></div>
        </div>
    </div>
    </div>
    </div>
);
};

export default BookingSummaryCard;
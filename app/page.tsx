'use client'

import { useState, useEffect } from 'react'
import { TurfCard } from '@/components/turf/TurfCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Turf } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast'

import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  MessageCircle,
  Wifi,
  Car,
  ShowerHead,
  Coffee,
  Users,
  Shield,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Play,
  Trophy,
  Target,
  Activity,
  Lightbulb
} from 'lucide-react';



export default function TurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
 const router = useRouter();
 const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const sampleTurf: Turf = {
    id: '',
    name: '',
    location: '',
    description: '',
    images: [],
    opening_time: '',
    closing_time: '',
    active: false,
    amenities: [],
    created_at: '',
    updated_at: ''
  };
  const [curTurf,setCurTurf] = useState<Turf>(sampleTurf);
  const [showStats, setShowStats] = useState(false);
  
   useEffect(() => {
    fetchTurfs();
  }, [])

 useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % curTurf.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [curTurf.images.length]);


  const handleClick = (turfId: string) => {
    setLoading(true);
    router.push(`/turfs/${turfId}`);
    setLoading(false);
    
  };


  const fetchTurfs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/turfs')
      if (response.ok) {
        const data = await response.json()
        
        setTurfs(data)
        setCurTurf(data[0]);
        //  if (data && data.length === 1) {
        //   router.push(`/turfs/${data[0].id}`);
        // }
      }
      else{
        console.error('Error fetching turfs');
        toast({
          title: "Error",
          description: 'Failed to load the page',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const openTime = parseInt(curTurf.opening_time.replace(':', ''));
      const closeTime = parseInt(curTurf.closing_time.replace(':', ''));
      
      setIsOpen(currentTime >= openTime && currentTime <= closeTime && curTurf.active);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [curTurf.opening_time, curTurf.closing_time, curTurf.active]);

   useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);


  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('parking')) return <Car className="w-6 h-6" />;
    if (amenityLower.includes('wifi')) return <Wifi className="w-6 h-6" />;
    if (amenityLower.includes('changing') || amenityLower.includes('shower')) return <ShowerHead className="w-6 h-6" />;
    if (amenityLower.includes('refreshment') || amenityLower.includes('cafe') || amenityLower.includes('food')) return <Coffee className="w-6 h-6" />;
    if (amenityLower.includes('seating') || amenityLower.includes('seat')) return <Users className="w-6 h-6" />;
    if (amenityLower.includes('security')) return <Shield className="w-6 h-6" />;
    if (amenityLower.includes('light') || amenityLower.includes('flood') || amenityLower.includes('led')) return <Zap className="w-6 h-6" />;
    if (amenityLower.includes('washroom') || amenityLower.includes('toilet')) return <ShowerHead className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const handleLocationClick = () => {
    const encodedLocation = encodeURIComponent(curTurf.location);
    window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
  };

  const handleBookNow = () => {
    window.open('/booking', '_blank');
  };

  const handleCall = () => {
    console.log(curTurf.images);
    if (curTurf.contact_phone) {
      window.open(`tel:${curTurf.contact_phone}`);
    }
  };

  const handleEmail = () => {
    if (curTurf.contact_email) {
      window.open(`mailto:${curTurf.contact_email}`);
    }
  };

  const handleWhatsApp = () => {
    if (curTurf.contact_phone) {
      const cleanPhone = curTurf.contact_phone.replace(/[^\d]/g, '');
      const message = encodeURIComponent(`Hi! I'm interested in booking ${curTurf.name}. Could you please share availability and pricing?`);
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
  };

  const nextImage = () => {
    console.log(curTurf.images);
    setCurrentImageIndex((prev) => (prev + 1) % curTurf.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + curTurf.images.length) % curTurf.images.length);
  };
  
  if ( loading) {
      return (
        <div className="  container mx-auto px-4 py-8 flex items-center justify-center min-h-screen  bg-black">
         
         <div className="fixed inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black/40"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-red-500/20 rounded-full animate-pulse delay-1000"></div>
        </div>
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

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black/40"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-red-500/20 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0">
          {curTurf.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={image}
                alt={`${curTurf.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Diagonal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-red-900/40"></div>
        
        {/* Navigation Arrows */}
        {/* <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button> */}
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600/20 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              {/* Status Badge */}
              <div className="mb-6">
                {isOpen && <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm ${
                  isOpen 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isOpen ? 'bg-white' : 'bg-gray-500'
                  } animate-pulse`}></div>
                  {isOpen &&'LIVE & READY TO PLAY' }
                </div>
                }
              </div>

              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-none tracking-tight">
                <span className="bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">
                  {curTurf.name.split(' ')[0]}
                </span>
                <br />
                <span className="text-red-500">
                  {curTurf.name.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              {/* Location */}
              <div className="flex items-center mb-8 text-xl text-red-200">
                <MapPin className="w-6 h-6 mr-3 text-red-500" />
                <button 
                  onClick={handleLocationClick}
                  className="hover:text-white transition-colors duration-300 border-b border-red-500/50 hover:border-white"
                >
                  {curTurf.location}
                </button>
              </div>

              {/* CTA Button */}
              <div className="mb-8">
                <button
                  onClick={()=> handleClick(curTurf.id)}
                  className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Play className="w-8 h-8 mr-3" />
                    Book Now
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className={`bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 transform transition-all duration-700 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Trophy className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-red-200 text-sm">Premium Service</div>
                </div>
                <div className={`bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 transform transition-all duration-700 delay-100 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Target className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-red-200 text-sm">Match Ready</div>
                </div>
                <div className={`bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 transform transition-all duration-700 delay-200 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">22</div>
                  <div className="text-red-200 text-sm">Player Capacity</div>
                </div>
                <div className={`bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 transform transition-all duration-700 delay-300 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-red-200 text-sm">Champion Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {curTurf.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'w-8 h-3 bg-red-500' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              } rounded-full`}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      </section>

      {/* Stadium-Style Info Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16">
        {/* Animated Red Accent Lines */}
        {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div> */}

        <div className="container mx-auto px-6">
          {/* Operating Hours - Stadium Style */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-black border-2 border-red-500 rounded-xl px-8 py-4">
              <Clock className="w-8 h-8 mr-4 text-red-500" />
              <div className="text-left">
                <div className="text-red-400 text-sm font-medium">MATCH HOURS</div>
                <div className="text-white text-xl font-bold">{curTurf.opening_time} - {curTurf.closing_time}</div>
              </div>
              <div className={`ml-6 px-4 py-2 rounded-lg font-bold ${
                isOpen 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {isOpen ? 'GAME ON!' : 'BREAK TIME'}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* About Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8">
              <h2 className="text-4xl font-black text-white mb-6 flex items-center">
                <Trophy className="w-10 h-10 mr-4 text-red-500" />
                THE ARENA
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {curTurf.description}
              </p>
              
              {/* Amenities - Jersey Number Style */}
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3" />
                CHAMPION FACILITIES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {curTurf.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="group flex items-center p-4 bg-black/60 border border-red-500/20 rounded-lg hover:border-red-500/60 hover:bg-red-900/20 transition-all duration-300"
                  >
                    <div className="text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="font-semibold text-white group-hover:text-red-100 transition-colors duration-300">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Booking Sidebar */}
            <div className="space-y-6">
              {/* Main Booking Card */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 border-2 border-red-400/50 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-black text-white mb-2">READY TO DOMINATE?</h3>
                  <p className="text-red-100">Book your championship slot now!</p>
                </div>

                <button
                  onClick={()=> handleClick(curTurf.id)}
                  className="w-full bg-black hover:bg-gray-900 text-white py-5 px-6 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/20 hover:border-white/40 mb-6 group"
                >
                  <div className="flex items-center justify-center">
                    <Calendar className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    BOOK YOUR SLOT
                  </div>
                </button>

                {/* Quick Contact */}
                <div className="grid grid-cols-3 gap-3">
                  {curTurf.contact_phone && (
                    <button
                      onClick={handleCall}
                      className="bg-black/40 hover:bg-black/60 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20"
                    >
                      <Phone className="w-5 h-5 mx-auto" />
                    </button>
                  )}
                  {curTurf.contact_phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="bg-black/40 hover:bg-black/60 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20"
                    >
                      <MessageCircle className="w-5 h-5 mx-auto" />
                    </button>
                  )}
                  {curTurf.contact_email && (
                    <button
                      onClick={handleEmail}
                      className="bg-black/40 hover:bg-black/60 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 border border-white/20"
                    >
                      <Mail className="w-5 h-5 mx-auto" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-black border border-red-500/30 rounded-xl p-6">
                <h4 className="font-bold text-red-400 mb-4 text-lg">TEAM CONTACT</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Ground Location</p>
                      <button 
                        onClick={handleLocationClick}
                        className="text-red-300 hover:text-red-100 transition-colors duration-300 text-sm"
                      >
                        {curTurf.location}
                      </button>
                    </div>
                  </div>

                  {curTurf.contact_phone && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Call Direct</p>
                        <button
                          onClick={handleCall}
                          className="text-red-300 hover:text-red-100 transition-colors duration-300 text-sm"
                        >
                          {curTurf.contact_phone}
                        </button>
                      </div>
                    </div>
                  )}

                  {curTurf.contact_email && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Email Team</p>
                        <button
                          onClick={handleEmail}
                          className="text-red-300 hover:text-red-100 transition-colors duration-300 text-sm"
                        >
                          {curTurf.contact_email}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Mobile Action */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={()=> handleClick(curTurf.id)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-red-400/50"
        >
          <Calendar className="w-7 h-7" />
        </button>
      </div>

      {/* Animated Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// export default RCBTurfHomepage;
/*Uncomment below code and remove above code to make multiple turfs*/ 
// import Image from 'next/image'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { 
//   MapPin, 
//   Clock, 
//   Shield, 
//   Star, 
//   Users, 
//   Calendar,
//   CheckCircle,
//   Phone
// } from 'lucide-react'

// export default function HomePage() {
//   const features = [
//     {
//       icon: Calendar,
//       title: 'Easy Booking',
//       description: 'Book your favorite turf in just a few clicks with our intuitive calendar system'
//     },
//     {
//       icon: Shield,
//       title: 'Secure Payments',
//       description: 'Safe and secure payment processing with multiple payment options'
//     },
//     {
//       icon: Clock,
//       title: 'Flexible Timing',
//       description: 'Choose from available time slots that fit your schedule perfectly'
//     },
//     {
//       icon: Phone,
//       title: 'Phone Verification',
//       description: 'Quick and secure login with OTP verification for your safety'
//     }
//   ]

//   const testimonials = [
//     {
//       name: 'Rahul Sharma',
//       rating: 5,
//       comment: 'Amazing turf quality and super easy booking process. Highly recommended!'
//     },
//     {
//       name: 'Priya Patel',
//       rating: 5,
//       comment: 'Great facilities and the online booking system is very convenient.'
//     },
//     {
//       name: 'Amit Kumar',
//       rating: 4,
//       comment: 'Good experience overall. The turf was well-maintained and staff was helpful.'
//     }
//   ]

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative h-[600px] flex items-center justify-center">
//         <div className="absolute inset-0">
//           <Image
//             src="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg"
//             alt="Cricket Ground"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-black/50" />
//         </div>
        
//         <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
//           <h1 className="text-5xl md:text-6xl font-bold mb-6">
//             Book Premium Cricket Turfs
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 text-gray-200">
//             Play your best game on professionally maintained cricket pitches. 
//             Easy booking, flexible timing, secure payments.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button asChild size="lg" className="text-lg px-8 py-6">
//               <Link href="/turfs">
//                 Book Now
//               </Link>
//             </Button>
//             <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-black">
//               <Link href="#features">
//                 Learn More
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Why Choose CricketTurf?</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               We provide the best cricket turf booking experience with modern facilities and seamless service
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <Card key={index} className="text-center hover:shadow-lg transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <feature.icon className="h-8 w-8 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Turf Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Featured Cricket Turf</h2>
//             <p className="text-xl text-gray-600">
//               Experience world-class cricket facilities
//             </p>
//           </div>
          
//           <div className="max-w-4xl mx-auto">
//             <Card className="overflow-hidden">
//               <div className="grid grid-cols-1 lg:grid-cols-2">
//                 <div className="relative h-64 lg:h-auto">
//                   <Image
//                     src="https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg"
//                     alt="Premium Cricket Turf"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-8">
//                   <div className="flex items-center mb-4">
//                     <Badge variant="secondary" className="mr-2">
//                       <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
//                       4.9
//                     </Badge>
//                     <Badge variant="outline">Premium</Badge>
//                   </div>
                  
//                   <h3 className="text-2xl font-bold mb-3">Champions Cricket Ground</h3>
                  
//                   <div className="flex items-center text-gray-600 mb-4">
//                     <MapPin className="h-4 w-4 mr-2" />
//                     <span>Andheri Sports Complex, Mumbai</span>
//                   </div>
                  
//                   <div className="space-y-3 mb-6">
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
//                       <span>Professional grade turf</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
//                       <span>Floodlights for night games</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
//                       <span>Changing rooms & equipment</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
//                       <span>Parking & refreshments</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center text-gray-600">
//                       <Users className="h-4 w-4 mr-1" />
//                       <span>22 players</span>
//                     </div>
//                     <div className="text-2xl font-bold text-green-600">
//                       From ₹800/hour
//                     </div>
//                   </div>
                  
//                   <Button asChild className="w-full" size="lg">
//                     <Link href="/turfs">
//                       Book This Turf
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">What Our Players Say</h2>
//             <p className="text-xl text-gray-600">
//               Join thousands of satisfied cricket enthusiasts
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {testimonials.map((testimonial, index) => (
//               <Card key={index} className="hover:shadow-lg transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="flex items-center mb-4">
//                     {Array.from({ length: testimonial.rating }).map((_, i) => (
//                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                   <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
//                   <p className="font-semibold">{testimonial.name}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-green-600 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
//           <p className="text-xl mb-8 text-green-100">
//             Book your cricket turf now and enjoy the best playing experience
//           </p>
//           <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
//             <Link href="/turfs">
//               Start Booking
//             </Link>
//           </Button>
//         </div>
//       </section>
//     </div>
//   )
// }
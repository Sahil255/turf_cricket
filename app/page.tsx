'use client'

import { useState, useEffect } from 'react'
import { TurfCard } from '@/components/turf/TurfCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin, Calendar, Users, Clock, CheckCircle, Phone, Mail, Wifi, Car, Coffee, Shield, Loader2Icon, ChevronLeft, ChevronRight, MessageCircle, Star, ShowerHead, Zap, Lightbulb } from 'lucide-react'
import { Turf } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast'


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
  
   useEffect(() => {
   
    // const isDarkMode = document.documentElement.classList.contains('dark');

    // if (isDarkMode) {
    //   console.log('Currently in dark mode');
    // } else {
    //   console.log('Currently in light mode');
    // }
    fetchTurfs();
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % curTurf.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [curTurf?.images.length]);

    // Check if turf is currently open
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const openTime = parseInt(curTurf.opening_time.replace(':', ''));
      const closeTime = parseInt(curTurf.closing_time.replace(':', ''));
      
      setIsOpen(currentTime >= openTime && currentTime <= closeTime && curTurf.active);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [curTurf?.opening_time, curTurf.closing_time, curTurf.active]);

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

  const filteredTurfs = turfs.filter(turf => {
    const matchesSearch = turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || turf.location.toLowerCase().includes(selectedLocation.toLowerCase())
    return matchesSearch && matchesLocation
  })

  const locations = [...new Set(turfs.map(turf => turf.location))]

  if (loading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Refreshments': Coffee,
    'Security': Shield,
    'Floodlights': Clock,
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('parking')) return <Car className="w-6 h-6" />;
    if (amenityLower.includes('wifi')) return <Wifi className="w-6 h-6" />;
    if (amenityLower.includes('changing') || amenityLower.includes('shower')) return <ShowerHead className="w-6 h-6" />;
    if (amenityLower.includes('refreshment') || amenityLower.includes('cafe') || amenityLower.includes('food')) return <Coffee className="w-6 h-6" />;
    if (amenityLower.includes('seating') || amenityLower.includes('seat')) return <Users className="w-6 h-6" />;
    if (amenityLower.includes('security')) return <Shield className="w-6 h-6" />;
    if (amenityLower.includes('light') || amenityLower.includes('flood')) return <Lightbulb className="w-6 h-6" />;
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
    setCurrentImageIndex((prev) => (prev + 1) % curTurf.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + curTurf.images.length) % curTurf.images.length);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {curTurf.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${curTurf.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {curTurf.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="container mx-auto px-6 pb-16">
              <div className="text-white max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  {curTurf.name}
                </h1>
                <div className="flex items-center mb-6 text-xl">
                  <MapPin className="w-6 h-6 mr-2 text-green-400" />
                  <button 
                    onClick={handleLocationClick}
                    className="hover:text-green-400 transition-colors duration-200 cursor-pointer underline"
                  >
                    {curTurf.location}
                  </button>
                </div>
                <button
                  onClick={()=> handleClick(curTurf.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-2xl"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white shadow-md border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium">
                  {curTurf.opening_time} - {curTurf.closing_time}
                </span>
                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                  isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {curTurf.contact_phone && (
                <button
                  onClick={handleCall}
                  className="flex items-center bg-blue-600 hover:bg-primary-700 text-accent px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </button>
              )}
              {curTurf.contact_phone && (
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Ground</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {curTurf.description}
            </p>
            
            {/* Amenities */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Facilities & Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {curTurf.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-green-600 mr-3">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="font-medium text-gray-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Booking & Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Play?</h3>
                <p className="text-gray-600">Book your slot now and enjoy the best cricket experience!</p>
              </div>

              <button
                onClick={()=>handleClick(curTurf.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg mb-6"
              >
                Book Now
              </button>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-sm text-gray-600">{curTurf.opening_time} - {curTurf.closing_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <button 
                        onClick={handleLocationClick}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 underline"
                      >
                        {curTurf.location}
                      </button>
                    </div>
                  </div>

                  {curTurf.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <button
                          onClick={handleCall}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          {curTurf.contact_phone}
                        </button>
                      </div>
                    </div>
                  )}

                  {curTurf.contact_email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <button
                          onClick={handleEmail}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          {curTurf.contact_email}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6 pt-6 border-t">
                  {curTurf.contact_phone && (
                    <button
                      onClick={handleCall}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </button>
                  )}
                  {curTurf.contact_phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Book Now Button for Mobile */}
      {/* <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={handleBookNow}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          <Calendar className="w-6 h-6" />
        </button>
      </div> */}

      {/* Status Indicator */}
      <div className="fixed top-6 right-6 z-40">
        <div className={`px-4 py-2 rounded-full text-white font-medium ${
          isOpen ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOpen ? 'bg-green-300' : 'bg-red-300'
            } animate-pulse`}></div>
            {isOpen ? 'Open Now' : 'Closed'}
          </div>
        </div>
      </div>
    </div>
  );
};
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
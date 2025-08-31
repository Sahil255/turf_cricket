'use client'

import { useState, useEffect } from 'react'
import { TurfCard } from '@/components/turf/TurfCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin, Calendar, Users, Clock, CheckCircle, Phone, Mail, Wifi, Car, Coffee, Shield, Loader2Icon } from 'lucide-react'
import { Turf } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function TurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
 const router = useRouter();
  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      console.log("redirecting..");
      setLoading(true)
      const response = await fetch('/api/turfs')
      if (response.ok) {
        const data = await response.json()
        
        setTurfs(data)
        //  if (data && data.length === 1) {
        //   router.push(`/turfs/${data[0].id}`);
        // }
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


  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        {/* <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display text-primary-600 dark:text-primary-400 mb-4">
            Book Your Perfect Turf
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 font-sans max-w-2xl mx-auto">
            Discover top-quality cricket turfs near you. Reserve your spot for an unforgettable game!
          </p>
        </section> */}

        {/* Turfs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {turfs.map((turf) => (
            <div
              key={turf.id}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-medium overflow-hidden hover:shadow-large transition-shadow duration-300 animate-slide-in"
            >
              <img
                src={turf.images[0]}
                alt={`${turf.name} turf`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-display text-secondary-900 dark:text-secondary-100 mb-2">
                  {turf.name}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 font-sans mb-4 line-clamp-2">
                  {turf.description}
                </p>
                <div className="flex items-center text-secondary-600 dark:text-secondary-400 font-sans mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{turf.location}</span>
                </div>
                <Link href={`/turfs/${turf.id}`}>
                  <Button
                   className={`
                     "text-lg px-8 py-6 hover:bg-primary-600 font-sans transition-colors duration-300 animate-bounce-in"
                      ${loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg hover:shadow-xl'
                      }
                    `}
                    size="lg" 
                    disabled = {loading}
                    aria-label={`View details and book ${turf.name}`}
                  >
                    
                    <Calendar className="h-5 w-5 mr-2" />
                    {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>loading...</span>
                  </div>
                ) : (
                  
                  'View Details & Book')}
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

             {/* Additional Info */}
            
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

               {/* Contact Information */}
            {(turf.contact_phone || turf.contact_email) && (
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
            )}

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
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
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
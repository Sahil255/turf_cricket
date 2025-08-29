import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  Calendar,
  CheckCircle,
  Phone
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your favorite turf in just a few clicks with our intuitive calendar system'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options'
    },
    {
      icon: Clock,
      title: 'Flexible Timing',
      description: 'Choose from available time slots that fit your schedule perfectly'
    },
    {
      icon: Phone,
      title: 'Phone Verification',
      description: 'Quick and secure login with OTP verification for your safety'
    }
  ]

  const testimonials = [
    {
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Amazing turf quality and super easy booking process. Highly recommended!'
    },
    {
      name: 'Priya Patel',
      rating: 5,
      comment: 'Great facilities and the online booking system is very convenient.'
    },
    {
      name: 'Amit Kumar',
      rating: 4,
      comment: 'Good experience overall. The turf was well-maintained and staff was helpful.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg"
            alt="Cricket Ground"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Book Premium Cricket Turfs
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Play your best game on professionally maintained cricket pitches. 
            Easy booking, flexible timing, secure payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/turfs">
                Book Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-black">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CricketTurf?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best cricket turf booking experience with modern facilities and seamless service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Turf Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Cricket Turf</h2>
            <p className="text-xl text-gray-600">
              Experience world-class cricket facilities
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src="https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg"
                    alt="Premium Cricket Turf"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="secondary" className="mr-2">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      4.9
                    </Badge>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">Champions Cricket Ground</h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Andheri Sports Complex, Mumbai</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Professional grade turf</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Floodlights for night games</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Changing rooms & equipment</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Parking & refreshments</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>22 players</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      From ₹800/hour
                    </div>
                  </div>
                  
                  <Button asChild className="w-full" size="lg">
                    <Link href="/turfs">
                      Book This Turf
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Players Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied cricket enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 text-green-100">
            Book your cricket turf now and enjoy the best playing experience
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/turfs">
              Start Booking
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">RCB CricketTurf</h3>
            <p className="text-gray-300 mb-4">
              Book premium cricket turfs with ease. Play your best game on our well-maintained pitches.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/turfs" className="hover:text-green-400 transition-colors">
                  Book Turf
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Cricket Turf Booking</li>
              <li>Tournament Hosting</li>
              <li>Equipment Rental</li>
              <li>Coaching Sessions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <span>123 Sports Complex, Cricket Lane, Mumbai, Maharashtra 400001</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@rcbcricketturf.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RCB CricketTurf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
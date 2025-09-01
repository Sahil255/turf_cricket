
'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Turf } from '@/types';
import { toast } from '@/hooks/use-toast';

export function Footer() {
  
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
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
        fetchTurfs();
      }, [])

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
      }
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">{curTurf.name}</h3>
            <p className="text-gray-300 mb-4">
             {curTurf.description}
            </p>
            <div className="flex space-x-4">
              {curTurf.contact_phone && (
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span onClick={handleCall}>{curTurf.contact_phone}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/turfs" className="hover:text-red-400 transition-colors">
                  Book Turf
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
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
                <span onClick={handleLocationClick}>{curTurf.location}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span onClick={handleEmail}>{curTurf.contact_email}</span>
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
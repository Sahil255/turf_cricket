"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types"
import { useEffect, useState } from "react"


// app/bookings/page.tsx
export default function BookingsPage() {

    const { user, firebaseUser } = useAuth();
    const [turfs, setTurfs] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')

    useEffect(() => {
    fetchMyBookings()
    }, [])

    const fetchMyBookings = async () => {
    try {
        console.log("SH fetching booking details");
          let headers: HeadersInit = {};
        if (user) {
          const token = await firebaseUser?.getIdToken();
          headers = { Authorization: `Bearer ${token}` };
        } else {
          console.warn('No user authenticated, skipping Authorization header');
        }
        const response = await fetch('/api/bookings',{headers})
        if (response.ok) {
        const data = await response.json()
        setTurfs(data)
        console.debug(data);
        }
    } catch (error) {
        console.error('Error fetching turfs:', error)
    } finally {
        setLoading(false)
    }
    }

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
  
  return (
    <div>
      <h1>My Bookings</h1>
      <pre>d</pre>
    </div>
  );
}

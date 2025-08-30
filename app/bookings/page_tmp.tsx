'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  IndianRupee, 
  User, 
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  booking_status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  turf: {
    name: string;
    location: string;
  };
  user: {
    name: string;
    phone: string;
  };
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
   const { user, firebaseUser } = useAuth()
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
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
      const bookings = await response.json()
      setBookings(bookings || []);
      console.debug(bookings);
      }
      // const { bookings } = await response.json();
      // console.log(bookings);
      // setBookings(bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string, type: 'booking' | 'payment') => {
    try {
      const updateData = type === 'booking' 
        ? { booking_status: newStatus }
        : { payment_status: newStatus };
      const token = await firebaseUser?.getIdToken();
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type === 'booking' ? 'Booking' : 'Payment'} status updated successfully`,
        });
        fetchBookings();
      } else {
        const { error } = await response.json();
        toast({
          title: "Error",
          description: error || 'Failed to update status',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': 
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': 
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600">View and manage all turf bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by turf name, user name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Turf & User</p>
                      <p className="font-semibold">{booking.turf.name}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {booking.user.name} ({booking.user.phone})
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold">
                        {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Amount & Duration</p>
                      <p className="font-semibold flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {booking.total_amount}
                      </p>
                      <p className="text-sm text-gray-600">{booking.duration_minutes} minutes</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <div className="space-y-1">
                        <Badge variant={getStatusBadgeVariant(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                        <br />
                        <Badge variant={getStatusBadgeVariant(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-4">
                    <p>Payment Status
                      <p>{booking.payment_status}</p>
                    </p>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredBookings.length === 0 && (
            <Card className="text-center p-12">
              <CardContent>
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Bookings Found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No bookings match your current filters.' 
                    : 'No bookings have been made yet.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
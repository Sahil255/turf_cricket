'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee,
  TrendingUp 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTurfs: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // This would be implemented with proper API endpoints
      // For now, setting dummy data
      setStats({
        totalTurfs: 1,
        totalBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentBookings: [],
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your cricket turf business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Turfs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTurfs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <IndianRupee className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => window.location.href = '/admin/turfs'}>
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Manage Turfs</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => window.location.href = '/admin/bookings'}>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">View Bookings</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Authentication</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <Badge variant="outline">Ready for Integration</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
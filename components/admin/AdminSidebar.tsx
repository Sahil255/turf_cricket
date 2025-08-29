'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users,
  Settings
} from 'lucide-react';

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/turfs', icon: MapPin, label: 'Turfs' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/pricing', icon: IndianRupee, label: 'Pricing' },
  { href: '/admin/users', icon: Users, label: 'Users' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-800">Cricket Turf Admin</h2>
        <p className="text-sm text-gray-600">Management Dashboard</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-green-100 text-green-700 hover:bg-green-100"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
// </invoke>
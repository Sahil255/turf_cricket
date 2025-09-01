'use client';

import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface BookingCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

export function BookingCalendar({ onDateSelect, selectedDate }: BookingCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
      console.log("SH date change ",value);
      // const formattedDate = value.toISOString().split('T')[0];
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(value.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      
      console.log("SH date change form: ",formattedDate);
      onDateSelect(formattedDate);
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-red-600" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            // value={date}
            defaultValue={null}
            tileDisabled={tileDisabled}
            className="w-full border-none"
            prev2Label={null}
            next2Label={null}
          />
        </div>
        
        <style jsx global>{`
          .react-calendar {
            border: none !important;
            font-family: inherit;
          }
          
          .react-calendar__tile {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin: 2px;
            padding: 8px 4px;
            background: white;
            transition: all 0.2s;
          }
          
          .react-calendar__tile:hover:not(:disabled) {
            background: #CE4C4C  ; 
            border-color: #16a34a;
          }
          
          .react-calendar__tile--active {
            background: #E31E24 !important;
            border-color: #FF0000 !important;
            color: white !important;
          }
          
          .react-calendar__tile:disabled {
            background: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
          }
          
          .react-calendar__navigation button {
            color: #E31E24;
            font-size: 16px;
            font-weight: 600;
          }
          
          .react-calendar__navigation button:hover {
            background: #E31E24;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
// </invoke>
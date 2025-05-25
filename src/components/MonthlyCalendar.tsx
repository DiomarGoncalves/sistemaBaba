import React from 'react';
import { Shift, Babysitter } from '../types';

interface MonthlyCalendarProps {
  month: Date;
  shifts: Shift[];
  babysitters: Babysitter[];
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ month, shifts, babysitters }) => {
  // Get the first day of the month
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  
  // Get the last day of the month
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // Get the day of the week for the first day (0 = Sunday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Get the number of days in the month
  const daysInMonth = lastDay.getDate();
  
  // Generate calendar days array
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  
  // Group shifts by date
  const shiftsByDate: Record<string, Shift[]> = {};
  shifts.forEach(shift => {
    if (!shiftsByDate[shift.date]) {
      shiftsByDate[shift.date] = [];
    }
    shiftsByDate[shift.date].push(shift);
  });
  
  // Get babysitter by ID
  const getBabysitter = (id: string) => {
    return babysitters.find(b => b.id === id);
  };
  
  // Get total hours for a specific day
  const getDayTotalHours = (date: string) => {
    if (!shiftsByDate[date]) return 0;
    return shiftsByDate[date].reduce((total, shift) => total + shift.hoursWorked, 0);
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="bg-white">
        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="px-4 py-2 text-center text-sm font-semibold text-gray-900 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="bg-gray-50 h-32" />;
            }
            
            const dateString = formatDate(day);
            const dayShifts = shiftsByDate[dateString] || [];
            const totalHours = getDayTotalHours(dateString);
            const isToday = new Date().toDateString() === day.toDateString();
            
            return (
              <div 
                key={dateString} 
                className={`min-h-32 bg-white p-2 ${isToday ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </span>
                  {totalHours > 0 && (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                      {totalHours.toFixed(1)}h
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 max-h-[88px] overflow-y-auto">
                  {dayShifts.map((shift) => {
                    const babysitter = getBabysitter(shift.babysitterId);
                    return (
                      <div 
                        key={shift.id} 
                        className="text-xs rounded-md bg-purple-50 border border-purple-100 px-2 py-1"
                      >
                        <div className="font-medium text-purple-700 truncate">
                          {babysitter?.name || 'crianças desconhecida'}
                        </div>
                        <div className="text-purple-600">
                          {shift.startTime} - {shift.endTime} ({shift.hoursWorked.toFixed(1)}h)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { useBabysitter } from '../contexts/BabysitterContext';
import { useShift } from '../contexts/ShiftContext';
import DashboardStats from '../components/DashboardStats';
import RecentShiftsList from '../components/RecentShiftsList';

const Dashboard: React.FC = () => {
  const { babysitters } = useBabysitter();
  const { shifts, calculateTotalHours, calculateTotalAmount } = useShift();
  
  // Get today's shifts
  const today = new Date().toISOString().split('T')[0];
  const todaysShifts = shifts.filter(shift => shift.date === today);
  
  // Calculate monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
  });
  
  const monthlyHours = calculateTotalHours(currentMonthShifts);
  const monthlyAmount = calculateTotalAmount(currentMonthShifts);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/shifts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Shift
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Total Babysitters"
          value={babysitters.length}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100"
        />
        
        <DashboardStats
          title="Today's Shifts"
          value={todaysShifts.length}
          icon={<Clock className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
        
        <DashboardStats
          title="Monthly Hours"
          value={`${monthlyHours.toFixed(1)}h`}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          bg="bg-amber-100"
        />
        
        <DashboardStats
          title="Monthly Amount"
          value={`$${monthlyAmount.toFixed(2)}`}
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          bg="bg-purple-100"
        />
      </div>
      
      {/* Recent shifts */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Shifts</h2>
          <Link 
            to="/shifts" 
            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <RecentShiftsList shifts={shifts.slice(0, 5)} />
      </div>
      
      {babysitters.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No babysitters added yet</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Start by adding your first babysitter to the system.</p>
              </div>
              <div className="mt-4">
                <Link
                  to="/babysitters/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Babysitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
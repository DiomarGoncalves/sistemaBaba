import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Edit } from 'lucide-react';
import { Shift } from '../types';
import { useBabysitter } from '../contexts/BabysitterContext';

interface RecentShiftsListProps {
  shifts: Shift[];
}

const RecentShiftsList: React.FC<RecentShiftsListProps> = ({ shifts }) => {
  const { getBabysitterById } = useBabysitter();
  
  if (shifts.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
        Nenhum turno registrado ainda.
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {shifts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(shift => {
          const babysitter = getBabysitterById(shift.babysitterId);
          
          return (
            <li key={shift.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                        {babysitter?.name.charAt(0) || '?'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {babysitter?.name || 'crianças desconhecida'}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {new Date(shift.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-gray-900">
                        {shift.hoursWorked.toFixed(1)} horas
                      </div>
                      <div className="text-sm text-gray-500">
                        R${shift.amount.toFixed(2)}
                      </div>
                    </div>
                    <Link
                      to={`/shifts/${shift.id}`}
                      className="ml-4 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                {shift.notes && (
                  <div className="mt-2 ml-14 text-sm text-gray-500 italic">
                    {shift.notes}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentShiftsList;
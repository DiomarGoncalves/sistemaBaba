import React from 'react';
import { BarChart3, PieChart, Clock } from 'lucide-react';
import { Shift, Babysitter } from '../types';
import { useShift } from '../contexts/ShiftContext';

interface ReportSummaryProps {
  shifts: Shift[];
  babysitters: Babysitter[];
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ 
  shifts, 
  babysitters, 
  period,
  startDate,
  endDate
}) => {
  const { calculateTotalHours, calculateTotalAmount } = useShift();
  
  // Calculate totals
  const totalHours = calculateTotalHours(shifts);
  const totalAmount = calculateTotalAmount(shifts);
  
  // Group shifts by babysitter
  const shiftsByBabysitter: Record<string, Shift[]> = {};
  shifts.forEach(shift => {
    if (!shiftsByBabysitter[shift.babysitterId]) {
      shiftsByBabysitter[shift.babysitterId] = [];
    }
    shiftsByBabysitter[shift.babysitterId].push(shift);
  });
  
  // Calculate stats for each babysitter
  const babysitterStats = Object.entries(shiftsByBabysitter).map(([id, babysitterShifts]) => {
    const babysitter = babysitters.find(b => b.id === id);
    const hours = calculateTotalHours(babysitterShifts);
    const amount = calculateTotalAmount(babysitterShifts);
    
    return {
      id,
      name: babysitter?.name || 'Unknown',
      hours,
      amount,
      shiftsCount: babysitterShifts.length,
      color: getBabysitterColor(id),
    };
  }).sort((a, b) => b.hours - a.hours);
  
  // Get a deterministic color for a babysitter
  function getBabysitterColor(id: string): string {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ];
    
    // Use the id to pick a consistent color
    const index = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Horas
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {totalHours.toFixed(1)}h
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Valor Total
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    R${totalAmount.toFixed(2)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-100">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Turnos
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {shifts.length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo por crianças
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {new Date(startDate).toLocaleDateString('pt-BR')} - {new Date(endDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        {babysitterStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    crianças
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turnos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % do Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {babysitterStats.map((stat) => (
                  <tr key={stat.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${stat.color.replace('bg-', 'bg-')} flex items-center justify-center text-white`}>
                          {stat.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.shiftsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.hours.toFixed(1)}h</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">R${stat.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {totalHours > 0 ? ((stat.hours / totalHours) * 100).toFixed(1) : '0'}%
                        </div>
                        <div className="ml-2 w-full bg-gray-200 rounded-full h-2.5 max-w-[150px]">
                          <div 
                            className={`h-2.5 rounded-full ${stat.color}`} 
                            style={{ width: `${totalHours > 0 ? (stat.hours / totalHours) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-5 text-center text-sm text-gray-500">
            Nenhum dado disponível para o período selecionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSummary;
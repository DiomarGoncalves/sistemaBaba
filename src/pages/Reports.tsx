import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useBabysitter } from '../contexts/BabysitterContext';
import { exportToPDF } from '../utils/exportToPDF';
import { exportToExcel } from '../utils/exportToExcel';
import ReportSummary from '../components/ReportSummary';
import MonthlyCalendar from '../components/MonthlyCalendar';

const Reports: React.FC = () => {
  const { shifts } = useShift();
  const { babysitters } = useBabysitter();
  
  const [selectedBabysitter, setSelectedBabysitter] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Initialize date range based on current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, [currentMonth]);
  
  // Filter shifts based on selected criteria
  const filteredShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;
    
    const dateMatch = (!startDateObj || shiftDate >= startDateObj) && 
                     (!endDateObj || shiftDate <= endDateObj);
    
    const babysitterMatch = !selectedBabysitter || shift.babysitterId === selectedBabysitter;
    
    return dateMatch && babysitterMatch;
  });
  
  // Go to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Handle export to PDF
  const handleExportPDF = () => {
    const title = `Shift Report - ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
    exportToPDF(filteredShifts, title, babysitters);
  };
  
  // Handle export to Excel
  const handleExportExcel = () => {
    const title = `Shift Report - ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
    exportToExcel(filteredShifts, title, babysitters);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 shadow sm:rounded-md space-y-4">
        <div className="flex items-center text-sm text-gray-700">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filtros do Relatório</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Babysitter filter */}
          <div>
            <label htmlFor="babysitter" className="block text-sm font-medium text-gray-700">
              Criança
            </label>
            <select
              id="babysitter"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={selectedBabysitter}
              onChange={(e) => setSelectedBabysitter(e.target.value)}
            >
              <option value="">Todas as crianças</option>
              {babysitters.map(babysitter => (
                <option key={babysitter.id} value={babysitter.id}>
                  {babysitter.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Period selector */}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700">
              Tipo de Período
            </label>
            <select
              id="period"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          
          {/* Date range */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Month navigator */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={previousMonth}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-900">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { key: 'daily', label: 'Diário' },
              { key: 'weekly', label: 'Semanal' },
              { key: 'monthly', label: 'Mensal' }
            ].map((period) => (
              <button
                key={period.key}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedPeriod === period.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPeriod(period.key as 'daily' | 'weekly' | 'monthly')}
              >
                {period.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 sm:p-6">
          <ReportSummary 
            shifts={filteredShifts} 
            babysitters={babysitters} 
            period={selectedPeriod}
            startDate={startDate}
            endDate={endDate}
          />
          
          {selectedPeriod === 'monthly' && (
            <div className="mt-6">
              <MonthlyCalendar 
                month={currentMonth} 
                shifts={filteredShifts}
                babysitters={babysitters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
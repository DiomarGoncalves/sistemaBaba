import * as XLSX from 'xlsx';
import { Shift, Babysitter } from '../types';
import { formatTime12Hour } from './timeCalculations';

export const exportToExcel = (shifts: Shift[], title: string, babysitters: Babysitter[]): void => {
  // Prepare data for Excel
  const excelData = shifts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(shift => {
      const babysitter = babysitters.find(b => b.id === shift.babysitterId);
      return {
        'Date': new Date(shift.date).toLocaleDateString(),
        'Babysitter': babysitter?.name || 'Unknown',
        'Start Time': formatTime12Hour(shift.startTime),
        'End Time': formatTime12Hour(shift.endTime),
        'Hours Worked': shift.hoursWorked.toFixed(1),
        'Hourly Rate': babysitter ? `$${babysitter.hourlyRate.toFixed(2)}` : 'N/A',
        'Amount': `$${shift.amount.toFixed(2)}`,
        'Holiday/Special': shift.isHoliday ? 'Yes' : 'No',
        'Notes': shift.notes || '',
      };
    });
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create a worksheet from the data
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const colWidths = [
    { wch: 12 }, // Date
    { wch: 20 }, // Babysitter
    { wch: 12 }, // Start Time
    { wch: 12 }, // End Time
    { wch: 14 }, // Hours Worked
    { wch: 12 }, // Hourly Rate
    { wch: 12 }, // Amount
    { wch: 15 }, // Holiday/Special
    { wch: 30 }, // Notes
  ];
  ws['!cols'] = colWidths;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Shifts');
  
  // Add a summary sheet
  const summaryData = [];
  
  // Group shifts by babysitter
  const shiftsByBabysitter: Record<string, Shift[]> = {};
  shifts.forEach(shift => {
    if (!shiftsByBabysitter[shift.babysitterId]) {
      shiftsByBabysitter[shift.babysitterId] = [];
    }
    shiftsByBabysitter[shift.babysitterId].push(shift);
  });
  
  // Create summary rows for each babysitter
  Object.entries(shiftsByBabysitter).forEach(([id, babysitterShifts]) => {
    const babysitter = babysitters.find(b => b.id === id);
    const totalHours = babysitterShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
    const totalAmount = babysitterShifts.reduce((sum, shift) => sum + shift.amount, 0);
    
    summaryData.push({
      'Babysitter': babysitter?.name || 'Unknown',
      'Total Shifts': babysitterShifts.length,
      'Total Hours': totalHours.toFixed(1),
      'Total Amount': `$${totalAmount.toFixed(2)}`,
      'Average Hours Per Shift': (totalHours / babysitterShifts.length).toFixed(1),
    });
  });
  
  // Add grand total
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
  const totalAmount = shifts.reduce((sum, shift) => sum + shift.amount, 0);
  
  summaryData.push({
    'Babysitter': 'GRAND TOTAL',
    'Total Shifts': shifts.length,
    'Total Hours': totalHours.toFixed(1),
    'Total Amount': `$${totalAmount.toFixed(2)}`,
    'Average Hours Per Shift': shifts.length > 0 ? (totalHours / shifts.length).toFixed(1) : '0.0',
  });
  
  // Create summary worksheet
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  
  // Set column widths for summary
  const summaryColWidths = [
    { wch: 20 }, // Babysitter
    { wch: 12 }, // Total Shifts
    { wch: 12 }, // Total Hours
    { wch: 14 }, // Total Amount
    { wch: 22 }, // Average Hours Per Shift
  ];
  summaryWs['!cols'] = summaryColWidths;
  
  // Add the summary worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `babysitter-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};
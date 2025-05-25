import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Shift, Babysitter } from '../types';
import { formatTime12Hour } from './timeCalculations';

// Extend the jsPDF type to include autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (shifts: Shift[], title: string, babysitters: Babysitter[]): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare data for the table
  const tableData = shifts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(shift => {
      const babysitter = babysitters.find(b => b.id === shift.babysitterId);
      const date = new Date(shift.date).toLocaleDateString();
      
      return [
        date,
        babysitter?.name || 'Unknown',
        formatTime12Hour(shift.startTime),
        formatTime12Hour(shift.endTime),
        `${shift.hoursWorked.toFixed(1)} hrs`,
        `$${shift.amount.toFixed(2)}`,
        shift.notes || '',
      ];
    });
  
  // Calculate totals
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
  const totalAmount = shifts.reduce((sum, shift) => sum + shift.amount, 0);
  
  // Add table
  doc.autoTable({
    head: [['Date', 'Babysitter', 'Start', 'End', 'Hours', 'Amount', 'Notes']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 'auto' },
    },
  });
  
  // Add summary information
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Hours: ${totalHours.toFixed(1)} hrs`, 14, finalY);
  doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, finalY + 7);
  doc.text(`Total Shifts: ${shifts.length}`, 14, finalY + 14);
  
  // Save the PDF
  doc.save(`babysitter-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
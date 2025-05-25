export interface Babysitter {
  id: string;
  name: string;
  hourlyRate: number;
  isActive: boolean;
}

export interface Shift {
  id: string;
  babysitterId: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  amount: number;
  notes?: string;
  isHoliday?: boolean;
}
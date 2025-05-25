import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Shift } from '../types';
import { useBabysitter } from './BabysitterContext';
import { api } from '../services/api'; // Importe o serviço da API

interface ShiftContextType {
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Omit<Shift, 'id'>) => void;
  deleteShift: (id: string) => void;
  getShiftById: (id: string) => Shift | undefined;
  calculateTotalHours: (shifts: Shift[]) => number;
  calculateTotalAmount: (shifts: Shift[]) => number;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};

interface ShiftProviderProps {
  children: React.ReactNode;
}

export const ShiftProvider: React.FC<ShiftProviderProps> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const { getBabysitterById } = useBabysitter();
  
  // Carregar turnos do backend
  const fetchShifts = async () => {
    const data = await api.getShifts();
    setShifts(data);
  };

  useEffect(() => {
    fetchShifts();
  }, []);
  
  const addShift = async (shiftData: Omit<Shift, 'id'>) => {
    await api.addShift(shiftData);
    fetchShifts();
  };
  
  const updateShift = async (id: string, shiftData: Omit<Shift, 'id'>) => {
    await api.updateShift(id, shiftData);
    fetchShifts();
  };
  
  const deleteShift = async (id: string) => {
    await api.deleteShift(id);
    fetchShifts();
  };
  
  const getShiftById = (id: string) => {
    return shifts.find(shift => shift.id === id);
  };
  
  const calculateTotalHours = (shiftsToCalculate: Shift[]) => {
    return shiftsToCalculate.reduce((total, shift) => total + shift.hoursWorked, 0);
  };
  
  const calculateTotalAmount = (shiftsToCalculate: Shift[]) => {
    return shiftsToCalculate.reduce((total, shift) => {
      return total + shift.amount;
    }, 0);
  };
  
  return (
    <ShiftContext.Provider value={{
      shifts,
      addShift,
      updateShift,
      deleteShift,
      getShiftById,
      fetchShifts,
      calculateTotalHours,
      calculateTotalAmount,
    }}>
      {children}
    </ShiftContext.Provider>
  );
};
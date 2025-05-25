import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlarmClock } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useBabysitter } from '../contexts/BabysitterContext';
import { calculateHoursWorked } from '../utils/timeCalculations';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const ShiftForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addShift, updateShift, getShiftById } = useShift();
  const { babysitters } = useBabysitter();
  
  const [babysitterId, setBabysitterId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  
  const [calculatedHours, setCalculatedHours] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  
  const isEditing = Boolean(id);
  
  // Set default times if none are set
  useEffect(() => {
    if (!startTime) {
      setStartTime('09:00');
    }
    if (!endTime) {
      setEndTime('17:00');
    }
  }, []);
  
  // Load shift data if editing
  useEffect(() => {
    if (isEditing && id) {
      const shift = getShiftById(id);
      if (shift) {
        setBabysitterId(shift.babysitterId);
        setDate(shift.date);
        setStartTime(shift.startTime);
        setEndTime(shift.endTime);
        setNotes(shift.notes || '');
        setIsHoliday(shift.isHoliday || false);
      } else {
        toast.error('Shift not found');
        navigate('/shifts');
      }
    }
  }, [id, isEditing, getShiftById, navigate]);
  
  // Calculate hours and amount when inputs change
  useEffect(() => {
    if (babysitterId && startTime && endTime) {
      const hours = calculateHoursWorked(startTime, endTime);
      setCalculatedHours(hours);
      
      const babysitter = babysitters.find(b => b.id === babysitterId);
      if (babysitter) {
        let amount = hours * babysitter.hourlyRate;
        // Apply holiday rate if applicable (e.g., 1.5x)
        if (isHoliday) {
          amount *= 1.5;
        }
        setCalculatedAmount(amount);
      }
    }
  }, [babysitterId, startTime, endTime, isHoliday, babysitters]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!babysitterId) {
      toast.error('Please select a babysitter');
      return;
    }
    
    if (!date) {
      toast.error('Please enter a date');
      return;
    }
    
    if (!startTime || !endTime) {
      toast.error('Please enter both start and end times');
      return;
    }
    
    const shiftData = {
      babysitterId,
      date,
      startTime,
      endTime,
      notes: notes.trim(),
      isHoliday,
      hoursWorked: calculatedHours,
      amount: calculatedAmount,
    };
    
    try {
      if (isEditing && id) {
        updateShift(id, shiftData);
        toast.success('Shift updated successfully');
      } else {
        // Gera um id único para o novo turno
        addShift({ ...shiftData, id: uuidv4() });
        toast.success('Shift recorded successfully');
      }
      navigate('/shifts');
    } catch (error) {
      toast.error('An error occurred');
    }
  };
  
  // Set current time for quick entry
  const setCurrentTime = (field: 'start' | 'end') => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    if (field === 'start') {
      setStartTime(timeString);
    } else {
      setEndTime(timeString);
    }
  };
  
  const activeBabysitters = babysitters.filter(b => b.isActive);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Link
            to="/shifts"
            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Shift' : 'Record Shift'}
          </h1>
        </div>
        <button
          type="submit"
          form="shift-form"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form id="shift-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="babysitter" className="block text-sm font-medium text-gray-700">
                Babysitter
              </label>
              <div className="mt-1">
                <select
                  id="babysitter"
                  name="babysitter"
                  value={babysitterId}
                  onChange={(e) => setBabysitterId(e.target.value)}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select a babysitter</option>
                  {activeBabysitters.length > 0 ? (
                    activeBabysitters.map((babysitter) => (
                      <option key={babysitter.id} value={babysitter.id}>
                        {babysitter.name} (R${babysitter.hourlyRate.toFixed(2)}/h)
                      </option>
                    ))
                  ) : (
                    <option disabled>No active babysitters found</option>
                  )}
                </select>
              </div>
              {activeBabysitters.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  <Link to="/babysitters/new" className="font-medium text-red-600 hover:text-red-500">
                    Add a babysitter first
                  </Link>
                </p>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentTime('start')}
                    className="p-1 rounded-md text-gray-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <AlarmClock className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentTime('end')}
                    className="p-1 rounded-md text-gray-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <AlarmClock className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any special notes about this shift"
                ></textarea>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="isHoliday"
                  name="isHoliday"
                  type="checkbox"
                  checked={isHoliday}
                  onChange={(e) => setIsHoliday(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isHoliday" className="ml-2 block text-sm text-gray-700">
                  Holiday/Special Rate (1.5x)
                </label>
              </div>
            </div>
          </div>
        </form>
        {/* Calculation summary */}
        {babysitterId && calculatedHours > 0 && (
          <div className="bg-gray-50 rounded-md p-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700">Calculation Summary</h3>
            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
              <div className="text-gray-500">Hours Worked</div>
              <div className="text-gray-900 font-medium">{calculatedHours.toFixed(1)} hours</div>
              
              <div className="text-gray-500">Hourly Rate</div>
              <div className="text-gray-900 font-medium">
                ${babysitters.find(b => b.id === babysitterId)?.hourlyRate.toFixed(2) || '0.00'}
                {isHoliday && <span className="text-purple-600"> (1.5x holiday rate)</span>}
              </div>
              
              <div className="text-gray-500">Total Amount</div>
              <div className="text-gray-900 font-bold">${calculatedAmount.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftForm;
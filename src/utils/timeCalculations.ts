/**
 * Calculate hours worked between start and end times
 * @param startTime Time in HH:MM format
 * @param endTime Time in HH:MM format
 * @returns Number of hours worked (decimal)
 */
export const calculateHoursWorked = (startTime: string, endTime: string): number => {
  // Parse times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;
  
  // Handle overnight shifts (end time is earlier than start time)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add a day worth of minutes
  }
  
  // Calculate difference in minutes and convert to hours
  const minutesWorked = endMinutes - startMinutes;
  return minutesWorked / 60;
};

/**
 * Format time in 12-hour format
 * @param time Time in HH:MM format
 * @returns Formatted time (e.g., "2:30 PM")
 */
export const formatTime12Hour = (time: string): string => {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // Convert 0 to 12
  
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
};
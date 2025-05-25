const API_URL = 'http://localhost:3000/api';

export const api = {
  // crianças
  getBabysitters: async () => {
    const res = await fetch(`${API_URL}/babas`);
    return res.json();
  },
  addBabysitter: async (data: any) => {
    await fetch(`${API_URL}/babas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  updateBabysitter: async (id: string, data: any) => {
    await fetch(`${API_URL}/babas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  deleteBabysitter: async (id: string) => {
    await fetch(`${API_URL}/babas/${id}`, { method: 'DELETE' });
  },

  // Turnos
  getShifts: async () => {
    const res = await fetch(`${API_URL}/turnos`);
    return res.json();
  },
  addShift: async (data: any) => {
    // data deve conter id, babysitterId, date, startTime, endTime, notes, isHoliday, hoursWorked, amount
    await fetch(`${API_URL}/turnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  updateShift: async (id: string, data: any) => {
    await fetch(`${API_URL}/turnos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  deleteShift: async (id: string) => {
    await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
  },
};
